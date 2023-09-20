const Brand = require("../models/Brand");
const Product = require("../models/Product")

exports.getProductsService = async (filters, queries) => {
    const products = await Product
        .find(filters)
        .skip(queries.skip)
        .limit(queries.limit)
        .select(queries.feilds)
        .sort(queries.sortBy);

    const total = await Product.countDocuments(filters);
    const page = Math.ceil(totalProducts / queries.limit);
    return { products, total, page };
}

exports.createProductService = async (data) => {
    const product = await Product.create(data);

    const { _id: productId, brand } = product;

    const result = await Brand.updateOne(
        { _id: brand.id },
        {
            $push: {
                products: productId
            }
        }
    )

    console.log(result);
    // step 1 - _id, brand
    // update Brand

    return product;
}

exports.updateProductByIdService = async (productId, data) => {
    const response = await Product.updateOne(
        { _id: productId },
        { $inc: data },
        { runValidators: true }
    );
    // const product = await Product.findById(productId);
    // const response = await product.set(data).save();
    return response;
}

exports.bulkUpdateProductService = async (data) => {
    // console.log(data.ids, "data id");
    // const result = await Product.updateMany(
    //     { _id: data.ids },
    //     data.data,
    //     { runValidators: true }
    // );
    const products = [];
    data.ids.forEach(product => {
        products.push(Product.updateOne({ _id: product.id }, product.data));
    });
    const result = await Promise.all(products);
    console.log(result);
    return result;
}

exports.deleteProductByIdService = async (id) => {
    const result = await Product.deleteOne({ _id: id });
    return result;
}

exports.bulkDeleteProductService = async (ids) => {
    const result = await Product.deleteMany({});
    return result;
}