import { Request, Response, NextFunction } from "express";
import { CreateFoodInput,EditVendorInput, VendorLoginInput } from "../dto";
import { FindVendor } from "./AdminController";
import { GenerateSignature, ValidatePassword } from "../utility";
import { Food } from "../models";

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VendorLoginInput>req.body;
  const existtingUser = await FindVendor("", email);
  if (existtingUser !== null) {
    const validation = await ValidatePassword(
      password,
      existtingUser.password,
      existtingUser.salt
    );
    if (validation) {
      const signature = await GenerateSignature({
        _id: existtingUser._id,
        email: existtingUser.email,
        name: existtingUser.name,
      });
      return res.json(signature);
    }
  }

  return res.json({ message: "Login Credentials is not Valid" });
};

export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
        console.log(user)
    const existingVendor = await FindVendor(user._id);
    return res.json(existingVendor);
  }
  res.json({ message: "Vendor information not found" });
};

export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const { foodType, name, address, phone } = <EditVendorInput>req.body;

  if (user) {
    const existingUser = await FindVendor(user._id);

    if (existingUser !== null) {
      existingUser.name = name;
      existingUser.foodType = foodType;
      existingUser.address = address;
      existingUser.phone = phone;
      const updatedUser = await existingUser.save();

      return res.json(updatedUser);
    }
    return res.json(existingUser);
  }

  res.json({ message: "Unable to update Vendor profile" });
};

export const UpdateVendorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const vendor = await FindVendor(user._id);
    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      vendor.coverImages.push(...images);

      const saveResult = await vendor.save();

      return res.json(saveResult);
    }
  }

  res.json({ message: "Unable to update Vendor Cover Image" });
};

export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const user = req.user;
    const {lat, lng} = req.body;
    if (user) {
        const existingUser = await FindVendor(user._id);
        if (existingUser !== null) {
            existingUser.serviceAvailable = ! existingUser.serviceAvailable;
            if (lat && lng) {
                existingUser.lat = lat;
                existingUser.lng = lng;
            }
            const saveResult = await existingUser.save();
            return res.json(saveResult);
        }
    }
  res.json({ "message": "Unable to update Vendor Service" });
};

export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user= req.user;
  const {name, description, category, foodType, readyTime, price} = <CreateFoodInput>req.body;
  if (user) {
    const vendor = await FindVendor(user._id);

    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => {
        const sanitizedFileName = file.filename.replace(/\s+/g, '_');
        return sanitizedFileName;
      });
      
      const createFood = await Food.create({
        vendorId: vendor._id,
        name: name,
        description: description,
        category: category,
        foodType: foodType,
        readyTime: readyTime,
        price: price,
        images: images,
        rating: 0,
      })

      vendor.foods.push(createFood);
      const saveResult = await vendor.save();

      return res.json(saveResult);
    }
  }
  res.json({ message: "Hello from vendor add food" });
};

export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const foods = await Food.find({ vendorId: user._id });
    if (foods !== null) {
      return res.json(foods);
    }
  }
  res.json({ message: "Food not found" });
};

export const AddOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({ message: "Hello from vendor add offer" });
};


export const EditOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({ message: "Hello from vendor edit offer" });
};

export const GetOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({ message: "Hello from vendor get offers" });
};

export const GetOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({ message: "Hello from vendor get order details" });
};

export const GetOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({ message: "Hello from vendor get orders" });
};

export const ProcessOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({ message: "Hello from vendor process order" });
};
