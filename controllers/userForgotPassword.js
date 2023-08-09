const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { User } = require('./models');

const SMTP_CONFIG = {
  // Configure your SMTP settings here
};

const transporter = nodemailer.createTransport(SMTP_CONFIG);
 
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = generateResetToken();
    const resetTokenExpires = new Date(Date.now() + 3600000); // Token expires in 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await user.save();

    const mailOptions = {
      from: 'your-email@example.com',
      to: user.email,
      subject: 'Password Reset',
      text: `Use this token to reset your password: ${resetToken}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

function generateResetToken() {
  // Implement your token generation logic here
}

