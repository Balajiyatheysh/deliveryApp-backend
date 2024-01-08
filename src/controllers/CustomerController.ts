import express, { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import {
  CreateCustomerInput,
  EditCustomerProfileInput,
  UserLoginInput,
  CartItem,
} from "../dto";
import {
  GenerateSalt,
  GeneratePassword,
  GenerateOtp,
  onRequestOtp,
  GenerateSignature,
  ValidatePassword,
} from "../utility";
import { OrderInputs } from "../dto";
import {
  Customer,
  Food,
  Order,
  Transaction,
  Offer,
  Vendor,
  DeliveryUser,
} from "../models";

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

console.log(otp)
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
    const otpRequest= await onRequestOtp(otp, phone);
    console.log(otpRequest);

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

      return res.status(200).json({
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

const assignOrderForDelivery = async (orderId: string, vendorId: string) => {

  //find the vendor
  const vendor = await Vendor.findById(vendorId);

  if (vendor) {

    const areaCode = vendor.pincode;
    const vendorLat = vendor.lat;
    const vendorLng = vendor.lng;

    //find the available delivery person
    const deliveryPerson = await DeliveryUser.find({
      pincode: areaCode,
      verified: true,
      isActive: true,
    });

    if (deliveryPerson) {
      //check the nearest delivery person and assign the order

      const currentOrder = await Order.findById(orderId);
      if (currentOrder) {
        //update Delivery ID
        currentOrder.deliveryId = deliveryPerson[0]._id;

        await currentOrder.save();

        //notify to vendor for received new order firebase push notification
      }
    }
  }
  //update Delivery ID
};

/*-----------Order Section----------------------*/

const validateTransaction = async (txtId: string) => {

  const currentTransaction = await Transaction.findById(txtId);

  if (currentTransaction) {
    if (currentTransaction.status.toLowerCase() !== "failed") {
      return { status: true, currentTransaction };
    }
  }

  return { status: false, currentTransaction };

};

export const CreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const customer = req.user;

  const { txnId, amount, items } = <OrderInputs>req.body;

  if (customer) {

    const { status, currentTransaction } = await validateTransaction(txnId);

    if (!status) {

      return res.status(404).json({ message: "Error while creating Order !" });

    }

    const profile = await Customer.findById(customer._id);

    const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;

    const cart = <[CartItem]>req.body;

    let cartItems = Array();

    let netAmount = 0.0;

    let vendorId;

    const foods = await Food.find()
      .where("_id")
      .in(cart.map((item) => item._id))
      .exec();

    foods.map((food) => {

      cart.map(({ _id, unit }) => {

        if (food._id == _id) {

          vendorId = food.vendorId;

          netAmount += food.price * unit;

          cartItems.push({ food, unit });
        }
      });
    });

    if (cartItems) {

      const currentOrder = await Order.create({

        orderId: orderId,
        vendorId: vendorId,
        items: cartItems,
        totalAmount: netAmount,
        paidAmount: amount,
        orderDate: new Date(),
        orderStatus: "Waiting",
        remarks: "",
        deliveryId: "",
        readyTime: 34,

      });

      profile.cart = [] as any;

      profile.orders.push(currentOrder);

      currentTransaction.vendorId = vendorId;
      currentTransaction.orderId = orderId;
      currentTransaction.status = "CONFIRMED";

      await currentTransaction.save();

      await assignOrderForDelivery(currentOrder._id, vendorId);

      const profileResponse = await profile.save();
      return res.status(200).json(profileResponse);
    }
  }
  return res.status(400).json({
    message: "Error while creating order",
  });
};

export const GetOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const customer = req.user;

  if (customer) {

    const profile = await Customer.findById(customer._id).populate("orders");

    if (profile) {
      return res.status(200).json(profile.orders);
    }
  }

  return res.status(400).json({ message: "orders not found" });

};

export const GetOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const orderId = req.params.id;

  const order = await Customer.findById(orderId).populate("items.food");

  if (order) {

    return res.status(400).json({ message: "Order not found" });

  }

};

/*----------------Cart Section---------------------------------*/

export const AddToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const customer = req.user;

  if (customer) {

    const profile = await Customer.findById(customer._id);

    let cartItems = Array();

    const { _id, unit } = <CartItem>req.body;

    const food = await Food.findById(_id);

    if (food) {

      if (profile !== null) {

        cartItems = profile.cart;

        if (cartItems.length > 0) {

          //check and update
          let existFoodItems = cartItems.filter(
            (item) => item.food._id.toString() === _id
          );

          if (existFoodItems.length > 0) {
            const index = cartItems.indexOf(existFoodItems[0]);

            if (unit > 0) {
              cartItems[index] = { food, unit };
            } else {
              cartItems.splice(index, 1);
            }
          } else {
            cartItems.push({ food, unit });
          }
        } else {
          //add new item
          cartItems.push({ food, unit });
        }

        if (cartItems) {

          profile.cart = cartItems as any;

          const cartResult = await profile.save();

          return res.status(200).json(cartResult.cart);
        }
      }
    }
  }

  return res.status(404).json({ message: "Unable to add to cart!" });

};

export const GetCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const customer = req.user;

  if (customer) {

    const profile = await Customer.findById(customer._id);

    if (profile) {

      return res.status(200).json(profile.cart);

    }
  }

  return res.status(400).json({ message: "Cart is empty...!" });

};

export const DeleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const customer = req.user;

  if (customer) {

    const profile = await Customer.findById(customer._id)
      .populate("cart.food")
      .exec();

    if (profile !== null) {

      profile.cart = [] as any;

      const cartResult = await profile.save();

      return res.status(200).json(cartResult);

    }
  }

  return res.status(400).json({ message: "cart is already empty" });

};

export const VerifyOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const offerId = req.params.id;
  const customer = req.user;

  if (customer) {
    const appliedOffer = await Offer.findById(offerId);

    if (appliedOffer) {

      if (appliedOffer.isActive) {

        return res
          .status(200)
          .json({ message: "Offer is valid", offer: appliedOffer });
      }
    }
  }

  return res.status(400).json({ message: "Offer is not valid" });

};

export const CreatePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const customer = req.user;

  const { amount, paymentMode, offerId } = req.body;

  let payableAmount = Number(amount);

  if (offerId) {

    const appliedOffer = await Offer.findById(offerId);

    if (appliedOffer.isActive) {
      payableAmount = payableAmount - appliedOffer.offerAmount;
    }

  }
  //perform payment gateway charge api

  //create record on transaction

  const transaction = Transaction.create({
    customer: customer._id,
    vendorId: "",
    orderId: "",
    orderValue: payableAmount,
    offerUsed: offerId || "NA",
    status: "OPEN",
    paymentMode: paymentMode,
    paymentResponse: "Payment is cash on delivery",
  });

  //return transaction
  return res.status(200).json(transaction);
};
