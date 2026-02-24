const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect("mongodb://localhost:27017/shopify_clone");
        console.log('Database connected successfully!');
    }
    catch (err) {
        console.error('Database not connected Succesfully!', err)
    }
}

module.exports = connectDB;
