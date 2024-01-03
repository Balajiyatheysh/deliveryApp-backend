import express from 'express'
import {GetFoodAvailability, GetTopRestaurants, GetFoodAvailableIn30Minutes, SearchFoods, GetAvailableOffers, GetRestaurantByID} from '../controllers'
const router = express.Router()


/*---------------- Food Availability-----------------------*/
router.get('/:pincode', GetFoodAvailability);

/*---------------- Top Restaurant -------------------------*/
router.get('/top-restaurant/:pincode', GetTopRestaurants);

/*---------------------------Food available in 30 minutes----------------*/
router.get('/food-available-in-30-minutes/:pincode', GetFoodAvailableIn30Minutes);

/*---------------------Search Foods-------------------------------*/
router.get('/search-foods/:pincode', SearchFoods);

/*---------------------Search Offers--------------------------*/
router.get('/search-offers/:pincode', GetAvailableOffers);

/*---------------------Search Restaurants by ID--------------------------*/
router.get('/restaurant/:id', GetRestaurantByID);

export {router as ShoppingRoutes}


