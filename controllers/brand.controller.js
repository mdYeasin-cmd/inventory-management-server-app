const { createBrandService, getBrandsService, getBrandByIdService, updateBrandByIdService } = require("../services/brand.service")

exports.createBrand = async (req, res, next) => {
    try {
        const result = await createBrandService(req.body);

        res.status(201).json({
            status: "success",
            message: "Brand created successfully.",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't create the brand."
        })
    }
}

exports.getBrands = async (req, res, next) => {
    try {
        const brands = await getBrandsService();

        res.status(201).json({
            status: "success",
            message: "You get the brands data successfully",
            data: brands
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't get the brands data."
        })
    }
}

exports.getBrandById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const brand = await getBrandByIdService(id);

        if(!brand) {
            return res.status(400).json({
                status: "fail",
                message: "Couldn't get the barnd using this id"
            })
        }

        res.status(201).json({
            status: "success",
            message: "You get the brand data successfully",
            data: brand
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't get the brand data."
        })
    }
}

exports.updateBrandById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await updateBrandByIdService(id, req.body);

        console.log(result, "updated brand");
        if(!result.nModified) {
            return res.status(400).json({
                status: "fail",
                message: "Couldn't update the barnd using this id"
            });
        };

        res.status(200).json({
            status: "success",
            message: "Successfully update the brand using this id",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't get the brand data."
        })
    }
}