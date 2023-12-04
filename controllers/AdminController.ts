import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";


export const FindVendor=async (id: String, email?:string)=>{
  if (email) {
    return await Vendor.findOne({email: email})
  }else{
    return await Vendor.findById(id)
  }
}


export const CreateVendor = async (req: Request, res: Response, next: NextFunction)=>{
  const {address, email,foodType,name,ownerName,password,phone,pincode} = <CreateVendorInput> req.body;

  const existingVendor = await FindVendor("",email);

  if (existingVendor !== null) {
    return res.json({"message": " A Vendor is existing with this email ID"})
  }

  //generate a salt

  const salt = await GenerateSalt();

  //encrypt the password using the salt

  const userPassword = await GeneratePassword(password, salt);


  const createdVendor = await Vendor.create({
        name: name,
        address: address,
        pincode: pincode,
        foodType: foodType,
        email: email,
        password: userPassword,
        salt: salt,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailable: false,
        coverImages: [],
        lat: 0,
        lng: 0
  })
  return res.json(createdVendor)
}

export const GetVendors = async (req: Request, res: Response, next: NextFunction)=>{

} 

export const GetVendorByID = async (req: Request, res: Response, next: NextFunction)=>{

}