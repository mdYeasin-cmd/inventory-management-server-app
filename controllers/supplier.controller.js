const {
    createSupplierService,
    getSuppliersService,
    getSupplierByIdService,
    updateSupplierByIdService
} = require("../services/supplier.service")

exports.createSupplier = async (req, res, next) => {
    try {
        const result = await createSupplierService(req.body);

        res.status(201).json({
            status: "success",
            message: "Supplier created successfully.",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't create the supplier.",
            error: error.message
        })
    }
}

exports.getSuppliers = async (req, res, next) => {
    try {
        const suppliers = await getSuppliersService();

        res.status(201).json({
            status: "success",
            message: "You get the suppliers data successfully",
            data: suppliers
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't get the suppliers data."
        })
    }
}

exports.getSupplierById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const supplier = await getSupplierByIdService(id);

        if (!supplier) {
            return res.status(400).json({
                status: "fail",
                message: "Couldn't get the supplier using this id"
            })
        }

        res.status(201).json({
            status: "success",
            message: "You get the supplier data successfully",
            data: brand
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't get the supplier data."
        })
    }
};

exports.updateSupplierById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await updateSupplierByIdService(id, req.body);

        if (!result.nModified) {
            return res.status(400).json({
                status: "fail",
                message: "Couldn't update the suplier using this id"
            });
        };

        res.status(200).json({
            status: "success",
            message: "Successfully update the supplier using this id",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't get the supplier data."
        })
    }
}