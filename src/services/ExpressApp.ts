import express, { Application} from 'express'
import { AdminRoute, VendorRoute, ShoppingRoutes, CustomerRoute, DeliveryRoute } from '../routes'
import path from 'path'

export default async(app: Application)=>{

  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  const imagePath = path.join(__dirname, '../images');

  app.use('/images' , express.static(imagePath));
    
  app.use("/admin", AdminRoute);
  app.use("/vendor", VendorRoute);
  app.use("/customer", CustomerRoute);
  app.use("/delivery", DeliveryRoute);
  app.use("/shoppingroute", ShoppingRoutes);
  
  return app;
}