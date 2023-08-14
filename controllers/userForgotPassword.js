const db = require("./../models");
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'my-secret-key';
const nodemailer = require("nodemailer")

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
      const user = await db.user.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
      const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
      
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: 'REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM',
          pass: 'REPLACE-WITH-YOUR-GENERATED-PASSWORD'
        }
      });

      const mailOptions = {
        from: 'nidac@example.com',
        to: user.email,
        subject: 'Password Reset link',
        text: resetLink,
      };

      await transporter.sendMail(mailOptions);
      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send reset email' });
    }
  });


