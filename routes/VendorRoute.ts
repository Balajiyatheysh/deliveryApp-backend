import express,{Request, Response, NextFunction} from 'express'
import {AddFood, AddOffer, EditOffer, GetFoods, GetOffers,GetOrderDetails, GetOrders,ProcessOrder, UpdateVendorCoverImage, UpdateVendorProfile, UpdateVendorService, VendorLogin} from '../controllers'
import {Authenticate} from "../middlewares";
import multer from 'multer';


const router = express.Router();

router.post("/login", VendorLogin)

router.get("/", (req: Request, res: Response, next: NextFunction)=>{
  res.json({message:"Hello from vendor page"})
})

export {router as VendorRoute}