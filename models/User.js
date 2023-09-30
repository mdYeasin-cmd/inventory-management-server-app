const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        validate: [validator.isEmail, "Please provide a valid Email"],
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, "Email address is required"]
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (value) => {
                validator.isStrongPassword(value, {
                    minLength: 6,
                    minLowercase: 3,
                    minNumbers: 1,
                    minUppercase: 1,
                    minSymbols: 1
                })
            },
            message: "Password {VALUE} is not strong enough."
        }
    },
    confirmPassword: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: "Password don't match"
        }
    },
    role: {
        type: String,
        enum: ["buyer", "store-manager", "admin"],
        default: "buyer"
    },
    firstName: {
        type: String,
        required: [true, "Please provide a first name"],
        trim: true,
        lowercase: true,
        minLength: [3, "First name must be at least 3 characters"],
        maxLength: [100, "First name is to large"]
    },
    lastName: {
        type: String,
        required: [true, "Please provide a last name"],
        trim: true,
        lowercase: true,
        minLength: [3, "Last name must be at least 3 characters"],
        maxLength: [100, "Last name is to large"]
    },
    contactNumber: {
        type: String,
        validate: [validator.isMobilePhone, "Please provide a valid contact number"]
    },
    shippingAddress: String,
    imageUrl: {
        type: String,
        validate: [validator.isURL, "Please provide a valid URL"]
    },
    status: {
        type: String,
        default: "inactive",
        enum: ['active', 'inactive', 'blocked']
    },
    confirmationToken: String,
    confirmationTokenExpires: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
}, {
    timestamps: true
});

userSchema.pre("save", function (next) {
    const password = this.password;

    const hashedPassword = bcrypt.hashSync(password);

    this.password = hashedPassword;
    this.confirmPassword = undefined;

    next();
});

userSchema.methods.comparePassword = function (password, hash) {
    const isPasswordValid = bcrypt.compareSync(password, hash);
    return isPasswordValid;
};

userSchema.methods.generateConfirmationToken = function () {
    const token = crypto.randomBytes(32).toString("hex");
    const date = new Date();
    date.setDate(date.getDate() + 1);

    this.confirmationToken = token;
    this.confirmationTokenExpires = date;

    return token;
}

const User = mongoose.model("User", userSchema);

module.exports = User;