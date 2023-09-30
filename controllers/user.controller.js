const {
    signupService,
    findUserByEmailService,
    findUserByTokenService,
    deleteUserByIdService
} = require("../services/user.service");
const { sendMailWithMailGun, sendMailWithEmail } = require("../utils/email");
const { generateToken } = require("../utils/token");

exports.signup = async (req, res, next) => {
    try {
        const user = await signupService(req.body);

        const token = user.generateConfirmationToken();

        await user.save({ validateBeforeSave: false });

        const mailData = {
            to: [user.email],
            subject: "Verify your Account",
            text: `Thank you for creating your account. Please confirm your account here: ${req.protocol}://${req.get("host")}${req.originalUrl}/confirmation/${token}`
        };

        // sendMailWithMailGun(mailData);
        const isEmailSend = await sendMailWithEmail(mailData);

        if (!isEmailSend) {
            await deleteUserByIdService(user._id);
            return res.status(500).json({
                status: "fail",
                message: "Sorry! We can't create your account for the time of our issue. Please try again later"
            });
        };

        res.status(200).json({
            status: "success",
            message: "User created successfully"
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Couldn't create the user",
            error: error.message
        })
    }
};

/* 
    1. Check if email and password are given
    2. Load user with email
    3. if not user send res
    4. compare password
    5. if password not correct send res
    6. check if user is active
    7. if not active send res
    8. generate token
    9. send user and token
*/
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: "fail",
                message: "Please provide your valid credentials"
            });
        };

        const user = await findUserByEmailService(email);

        if (!user) {
            return res.status(400).json({
                status: "fail",
                message: "No account found. Please create an account first"
            });
        };

        const isPasswordValid = user.comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(403).json({
                status: "fail",
                message: "Password is not correct"
            });
        }

        if (user.status !== "active") {
            return res.status(401).json({
                status: "fail",
                message: "Your account not active yet. Please check you email"
            })
        }

        // generate token
        const token = generateToken(user);

        const { password: pwd, ...others } = user.toObject();

        res.status(200).json({
            status: "success",
            message: "Successfully logged in",
            data: {
                others,
                token
            }
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Couldn't create the user",
            error: error.message
        })
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await findUserByEmailService(req.user.email);

        res.status(200).json({
            stattus: "success",
            message: "Successfylly persist the user",
            data: user
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Couldn't get the user",
            error: error.message
        })
    }
}

exports.confirmEmail = async (req, res, next) => {
    try {
        const { token } = req.params;

        const user = await findUserByTokenService(token);

        if (!user) {
            return res.status(403).json({
                stattus: "fail",
                message: "Couldn't found any user with this token"
            });
        }

        const expired = new Date() > new Date(user.confirmationTokenExpires);

        if (expired) {
            return res.stattus(401).json({
                status: "fail",
                message: "Token expired"
            });
        }

        user.status = "active";
        user.confirmationToken = undefined;
        user.confirmationTokenExpires = undefined;

        user.save({ validateBeforeSave: false });

        res.status(200).json({
            stattus: "success",
            message: "Successfylly activated your account",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Couldn't get the user",
            error: error.message
        });
    }
}