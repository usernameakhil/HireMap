const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

exports.submitCollaboration = async (req, res) => {
  try {
    const { name, email, vision } = req.body;

    // 1. Validation
    if (!name || !email || !vision) {
      return res.status(400).json({ message: "Information incomplete." });
    }

    // 2. Transmission
    // NOTE: 'to' must be your Resend account email if using onboarding@resend.dev
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', 
      to: process.env.ADMIN_EMAIL, 
      subject: `🚀 Collab Proposal: ${name}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>New Collaboration Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Sender Email:</strong> ${email}</p>
          <p><strong>Vision:</strong></p>
          <blockquote style="border-left: 4px solid #6366f1; padding-left: 15px; italic;">
            ${vision}
          </blockquote>
        </div>
      `,
    });

    // 3. Handle Resend-specific errors
    if (error) {
      console.error("❌ RESEND API REJECTION:", error);
      return res.status(400).json({ success: false, message: error.message });
    }

    console.log("✅ Transmission Successful:", data.id);
    res.status(200).json({ success: true, message: "Proposal Synced." });

  } catch (error) {
    // 4. Handle Server/Network errors
    console.error("💥 CRITICAL SERVER ERROR:", error);
    res.status(500).json({ success: false, message: "Internal Transmission Error." });
  }
};