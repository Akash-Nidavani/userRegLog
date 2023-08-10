const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cookieParser());

const authorization = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, "YOUR_SECRET_KEY");
    req.userId = data.id;
    req.userRole = data.role;
    return next();
  } catch {
    return res.sendStatus(403);
  }
};

app.get("/", (req, res) => {
  return res.json({ message: "Hello World 🇵🇹 🤘" });
});

app.get("/login", (req, res) => {
  const token = jwt.sign({ id: 7, role: "captain" }, "YOUR_SECRET_KEY");
  return res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({ message: "Logged in successfully 😊 👌" });
});

app.get("/protected", authorization, (req, res) => {
  return res.json({ user: { id: req.userId, role: req.userRole } });
});

app.get("/logout", authorization, (req, res) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully logged out 😏 🍀" });
});

const start = (port) => {
  try {
    app.listen(port, () => {
      console.log(`Api up and running at: http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit();
  }
};
start(3333);




const db = require("./models");
app.put('/posts/:postId', async (req, res) => {
  const postId = req.params.postId;
  const { role } = req.user; // Assuming the user's role is stored in req.user
  try {
    const post = await db.blog.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (role === 'Admin' || role === 'Reviewer') {
        const { title, description, content, categoryId, image, status } = req.body;
        post.status = status;
        await db.blog.save();
        res.json(post);
      // For example, allow editing if the post is authored by the user
      if (role === 'Admin' || role === 'Reviewer' || (role === 'Author' && post.userId === req.user.id)) {
        const { title, description, content, categoryId, image } = req.body; //status
        post.title = title;
        post.description = description;
        post.content = content;
        post.categoryId = categoryId;
        post.image = image;
        await db.blog.save();
        res.json(post);
        return res.json({ message: 'Post updated successfully' });
      } else {
        return res.status(403).json({ error: 'Permission denied' });
      }
    } else {
      return res.status(403).json({ error: 'Permission denied' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating post' });
  }
});
