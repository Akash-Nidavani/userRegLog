const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");

const { User } = require('./models');

const userRegRoutes = require("./routes/userRegRoutes")
const userLoginRoutes = require("./routes/userLoginRoutes")
const userLogoutRoutes = require("./routes/userLogoutRoutes")
const blogRoutes = require("./routes/blogRoutes")
const userRoleUpdate = require("./routes/userRoleUpdate")
const refershToken = require("./routes/userRoutes")

const authorize = require("./middlewear/authorize.js")
const authenticate = require('./middlewear/authenticate.js');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'my-secret-key';
app.use(bodyParser.json());
app.use(express.json())
app.use(cookieParser());

app.use("/user", userRegRoutes)
app.use("/user", userLoginRoutes)
app.use("/user", userLogoutRoutes)
app.use("/user", authenticate, authorize('Admin'), userRoleUpdate)
app.use("/refreshToken", refershToken)

app.use("/post",blogRoutes)

app.get('/protected', authenticate, authorize('Admin','Reviewer'), (req, res) => {
    res.json({ message: 'Access granted' });
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
