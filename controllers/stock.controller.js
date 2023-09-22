const {
    getStocksService,
    createStockService,
    bulkUpdateStockService,
    updateStockByIdService,
    deleteStockByIdService,
    bulkDeleteStockService,
    getStockByIdService
} = require('../services/stock.service');

exports.getStocks = async (req, res, next) => {
    try {
        let filters = { ...req.query };
        // /stock?sortBy=price&price=5000&name=Chal&location=dhaka

        // gt, gte, lt, lte, ne
        let filtersString = JSON.stringify(filters);
        filtersString = filtersString.replace(/\b(gt|gte|lt|lte)\b/, match => `$${match}`);
        filters = JSON.parse(filtersString);

        // sort, page, limit --> exclude
        const excludeFeild = ["sort", "page", "limit"];

        excludeFeild.forEach(feild => delete filters[feild]);

        const queries = {};

        if (req.query.sort) {
            // quantity,price -> 'quantity price'
            const sortBy = req.query.sort.split(',').join(' ');
            queries.sortBy = sortBy;
            console.log(sortBy, "sort by");
        }

        if (req.query.feilds) {
            const feilds = req.query.feilds.split(',').join(' ');
            queries.feilds = feilds;
        }

        if (req.query.page) {
            const { page = 1, limit = 10 } = req.query;
            const skip = (page - 1) * parseInt(limit);
            queries.skip = skip;
            queries.limit = parseInt(limit);
        }

        console.log(queries);

        const products = await getStocksService(filters, queries);

        res.status(200).json({
            status: "success",
            message: "Data get successfully",
            data: products
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Can't get the data",
            error: error.message
        });
    }
};

exports.getStockById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await getStockByIdService(id);

        if(!product) {
            return res.status(400).json({
                status: "fail",
                message: "Couldn't get stock with this id",
            });
        }

        res.status(200).json({
            status: "success",
            message: "Stock get successfully",
            data: product
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Can't get the stock data",
            error: error.message
        });
    }
}

exports.createStock = async (req, res, next) => {
    try {
        const result = await createStockService(req.body);

        res.status(201).json({
            status: "success",
            message: "Stock created successfully!",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't create the stock",
            error: error.message
        });
    }
}

exports.updateProductById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await updateProductByIdService(id, req.body);

        res.status(200).json({
            status: "success",
            message: "Data successfully updated!",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't update the product",
            error: error.message
        });
    }
}

exports.bulkUpdateProduct = async (req, res, next) => {
    try {
        console.log(req.body);
        const result = await bulkUpdateProductService(req.body);

        res.status(200).json({
            status: "success",
            message: "Data successfully updated!",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't update the product",
            error: error.message
        });
    }
}

exports.deleteProductById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await deleteProductByIdService(id);
        console.log(result);

        if (!result.deletedCount) {
            return res.status(400).json({
                status: "fail",
                message: "couldn't delete the product"
            })
        }

        res.status(200).json({
            status: "success",
            message: "Data successfully deleted!",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't delete the product",
            error: error.message
        });
    }
}

exports.bulkDeleteProduct = async (req, res, next) => {
    try {
        const result = await bulkDeleteProductService(req.body.ids);

        res.status(200).json({
            status: "success",
            message: "Successfully delete the given inofo products",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't delete the given info products",
            error: error.message
        });
    }
}

exports.fileUpload = async (req, res, next) => {
    try {
        res.status(201).json({
            data: req.files
        });
    } catch (error) {

    }
}