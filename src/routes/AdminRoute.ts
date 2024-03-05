import express from 'express'
import { CreateVendor, GetDeliveryUsers, GetTransactions, GetTransactionsByID, GetVendorByID, GetVendors, VerifyDeliveryUser } from '../controllers';

const router = express.Router();

router.post('/vendor', CreateVendor)

router.get('/vendors', GetVendors)
router.get('/vendor/:id', GetVendorByID)

router.get('/transactions', GetTransactions);
router.get('/transactions/:id', GetTransactionsByID);

router.put('/delivery/verify', VerifyDeliveryUser);
router.get('/delivery/users', GetDeliveryUsers);

router.get('/', (req, res) => {
  res.json({message:"Admin Route"});
})

export {router as AdminRoute}