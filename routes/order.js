//order routes
//[dependencies and modules]
const express = require("express");
const orderController = require("../controllers/order");
const { verify, verifyAdmin, isLoggedIn } = require("../auth");

//[routing component] 
const router = express.Router();

/*
	*** Routes will be placed here ***
*/
// Create Order
router.post('/checkout', verify, isLoggedIn, orderController.createOrder);

// Retrieve loggedin user's orders
router.get('/my-orders', verify, isLoggedIn, orderController.getMyOrders);

// Retrieve all user's orders
router.get('/all-orders', verify, verifyAdmin, isLoggedIn, orderController.getAllOrders);




//[export route system]
module.exports = router;