
const userLogout = async (req, res) => {
    return res
        .clearCookie("accessToken")
        .status(200)
        .json({ message: "Successfully logged out" });
}

module.exports = { userLogout }