
const { User } = require('../models');
const bcrypt = require('bcryptjs');


//post '/reset-password'
const resetpassword = async (req, res)=>{
    const { email, resetToken, newPassword } = req.body;
    try {
      const user = await User.findOne({ where: { email, resetToken } });
      if (!user) {
        return res.status(404).json({ error: 'User not found or invalid token' });
      }
      if (user.resetTokenExpires < Date.now()) {
        return res.status(400).json({ error: 'Token has expired' });
      }
      user.password = newPassword;
      user.resetToken = null;
      user.resetTokenExpires = null;
      await user.save();
      res.json({ message: 'Password reset successful' });
    } catch (error) {
      res.status(500).json({ error: 'Password reset failed' });
    }
}

module.exports={resetpassword}
