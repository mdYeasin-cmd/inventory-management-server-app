const {
    getProductsService,
    createProductService,
    bulkUpdateProductService,
    updateProductByIdService,
    deleteProductByIdService,
    bulkDeleteProductService
} = require('../services/product.service');

exports.getProducts = async (req, res, next) => {
    try {
        console.log(req.query, "req query");
        let filters = {...req.query};
        // { price: { gt: '12' } }
        // { price: { $gt: 50 }}

        // gt, gte, lt, lte, ne
        let filtersString = JSON.stringify(filters);
        filtersString = filtersString.replace(/\b(gt|gte|lt|lte)\b/, match => `$${match}`);
        filters = JSON.parse(filtersString);

        // sort, page, limit --> exclude
        const excludeFeild = ["sort", "page", "limit"];

        excludeFeild.forEach(feild => delete filters[feild]);

        const queries = {};

        if(req.query.sort) {
            // quantity,price -> 'quantity price'
            const sortBy = req.query.sort.split(',').join(' ');
            queries.sortBy = sortBy;
            console.log(sortBy, "sort by");
        }

        if(req.query.feilds) {
            const feilds = req.query.feilds.split(',').join(' ') ;
            queries.feilds = feilds;
        }

        if(req.query.page) {
            const { page = 1, limit = 10 } = req.query; // "3" "10"
            // 50 products
            // each page 10 products
            // page 1 -> 1-10
            // page 2 -> 11-20
            // page 3 -> 21-30 -> page 3 -> skip 1-20 -> 3-1 -> 2*10
            // page 4 -> 31-40 -> page 4 -> skip 1-30 -> 4-1 -> 3*10    
            // page 5 -> 41-50
            const skip = (page - 1) * parseInt(limit);
            queries.skip = skip;
            queries.limit = parseInt(limit);
        }
        
        console.log(queries);

        const products = await getProductsService(filters, queries);

        // const products = await Product
        //   .where("name").equals(/\w/)
        //   .where("quantity").gt(20).lt(6000)
        //   .limit(1).sort({ quantity: -1 });
        // const product = await Product.findById(undefined);

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

exports.createProduct = async (req, res, next) => {
    try {
        // save or create - we have this two method for insert data in db

        // save
        // const product = new Product(req.body);
        // const response = await product.save();

        // create
        const response = await createProductService(req.body);

        response.logger();

        res.status(201).json({
            status: "success",
            message: "Data inserted successfully!",
            data: response
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Data is not inserted",
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

        if(!result.deletedCount) {
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