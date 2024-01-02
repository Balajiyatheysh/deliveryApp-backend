import express, {Request, Response, NextFunction} from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCustomerInput } from '../dto';
import { GenerateSalt, GeneratePassword, GenerateOtp, onRequestOtp, GenerateSignature } from '../utility';
import { Customer } from '../models';

export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {

  const customerInputs = plainToClass(CreateCustomerInput, req.body);
  const validationError = await validate(customerInputs, {validationError:{target: true}}) 

  if (validationError.length > 0) {
    return res.status(400).json(validationError);
  }

  const {email, phone, password} = customerInputs;

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const {otp, expiry} = await GenerateOtp();

  const existingCustomer = await Customer.find({email: email})

  if(existingCustomer !== null){
    return res.status(400).json({
      message: 'Email already exists'
    })
  }  

  const result = await Customer.create({
    email: email,
    password: userPassword,
    phone: phone,
    otp: otp,
    otp_expiry: expiry,
    firstName: '',
    lastName: '',
    address: '',
    verified: false,
    lat: 0,
    lng: 0,
    orders:[]
  })

  if(result){
    // send otp to customer
    await onRequestOtp(otp, phone);

    //Generate the signature
    const signature = await GenerateSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    })
    //send the result
    return res.status(201).json({signature, verified: result.verified, email: result.email})
  }
}


export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {}
export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) => {}
export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {}
export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {}
export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {}


/*--------------Delivery Notifications--------------------*/
const assignOrderForDelivery = async (orderId: string, vendorId: string) => {}
const validateTransaction = async (txtId : string) => {}

export const CreateOrder = async (req: Request, res: Response, next: NextFunction) =>{}
export const GetOrders = async (req: Request, res: Response, next: NextFunction) =>{}
export const GetOrderById = async (req: Request, res: Response, next: NextFunction) => {}
export const AddToCart = async (req: Request, res: Response, next: NextFunction) => {}
export const GetCart = async (req: Request, res: Response, next: NextFunction) => {}
export const DeleteCart = async (req: Request, res: Response, next: NextFunction) => {}
export const VerifyOffer = async (req: Request, res: Response, next: NextFunction) => {}
export const CreatePayment = async (req: Request, res: Response, next: NextFunction) => {}
