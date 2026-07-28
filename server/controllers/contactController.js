const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handleContactInquiry = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation Check
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: "Neural link incomplete. All fields are mandatory." 
      });
    }

    // Transmission via Resend
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Default for sandbox; change after domain verification
      to: process.env.ADMIN_EMAIL,
      subject: `🚨 Support Node: Message from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #f1f5f9; border-radius: 24px;">
          <h2 style="color: #e11d48; margin-bottom: 20px;">Support Inquiry Received</h2>
          <p><strong>Identity:</strong> ${name}</p>
          <p><strong>Contact:</strong> ${email}</p>
          <div style="background: #fff1f2; padding: 20px; border-radius: 16px; margin-top: 20px; border-left: 4px solid #e11d48;">
            <p style="color: #9f1239; font-weight: 800; font-size: 10px; text-transform: uppercase; margin-bottom: 8px;">Transmission Content:</p>
            <p style="color: #1e293b; line-height: 1.6; margin: 0;">"${message}"</p>
          </div>
          <p style="font-size: 10px; color: #94a3b8; margin-top: 40px; text-align: center; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
            HireMap Support Core • Automated Relay
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return res.status(400).json({ success: false, message: "Sync failed at API level." });
    }

    res.status(200).json({ 
      success: true, 
      message: "Transmission successfully reached the support core." 
    });

  } catch (err) {
    console.error("Critical Contact Error:", err);
    res.status(500).json({ success: false, message: "Internal Neural Failure." });
  }
};