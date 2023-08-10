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
    try {
        const post = await db.post.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { title, description, content, categoryId, image, status } = req.body; //status
        post.title = title;
        post.description = description;
        post.content = content;
        post.categoryId = categoryId;
        post.image = image;
        post.status = status;
        await post.save();
        res.json(post);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to update the blog" });
    }
};

module.exports={createBlog,
    updateBlog}