import mongoose from 'mongoose'; 
import dotenv from 'dotenv';

(async () => {
  // Load the environment variables
  await dotenv.config({
    path: './.env'
  });
})();



export default async()=>{
  try {
    console.log(process.env.MONGODB_URI)
    const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}`)
    console.log(`\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("mongodb connection failed at db/index.js", error);
    process.exit(1);
  }
}