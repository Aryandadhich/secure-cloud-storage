const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB Connected Successfully');
    } catch (error) {
        console.error('DB Connection Failed:', error.message);
        process.exit(1); // Stop the app if DB fails
    }
};

module.exports = connectDB;
