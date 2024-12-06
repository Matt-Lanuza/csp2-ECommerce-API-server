//user routes
//[dependencies and modules]
const express = require("express");
const cartController = require("../controllers/cart");
const { verify, isLoggedIn } = require("../auth");

//[routing component] 
const router = express.Router();


/*
	*** Routes will be placed here ***
*/

// Get User's Cart
router.get('/get-cart', verify, isLoggedIn, cartController.getUserCart);

// Add to Cart
router.post('/add-to-cart', verify, isLoggedIn, cartController.addToCart);

// Change product quantities in Cart
router.patch('/update-cart-quantity', verify, isLoggedIn, cartController.updateCartQuantity);

// Remove products from cart
router.patch('/:productId/remove-from-cart', verify, isLoggedIn, cartController.removeProductFromCart);

// Clear cart items
router.put('/clear-cart', verify, isLoggedIn, cartController.clearCartItems);








//[export route system]
module.exports = router;