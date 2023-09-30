const express = require('express');
const router = express.Router();
const productController = require('./../controllers/product.controller');
const uploader = require('../middlewares/uploader');
const verifyToken = require('../middlewares/verifyToken');
const authorization = require('../middlewares/authorization');

// router.use(verifyToken);

router
    .route('/file-upload')
    .post(
        uploader.array("image"),
        productController.fileUpload
    );

router
    .route('/bulk-update')
    .patch(
        // authorization("admin"),
        productController.bulkUpdateProduct
    );

router
    .route('/bulk-delete')
    .delete(productController.bulkDeleteProduct);

router
    .route('/')
    .get(productController.getProducts)
    .post(
        verifyToken,
        authorization("admin", "store-manager"),
        productController.createProduct
    );

router
    .route('/:id')
    .patch(productController.updateProductById)
    .delete(
        verifyToken,
        authorization("admin"),
        productController.deleteProductById
    );

module.exports = router;