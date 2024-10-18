const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
    try {
        const uri = 'mongodb+srv://rawatsachin250102:Sachin250102@sachincluster.egnxb.mongodb.net/mydatabase'; // Replace 'mydatabase' with your actual database
        console.log("Connecting to MongoDB using hardcoded URI");
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`Mongodb connected to ${mongoose.connection.host}`.bgGreen.white);
    } catch (error) {
        console.log(`Mongodb Server Issue: ${error}`.bgRed.white);
    }
};

module.exports = connectDB;
