const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('./models');

const userRegRoutes = require("./routes/userRegRoutes")
const userLoginRoutes = require("./routes/userLoginRoutes")
const userLogoutRoutes = require("./routes/userLogoutRoutes")

const authorize = require("./middlewear/authorize.js")
const authenticate = require('./middlewear/authenticate.js');
const cookieParser = require("cookie-parser");


const app = express();
const PORT = 3000;
const JWT_SECRET = 'my-secret-key';
app.use(bodyParser.json());
app.use(express.json())
app.use(cookieParser());

app.use("/user", userRegRoutes)
app.use("/user", userLoginRoutes)
app.use("/user", userLogoutRoutes)


app.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' });
    }
    try {
        const decodedToken = jwt.verify(refreshToken, JWT_SECRET);
        const user = await User.findByPk(decodedToken.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Generate a new access token
        const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
        res.json({ accessToken });
    } catch (error) {
        return res.status(401).json({ error: 'Invalid refresh token' });
    }
});



app.get('/protected', authenticate, authorize('Admin','Reviewer'), (req, res) => {
    res.json({ message: 'Access granted' });
});


app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
