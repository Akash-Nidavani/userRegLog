
const authorize = (...role) => {  //can also use --> (...role) if you want to validate more roles
    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            //   if (req.user.role !== role) {
            return res.status(403).json({ error: 'Permission denied' });
        }
        next();
    };
};

module.exports = authorize