const { getBrandByIdService } = require("../services/brand.service");
const { createCategoryService, getCategoriesService, getCategoryByIdService, updateCategoryByIdService } = require("../services/category.service");

exports.createCategory = async (req, res, next) => {
    try {
        const result = await createCategoryService(req.body);

        res.status(201).json({
            status: "success",
            message: "Successfully created the category",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't create the category",
            error: error.message
        });
    }
}

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await getCategoriesService();

        res.status(200).json({
            status: "success",
            message: "Successfully get the categories data",
            data: categories
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't get the categories data",
            error: error.message
        });
    }
}

exports.getCategoryById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const category = await getCategoryByIdService(id);

        res.status(200).json({
            status: "success",
            message: "Successfully get the category data",
            data: category
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't get the category data",
            error: error.message
        });
    }
}

exports.updateCategoryById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await updateCategoryByIdService(id, req.body);

        if(!result.nModified) {
            return res.status(400).json({
                status: "fail",
                message: "Couldn't get category using this id"
            })
        }

        res.status(200).json({
            status: "success",
            message: "Successfully update the category data",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't update the category data",
            error: error.message
        });
    }
}