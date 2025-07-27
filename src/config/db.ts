import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('DB Connected Successfully');
    } catch (error) {
        console.error('DB Connection Failed:', error);
        process.exit(1); // Stop the app if DB fails
    }
};

export default connectDB;
