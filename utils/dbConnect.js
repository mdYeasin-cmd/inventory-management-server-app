const mongoose = require('mongoose');
require('dotenv').config();

const DBConnect = async () => {
    return mongoose
        .connect(process.env.DATABASE_LOCAL)
        .then(() => {
            console.log("Database is connected here!");
        })
        .catch((error) => {
            console.log("Error occur when try to connect with db");
        }); 
};

module.exports = DBConnect;

// const mongoose = require('mongoose');
// // const config = require('./config');

// const dbURL = process.env.DATABASE_LOCAL;

// mongoose
//     .connect(dbURL)
//     .then(() => {
//         console.log('MongoDB atlas is connected!');
//     })
//     .catch((error) => {
//         console.log(error, "Error occur when try to connect with mongodb atlas!")
//     });