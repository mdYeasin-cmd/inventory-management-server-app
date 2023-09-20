const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const validator = require('validator');

const supplierSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        trim: true,
        lowercase: true,
        minLength: [3, "Name must be at least 3 characters"],
        maxLength: [100, "Name is to large"]
    },
    email: {
        type: String,
        validate: [validator.isEmail, "Please provide a valid Email"],
        trim: true,
        lowercase: true,
        unique: true
    },
    brand: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        id: {
            type: ObjectId,
            required: true,
            ref: "Brand"
        }
    },
    contactNumber: [{
        type: String,
        required: [true, "Please provide a contact number"],
        // validate: {
        //     validator: (value) => {
        //         return validator.isMobilePhone(value);
        //     }
        // },
        // message: "Please provide a valid phone number"
    }],
    emergencyContactNumber: {
        type: String,
        required: [true, "Please provide an emergency contact number"],
        validate: {
            validator: (value) => {
                return validator.isMobilePhone(value);
            }
        },
        message: "Please provide a valid phone number"
    },
    tradeLicenceNumber: {
        type: Number,
        required: [true, "Please provide your trade licence number"]
    },
    presentAddress: {
        type: String,
        required: [true, "Please provide your present address"]
    },
    permanentAddress: {
        type: String,
        required: [true, "Please provide your permanent address"]
    },
    location: {
        type: String,
        required: [true, "Please provide a valid store name"],
        trim: true,
        lowercase: true,
        enum: {
            values: ["dhaka", "chattogram", "rajshahi", "sylhet", "khulna", "barishal", "rangpur", "mymensingh"],
            message: "{VALUE} is not a valid name"
        }
    },
    imageUrl: {
        type: String,
        validate: [validator.isURL, "Please provide a valid URL"]
    },
    nationalIdImageURL: {
        type: String,
        required: true,
        validator: [validator.isURL, "Please provide a valid URL"]
    },
    status: {
        type: String,
        default: "active",
        enum: {
            values: ['active', 'inactive'],
            message: "Status can't be {VALUE}"
        }
    },
}, {
    timestamps: true
});

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;