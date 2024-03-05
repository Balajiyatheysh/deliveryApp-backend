import express from 'express'
import { DeliveryLogin, DeliverySignUp, EditDeliveryProfile, GetDeliveryProfile, UpdateDeliveryUserStatus } from '../controllers';
import { Authenticate } from '../middlewares';
const router = express.Router();

/*------------Signup / Create Customer---------------------------*/

router.post('/signup', DeliverySignUp);

/*------------Login------------------------------------*/
router.post('/login', DeliveryLogin);

/*------------Authentication--------------------------------------------------*/
router.use(Authenticate);

/*------------Change Service Status------------------------------------------*/
router.put('/change-status', UpdateDeliveryUserStatus);

/*----------Profile---------------------*/
router.get('/profile', GetDeliveryProfile);
router.patch('/profile', EditDeliveryProfile);

export { router as DeliveryRoute }