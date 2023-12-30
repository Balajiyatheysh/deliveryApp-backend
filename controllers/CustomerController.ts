import express, {Request, Response, NextFunction} from 'express';

export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {}
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
