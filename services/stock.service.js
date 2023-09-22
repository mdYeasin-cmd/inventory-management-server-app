const mongoose = require("mongoose");
const Stock = require("../models/Stock");
const ObjectId = mongoose.Types.ObjectId;

exports.getStocksService = async (filters, queries) => {
    // const stocks = await Stock
    //     .find(filters)
    //     .skip(queries.skip)
    //     .limit(queries.limit)
    //     .select(queries.feilds)
    //     .sort(queries.sortBy);

    const stocks = Stock.aggregate([
        // stage one
        {
            $match: {}
        },
        // stage two
        {
            $project: {
                store: 1,
                price: { $convert: { input: "$price", to: "int" } },
                // quantity: { $convert: { input: "$quantity", to: "int" } },
                quantity: 1
            }
        },
        // stage three
        {
            $group: {
                _id: "$store.name", totalProductsPrice: {
                    $sum: { $multiply: ["$price", "$quantity"] }
                }
            }
        }
    ]);

    // const total = await Stock.countDocuments(filters);
    // const page = Math.ceil(total / queries.limit);
    // return { stocks, total, page };
    return stocks;
}

exports.getStockByIdService = async (id) => {
    // const product = await Stock.findById(id)
    // .populate("brand.id")
    // .populate("store.id")
    // .populate("suppliedBy.id");

    // aggregession is a pipe line
    // pipe line --> many stages

    //data --> one stage --> two stage

    // name, age, contactNumber --> contactNumber

    const product = await Stock.aggregate([
        // stage one
        {
            $match: { _id: ObjectId(id) }
        },
        // stage tow 
        {
            $project: {
                productId: 1,
                name: 1,
                price: 1,
                quantity: 1,
                category: 1,
                "brand.name": 1
                // "brand.name": { $toUpper: "$brand.name" }
            }
        },
        // stage three
        {
            $lookup: {
                from: "brands",
                localField: "brand.name",
                foreignField: "name",
                as: "brandDetails"
            }
        },
        // stage four
        {
            $project: {
                "brandDetails.createdAt": 0,
                "brandDetails.updatedAt": 0
            }
        }
    ]);

    return product;
}

exports.createStockService = async (data) => {
    const stock = await Stock.create(data);
    return stock;
}

// exports.updateProductByIdService = async (productId, data) => {
//     const response = await Stock.updateOne(
//         { _id: productId },
//         { $inc: data },
//         { runValidators: true }
//     );
//     // const product = await Product.findById(productId);
//     // const response = await product.set(data).save();
//     return response;
// }

// exports.bulkUpdateProductService = async (data) => {
//     // console.log(data.ids, "data id");
//     // const result = await Product.updateMany(
//     //     { _id: data.ids },
//     //     data.data,
//     //     { runValidators: true }
//     // );
//     const products = [];
//     data.ids.forEach(product => {
//         products.push(Stock.updateOne({ _id: product.id }, product.data));
//     });
//     const result = await Promise.all(products);
//     console.log(result);
//     return result;
// }

// exports.deleteProductByIdService = async (id) => {
//     const result = await Stock.deleteOne({ _id: id });
//     return result;
// }

// exports.bulkDeleteProductService = async (ids) => {
//     const result = await Stock.deleteMany({});
//     return result;
// }