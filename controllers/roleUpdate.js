const { User } = require('../models');


const editRole = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        const { role } = req.body;
        user.role = role
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to update the role of user" })
    }
}

module.exports = {
    editRole
}