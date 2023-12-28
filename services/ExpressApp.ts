import express, { Application} from 'express'
import { AdminRoute, VendorRoute, ShoppingRoutes } from '../routes'
import path from 'path'

export default async(app: Application)=>{

  app.use(express.json());
  app.use(express.urlencoded({extended: true}))
  app.use('/images' , express.static(path.join(__filename, 'images')))
    
  app.use("/admin", AdminRoute);
  app.use("/vendor", VendorRoute);
  app.use("/shoppingroute", ShoppingRoutes);
  
  return app
}


