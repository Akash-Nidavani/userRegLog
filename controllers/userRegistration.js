// const { User } = require('../models');
const db = require("./../models");
const bcrypt = require('bcryptjs');

const userReg = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.user.create({
            username,
            email,
            role,
            password: hashedPassword,
        });
        res.json({ message: 'User registered successfully',user });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Failed to register user' });
    }

}

module.exports = {userReg}