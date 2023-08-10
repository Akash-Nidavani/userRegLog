
const userLogout = async (req, res) => {
     res.clearCookie("accessToken")
     res.clearCookie("refreshToken")
     return res.status(200)
        .json({ message: "Successfully logged out" });
}

module.exports = { userLogout }