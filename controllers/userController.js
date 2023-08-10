const db = require("./../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'my-secret-key';


const refreshToken = async (req, res) =>{
    const refreshToken  = req.cookies.refreshToken;
    console.log(req.cookies.refreshToken)
    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' });
    }
    try {
        const decodedToken = jwt.verify(refreshToken, JWT_SECRET);
        const user = await db.user.findByPk(decodedToken.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
        res.clearCookie("accessToken")
        res.cookie('accessToken', accessToken, { httpOnly: true });
        res.status(200).json({ message: "New access token is sent successfully" });
    } catch (error) {
        console.log(error.message)
        return res.status(401).json({ error: 'Invalid refresh token' });
    }
}


module.exports = {refreshToken}