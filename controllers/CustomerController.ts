import express, { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import {
  CreateCustomerInput,
  EditCustomerProfileInput,
  UserLoginInput,
} from "../dto";
import {
  GenerateSalt,
  GeneratePassword,
  GenerateOtp,
  onRequestOtp,
  GenerateSignature,
  ValidatePassword,
} from "../utility";
import { Customer } from "../models";

export const CustomerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(CreateCustomerInput, req.body);
  const validationError = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (validationError.length > 0) {
    return res.status(400).json(validationError);
  }

  const { email, phone, password } = customerInputs;

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const { otp, expiry } = await GenerateOtp();
  const existingCustomer = await Customer.find({ email: email });
  // console.log(typeof(existingCustomer));
  console.log(expiry);

  if (existingCustomer.length > 0) {
    return res.status(400).json({
      message: "Email already exists",
    });
  }

  const result = await Customer.create({
    email: email,
    password: userPassword,
    salt: salt,
    phone: phone,
    otp: otp,
    otp_expiry: expiry,
    firstName: "",
    lastName: "",
    address: "",
    verified: false,
    lat: 0,
    lng: 0,
    orders: [],
  });

  if (result) {
    // send otp to customer
    await onRequestOtp(otp, phone);

    //Generate the signature
    const signature = await GenerateSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });
    //send the result
    return res
      .status(201)
      .json({ signature, verified: result.verified, email: result.email });
  }
  return res
    .status(400)
    .json({ message: "Internal Server Error, while creating user" });
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(UserLoginInput, req.body);
  const validationError = await validate(customerInputs, {
    validationError: { target: true },
  });
  if (validationError.length > 0) {
    return res.status(400).json(validationError);
  }
  const { email, password } = customerInputs;
  const customer = await Customer.findOne({ email: email });
  if (customer) {
    const validation = await ValidatePassword(
      password,
      customer.password,
      customer.salt
    );
    if (validation) {
      const signature = await GenerateSignature({
        _id: customer._id,
        email: customer.email,
        verified: customer.verified,
      });
      return res.status(200).json({
        signature,
        verified: customer.verified,
        email: customer.email,
      });
    } else {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
  }
  return res.json({ msg: "Error with signup" });
};
export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;

        const updatedCustomerResponse = await profile.save();

        const signature = await GenerateSignature({
          _id: updatedCustomerResponse._id,
          email: updatedCustomerResponse.email,
          verified: updatedCustomerResponse.verified,
        });

        return res.status(200).json({
          signature,
          verified: updatedCustomerResponse.verified,
          email: updatedCustomerResponse.email,
        });
      }
    }
  }
  return res.status(400).json({ message: "Invalid OTP" });
};
export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      const { otp, expiry } = GenerateOtp();
      profile.otp = otp;
      profile.otp_expiry = expiry;

      await profile.save();
      const sendCode = await onRequestOtp(otp, profile.phone);

      if (!sendCode) {
        return res.status(400).json({
          message: "Failed to verify your phone number",
        });
      }
      return res
        .status(200)
        .json({
          message: "OTP send to your registered mobile number successfully",
        });
    }
  }
  return res.status(400).json({
    msg: "Error with requesting OTP",
  });
};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      return res.status(200).json(profile);
    }
  }
};
export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  const customerInputs = plainToClass(EditCustomerProfileInput, req.body);
  const validationError = await validate(customerInputs, {
    validationError: { target: true },
  });
  if (validationError.length > 0) {
    return res.status(400).json(validationError);
  }
  const { firstName, lastName, address } = customerInputs;
  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;
      const result = await profile.save();

      return res.status(201).json(result);
    }
  }
  return res.status(400).json({ msg: "Error while Updating profile" });
};

/*--------------Delivery Notifications--------------------*/
const assignOrderForDelivery = async (orderId: string, vendorId: string) => {};
const validateTransaction = async (txtId: string) => {};

export const CreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
export const GetOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
export const GetOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
export const AddToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
export const GetCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
export const DeleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
export const VerifyOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
export const CreatePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
