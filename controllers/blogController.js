// const { Blog } = require('../models');
const { User, Blog } = require('../models');
const db = require("./../models");


const createBlog = async (req, res) => {
    try {
        const { title, description, content, tags,status } = req.body;
        const userId = req.user.id;
        // if (!req.file) {
        //     return res.status(400).json({ error: "Blog picture needs to be uploaded" })
        // }
        // const image = req.file ? req.file.path : null;
        const blog = await db.blog.create({
            title,
            description,
            content,
            tags,
            status,
            userId
        });
        res.status(200).json(blog);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: "Failed to create a Blog" });
    }
};

const updateBlog = async (req, res) => {
    const postId = req.params.id;
    const { role } = req.user
    try {
        const post = await db.blog.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        if (role === 'Admin' || role === 'Reviewer' || (role === 'Author' && post.userId === req.user.id)) {
            const { title, description, content, categoryId, image, status } = req.body; //status
            post.title = title;
            post.description = description;
            post.content = content;
            post.categoryId = categoryId;
            post.image = image;
            post.status = status;
            await post.save();
            return res.json({ message: 'Post updated successfully', post});
        } else {
            return res.status(403).json({ error: 'Permission denied' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to update the blog" });
    }
};


const changeStatusOfBlog = async (req, res) => {
    const postId = req.params.id;
    const { role } = req.user
    try {
        const post = await db.blog.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        if (role === 'Admin' || role === 'Reviewer') {
            const { status } = req.body; 
            post.status = status;
            await post.update();
            return res.json({ message: 'Post updated successfully', post});
        } else {
            return res.status(403).json({ error: 'Permission denied' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to update the status of blog" });
    }
};

module.exports={createBlog,
    updateBlog,
    changeStatusOfBlog}