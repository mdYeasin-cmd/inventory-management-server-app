const { createStoreService, getStoresService, getStoreByIdService, updateStoreByIdService } = require("../services/store.service");

exports.createStore = async (req, res, next) => {
    try {
        const result = await createStoreService(req.body);

        res.status(201).json({
            status: "success",
            message: "Successfully created the store",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't create the store",
            error: error.message
        });
    }
}

exports.getStores = async (req, res, next) => {
    try {
        const stores = await getStoresService();

        res.status(200).json({
            status: "success",
            message: "Successfully get the stores data",
            data: stores
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't get the stores data",
            error: error.message
        });
    }
}

exports.getStoreById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const store = await getStoreByIdService(id);

        res.status(200).json({
            status: "success",
            message: "Successfully get the store data",
            data: store
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't get the store data",
            error: error.message
        });
    }
}

exports.updateStoreById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await updateStoreByIdService(id, req.body);

        if(!result.nModified) {
            return res.status(400).json({
                status: "fail",
                message: "Couldn't update the store using this id"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Successfully update the store data",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't update the store data",
            error: error.message
        });
    }
}