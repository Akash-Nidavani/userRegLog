// const { User } = require('../models');
const db = require("./../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'my-secret-key';

const userLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await db.user.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
        // res.json({ message: 'Login successful', accessToken, refreshToken });
        res.cookie('accessToken', accessToken, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.status(200).json({ message: "Logged in successfully" });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Login failed' });
    }
}


module.exports = { userLogin }