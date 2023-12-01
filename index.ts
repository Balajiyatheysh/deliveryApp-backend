import express from 'express'
import { AdminRoute, VendorRoute } from './routes'

const app = express()

const PORT =8000

app.use("/admin", AdminRoute);
app.use("/vendor", VendorRoute);

app.listen(PORT, ()=>{
  console.clear()
  console.log(`Listening to port number ${PORT}`)
})