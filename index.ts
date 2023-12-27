import express, {Request, Response, NextFunction} from 'express'
import { AdminRoute, VendorRoute } from './routes'
import mongoose from 'mongoose'; 
import dotenv from 'dotenv'
import path from 'path'

(async () => {
  // Load the environment variables
  await dotenv.config({
    path: './.env'
  });
})();



const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/images' , express.static(path.join(__filename, 'images')))

const connectDB = async ()=>{
  try {
    const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}`)
    console.log(`\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host} `);
  } catch (error) {
    console.log("mongodb connection failed at db/index.js", error);
    process.exit(1);
  }
}

connectDB()
        
const PORT =8000

app.use("/admin", AdminRoute);
app.use("/vendor", VendorRoute);

app.listen(PORT, ()=>{
  console.clear()
  console.log(`Listening to port number ${PORT}`)
})