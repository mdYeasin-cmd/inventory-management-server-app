const mongoose = require('mongoose');
var validator = require('validator');
const { ObjectId } = mongoose.Schema.Types;

const brandSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100,
        unique: true,
        lowercase: true
    },
    description: String,
    email: {
        type: String,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid Email"]
    },
    website: {
        type: String,
        validate: [validator.isURL, "Please provide a valid URL"]
    },
    location: String,
    products: [{
        type: ObjectId,
        ref: "Product"
    }],
    suppliers: [{
        id: {
            type: ObjectId,
            ref: "Supplier"
        },
        name: String,
        contactNumber: String
    }],
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }
}, {
    timestamps: true
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;