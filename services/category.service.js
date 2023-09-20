const Category = require("../models/Category")

exports.createCategoryService = async (data) => {
    const result = await Category.create(data);
    return result;
}

exports.getCategoriesService = async () => {
    const categories = await Category.find({});
    return categories;
}

exports.getCategoryByIdService = async (id) => {
    const category = await Category.findOne({ _id: id });
    return category;
}

exports.updateCategoryByIdService = async (id, data) => {
    const result = await Category.updateOne(
        { _id: id },
        data,
        { runValidators: true }
    );
    return result;
}