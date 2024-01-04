import mongoose from 'mongoose'; 
import dotenv from 'dotenv';
import { MONGODB_URI } from '../config';

(async () => {
  // Load the environment variables
  await dotenv.config({
    path: './.env'
  });
})();



export default async()=>{
  try {
    console.log(MONGODB_URI)
    const connectionInstance= await mongoose.connect(`${MONGODB_URI}`)
    console.log(`\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("mongodb connection failed at db/index.js", error);
    process.exit(1);
  }
}