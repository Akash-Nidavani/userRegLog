const express = require('express');
const jwt = require('jsonwebtoken');
const expressJwtBlacklist = require('jsonwebtoken-blacklist')(jwt);

const app = express();
const PORT = 3000;

app.use(express.json());

// Secret key for signing JWT tokens
const JWT_SECRET = 'your-secret-key';

// In-memory token blacklist
const tokenBlacklist = {};

app.get('/', (req, res) => {
  res.send('Home Page');
});

// Route to handle login and set cookies
app.post('/login', (req, res) => {
  // Assuming successful authentication
  const user = { id: 1, username: 'exampleuser' };

  // Create access token
  const accessToken = jwt.sign(user, JWT_SECRET, { expiresIn: '15m' });

  // Store token in blacklist
  tokenBlacklist[accessToken] = true;

  res.json({ message: 'Login successful' });
});

// Route to handle logout and token invalidation
app.post('/logout', (req, res) => {
  const { token } = req.body;

  // Invalidate token by adding it to the blacklist
  tokenBlacklist[token] = true;

  res.json({ message: 'Logout successful' });
});

// Middleware to check token validity
app.use((req, res, next) => {
  const token = req.header('Authorization');

  // Check if the token is in the blacklist
  if (token && tokenBlacklist[token]) {
    return res.status(401).json({ error: 'Token is invalid' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the decoded user to the request object
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is invalid' });
  }
});

app.get('/protected', (req, res) => {
  res.json({ message: 'Access granted to protected route' });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
