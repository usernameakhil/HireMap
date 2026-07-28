const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  orderId: { type: String, required: true, unique: true },
  paymentId: { type: String }, // Populated after success
  signature: { type: String },
  amount: { type: Number, required: true },
  coins: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'success', 'failed'], 
    default: 'pending' 
  },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
