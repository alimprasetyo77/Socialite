import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(uri!);
    console.log("MONGO DB CONNECT TO : " + conn.connection.name);
  } catch (error: any) {
    console.log(`Error : ${error.message}`);
    process.exit(1);
  }
};
export default connectDB;
