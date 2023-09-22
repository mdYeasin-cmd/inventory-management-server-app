const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const validator = require("validator");

// schema design
const stockSchema = mongoose.Schema({
    productId: {
        type: ObjectId,
        required: true,
        ref: "Product"
    },
    name: {
        type: String,
        required: [true, "Please provide a name for this product"],
        trim: true,
        // unique: [true, "Name must be unique"],
        lowercase: true,
        minLength: [3, "Name must be at least 3 characters"],
        maxLength: [100, "Name is to large"]
    },
    description: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true,
        enum: {
            values: ["kg", "litre", "pcs", "bag"],
            message: "Unit value can't be {VALUE}, must be kg/litre/pcs/bag"
        }
    },
    imageURLs: [{
        type: String,
        required: true,
        validate: [validator.isURL, "Please provide a valid url(s)"]
        // {
        //     validator: (value) => {
        //         if (!Array.isArray(value)) {
        //             return false;
        //         }
        //         let isValid = true;
        //         value.forEach(url => {
        //             if (validator.isURL(url)) {
        //                 isValid = false;
        //             }
        //         });
        //         return isValid;
        //     },
        //     message: "Please provide valid image Urls"
        // }
    }],
    price: {
        type: Number,
        required: true,
        min: [0, "Product price can't be negative"]
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, "Product quantity can't be negative"]
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        name: {
            type: String,
            required: true
        },
        id: {
            type: ObjectId,
            ref: "Brand",
            required: true
        }
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['in-stock', 'out-of-stock', 'discontinued'],
            message: "Status can't be {VALUE}"
        }
    },
    store: {
        name: {
            type: String,
            required: [true, "Please provide a valid store name"],
            trim: true,
            lowercase: true,
            enum: {
                values: ["dhaka", "chattogram", "rajshahi", "sylhet", "khulna", "barishal", "rangpur", "mymensingh"],
                message: "{VALUE} is not a valid name"
            }
        },
        id: {
            type: ObjectId,
            required: true,
            ref: "Store"
        }
    },
    suppliedBy: {
        name: {
            type: String,
            required: [true, "Please provide a supplier name"],
            trim: true,
        },
        id: {
            type: ObjectId,
            ref: "Supplier"
        }
    },
    sellCount: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;