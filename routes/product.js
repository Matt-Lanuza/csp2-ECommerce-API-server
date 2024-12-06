//product routes
//[dependencies and modules]
const express = require("express");
const productController = require("../controllers/product");
const { verify, verifyAdmin, isLoggedIn } = require("../auth");


//[routing component]
const router = express.Router();

/*
	*** Routes will be placed here ***
*/

// Create product
router.post('/', verify, verifyAdmin, isLoggedIn, productController.createProduct);

// Retrieve all products
router.get('/all', verify, verifyAdmin, isLoggedIn, productController.getAllProducts);

// Retrieve all active products
router.get('/active', productController.getAllActiveProducts);

// Retrieve single product
router.get('/:productId', productController.getSingleProduct);

// Update Product Information
router.patch('/:productId/update', verify, verifyAdmin, isLoggedIn, productController.updateProductInformation);

// Archive product
router.patch("/:productId/archive", verify, verifyAdmin, isLoggedIn, productController.archiveProduct);

// Activate product
router.patch("/:productId/activate", verify, verifyAdmin, isLoggedIn, productController.activateProduct);

// Search products by name
router.post('/search-by-name', productController.searchProductsByName);

// Search products by price range
router.post('/search-by-price', productController.searchProductsByPriceRange);


//[export route system]
module.exports = router;