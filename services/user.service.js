const User = require("../models/User")

exports.signupService = async (userInfo) => {
    const result = await User.create(userInfo);
    return result;
}

exports.loginService = async (userInfo) => {
    const result = await User.create(userInfo);
    return result;
}

exports.findUserByEmailService = async (email) => {
    const result = await User.findOne({ email: email });
    return result;
}

exports.findUserByTokenService = async (token) => {
    const result = await User.findOne({ confirmationToken: token });
    return result;
}

exports.deleteUserByIdService = async (id) => {
    const result = await User.deleteOne({ _id: id });
    return result;
}