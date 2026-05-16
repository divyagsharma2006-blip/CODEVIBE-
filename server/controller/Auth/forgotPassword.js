// controller/Auth/forgotPassword.js
const UserModel = require("../../models/user.models");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");

// Rate limit: 5 requests per 10 minutes
const forgotPasswordLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { message: "Too many requests from this IP, please try again after 10 minutes" },
});

const forgotPasswordLogic = async (req, res, next) => {
  try {
    const { Email } = req.body;

    const user = await UserModel.findOne({ Email });
    
    // Always return a generic message to prevent email enumeration
    if (!user) {
      return res.status(200).json({ success: true, message: "If an account exists, you'll receive a reset link." });
    }

    // Generate 32-byte secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 15 * 60 * 1000; // 15 min validity

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    // Send email using Resend API (Test Mode)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("Missing RESEND_API_KEY");
      return res.status(500).json({ message: "Email service not configured properly" });
    }

    // Use environment variable if it exists, otherwise fallback to the live Netlify site
    const clientUrl = process.env.CLIENT_URL || "https://codevibeforyou.netlify.app";
    const resetLink = `${clientUrl}/ResetPassword?token=${token}`;
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Acme <onboarding@resend.dev>",
        to: [Email],
        subject: "Reset your password",
        html: `<p>Click here to reset your password: <a href="${resetLink}">${resetLink}</a></p><p>This link expires in 15 minutes.</p>`
      })
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error("Resend API error:", errorData);
      return res.status(500).json({ message: "Failed to send reset email" });
    }

    return res.status(200).json({ success: true, message: "If an account exists, you'll receive a reset link." });

  } catch (error) {
    console.error("Forgot password error:", error);
    next(error);
  }
};

// Export middleware array so router can use it
module.exports = [forgotPasswordLimiter, forgotPasswordLogic];
