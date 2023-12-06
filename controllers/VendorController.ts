import {Request, Response, NextFunction} from 'express'
import { VendorLoginInput } from '../dto';
import { FindVendor } from './AdminController';
import { ValidatePassword } from '../utility';
import { GenerateSignature } from '../utility';

export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = <VendorLoginInput>req.body;
    const existtingUser = await FindVendor('', email);
    if(existtingUser !== null) {
        const validation = await ValidatePassword(password, existtingUser.password, existtingUser.salt);
        if(validation){
            const signature = await GenerateSignature ({
                _id: existtingUser._id,
                email: existtingUser.email,
                name: existtingUser.name,
            })
            return res.json(signature)
        }
    }
        
        return res.json({'message': "Login Credentials is not Valid"})

}
    
export const GetVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    res.json({message: "Hello from vendor profile"})
}

export const UpdateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    res.json({message: "Hello from vendor profile update"})
}

export const UpdateVendorCoverImage = async (req: Request, res: Response, next: NextFunction) => {
    res.json({message: "Hello from vendor cover image update"})
}

export const UpdateVendorService = async (req: Request, res: Response, next: NextFunction) => {
    res.json({message: "Hello from vendor service update"})
}

export const AddFood = async (req: Request, res: Response, next: NextFunction) => {
    res.json({message: "Hello from vendor add food"})
}

export const AddOffer = async (req: Request, res: Response, next: NextFunction) => {
    res.json({message: "Hello from vendor add offer"})
}

export const EditOffer = async (req: Request, res: Response, next: NextFunction) => {
    res.json({message: "Hello from vendor edit offer"})
}

export const GetFoods = async (req: Request, res: Response, next: NextFunction) => {
    res.json({message: "Hello from vendor get foods"})
}

export const GetOffers = async (req: Request, res: Response, next: NextFunction) => {
    res.json({message: "Hello from vendor get offers"})
}

export const GetOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
    res.json({message: "Hello from vendor get order details"})
}

export const GetOrders = async (req: Request, res: Response, next: NextFunction) => {
    res.json({message: "Hello from vendor get orders"})
}

export const ProcessOrder = async (req: Request, res: Response, next: NextFunction) => {
    res.json({message: "Hello from vendor process order"})
}
