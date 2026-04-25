import mongoose from 'mongoose';

// This function handles the connection to the MongoDB database.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Exit the process with failure if the connection fails.
    process.exit(1);
  }
};

export default connectDB;
