const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/studentProfile');
const Transaction = require('../models/Transaction');
const { syncCache } = require('./studentController');

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, coins, userId } = req.body;

    // 1. Validation: Ensure we have everything before hitting Razorpay
    if (!amount || !coins || !userId) {
      return res.status(400).json({ message: "Missing required fields: amount, coins, or userId" });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // Ensure it's a number and convert to paise
      currency: "INR",
      receipt: `rect_${Date.now()}`,
    };

    // 2. Create Razorpay Order
    const order = await rzp.orders.create(options);

    // 3. Log the intent in our DB
    // We use the Razorpay order ID as our internal reference
    await Transaction.create({
      userId,
      orderId: order.id,
      amount: Number(amount),
      coins: Number(coins),
      status: 'pending'
    });

    res.status(200).json(order);
  } catch (err) {
    console.error("RAZORPAY_ORDER_ERR:", err);
    // Send the actual Razorpay error message back for easier frontend debugging
    res.status(400).json({ 
      message: err.description || "Razorpay order creation failed", 
      error: err 
    });
  }
};

exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, coins } = req.body;

  try {
    // 1. Cryptographic Signature Verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Signature Mismatch!");
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // 2. Atomic Database Updates
    // We update the user and the transaction status. 
    // Using findByIdAndUpdate ensures we get the most recent 'coins' count.
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { coins: Number(coins) } },
      { new: true, runValidators: false }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found during credit update" });
    }

    // Mark transaction as success
    await Transaction.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { 
        status: 'success', 
        paymentId: razorpay_payment_id, 
        signature: razorpay_signature 
      }
    );

    // 3. Cache Synchronization
    try {
      if (typeof syncCache === 'function') {
        await syncCache(userId, user);
      }
    } catch (redisErr) {
      console.warn("⚠️ Redis Sync Failed:", redisErr.message);
      // We don't return an error here because the DB is already updated successfully.
    }

    res.status(200).json({ 
      success: true, 
      message: "Coins added successfully!", 
      newBalance: user.coins 
    });

  } catch (err) {
    console.error("VERIFICATION_CRITICAL_ERR:", err);
    res.status(500).json({ success: false, message: "Internal server error during verification" });
  }
};
