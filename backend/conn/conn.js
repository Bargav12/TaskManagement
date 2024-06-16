const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://gvns1610:8XhuILAdJYEFokN1@cluster0.bezlz4y.mongodb.net/Task", {
        });
        console.log("MongoDB Connected!!");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
