// services/resendService.js
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const sendVerificationCode = async (email) => {
  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const emailBody = {
      from: 'onboarding@resend.dev', // Use Resend's default sender for testing
      to: email,
      subject: 'Your Verification Code',
      text: `Your verification code is: ${verificationCode}`,
    };

   const response = await axios.post(
  'https://api.resend.com/emails', 
  emailBody,
  {
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
  }
);


    return {
      success: true,
      verificationCode,
      message: 'Verification code sent successfully',
      status: response.status,
    };
  } catch (error) {
    console.error('Error sending verification code:', error.response?.data || error.message);
    return { success: false, message: 'Failed to send verification code' };
  }
};

module.exports = {
  sendVerificationCode,
};
