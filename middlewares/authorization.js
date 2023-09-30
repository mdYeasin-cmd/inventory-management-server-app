module.exports = (...role) => {

    console.log(role, "this is role");

    return (req, res, next) => {
        const userRole = req.user.role;

        if(!role.includes(userRole)) {
            return res.json({
                status: "fail",
                message: "You are not authorized to access this route"
            });
        };

        next();
    }
}