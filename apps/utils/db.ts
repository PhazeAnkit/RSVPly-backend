import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,          
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("MongoDB connected");
  } catch (error) {
    if (error instanceof Error) {
      console.error("MongoDB connection failed:", error.message);
    } else {
      console.error("MongoDB connection failed:", error);
    }
    process.exit(1); 
  }
};

export default connectDB;
