const Store = require("../models/Store")

exports.createStoreService = async (data) => {
    const result = await Store.create(data);
    return result;
}

exports.getStoresService = async () => {
    const stores = await Store.find({});
    return stores;
}

exports.getStoreByIdService = async (storeId) => {
    const stores = await Store.findOne({ _id: storeId });
    return stores;
}

exports.updateStoreByIdService = async (id, data) => {
    const result = await Store.updateOne(
        { _id: id },
        data,
        { runValidators: true }
    );
    return result;
}