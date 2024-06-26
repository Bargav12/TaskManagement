const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("", {
        });
        console.log("MongoDB Connected!!");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
