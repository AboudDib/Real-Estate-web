// controllers/resendController.js
const resendService = require('../services/resendService'); // Import the resend service

//currently email verification was disable due trial expiry
// Controller for sending the verification code
exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Call the resend service to send the email
    const result = await resendService.sendVerificationCode(email);

    if (result.success) {
      return res.status(200).json({ message: result.message, verificationCode: result.verificationCode });
    } else {
      return res.status(500).json({ message: result.message });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

