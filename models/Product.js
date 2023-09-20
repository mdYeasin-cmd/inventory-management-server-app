const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const validator = require('validator');

// schema design
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name for this product"],
        trim: true,
        unique: [true, "Name must be unique"],
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
        // validate: {
        //     validator: (value) => {
        //         if(!Array.isArray(value)) {
        //             return false;
        //         }
        //         let isValid = true;
        //         value.forEach(url => {
        //             if(!validator.isURL(url)) {
        //                 isValid = false;
        //             }
        //         });
        //         return isValid;
        //     },
        //     message: "Please provide valid image Urls"
        // }
    }],
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
    }
}, {
    timestamps: true,
    // _id: false
});

// Schema -> Model -> Query

// mongoose middleware for saving data
productSchema.pre('save', function (next) {
    console.log("Before saving data");
    if (this.quantity === 0) {
        this.status = "out-of-stock";
    };
    next();
});

// productSchema.post('save', function (doc, next) {
//   console.log("After saving data");
//   next();
// });

productSchema.methods.logger = function () {
    console.log(`Data save for ${this.name}`);
}

const Product = mongoose.model("Product", productSchema);

module.exports = Product;