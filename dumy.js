const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { User } = require('./models');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-secret-key'; // Replace with your secret key
const SMTP_CONFIG = {
  // Configure your SMTP settings here
};

const transporter = nodemailer.createTransport(SMTP_CONFIG);

app.use(bodyParser.json());

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await db.user.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
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

app.post('/reset-password', async (req, res) => {
  const { email, resetToken, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.resetToken !== resetToken) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    if (user.resetTokenExpires < Date.now()) {
      return res.status(400).json({ error: 'Token has expired' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'Password reset failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});





const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// ... Configure your app and middlewares ...

// Route for requesting a password reset
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  // Generate a reset token and store it in the database
  const resetToken = jwt.sign({ email }, 'reset-secret', { expiresIn: '1h' });

  // Send an email to the user with the reset token link
  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
  // ... Send the email using a mailing library like nodemailer ...

  res.json({ message: 'Password reset email sent' });
});

// Route for resetting the password
app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decodedToken = jwt.verify(token, 'reset-secret');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    // ... Your database update logic here ...

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
