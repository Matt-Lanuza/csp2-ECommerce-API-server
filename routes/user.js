//user routes
//[dependencies and modules]
const express = require("express");
const userController = require("../controllers/user");
const { verify, verifyAdmin, isLoggedIn } = require("../auth");


//[routing component]
const router = express.Router();

/*
	*** Routes will be placed here ***
*/
// User Registration
router.post('/register', userController.registerUser);

// User Authentication
router.post('/login', userController.loginUser);

// Retrieve User Details
router.get('/details', verify, isLoggedIn, userController.getUser);

//Retrieve all users
router.get('/all-users', verify, verifyAdmin, isLoggedIn, userController.getAllUsers);

// Update User as Admin
router.patch('/:id/set-as-admin', verify, verifyAdmin, isLoggedIn, userController.updateUserAsAdmin);

// Reset Password
router.patch('/update-password', verify, isLoggedIn, userController.updatePassword);

// Update profile
router.put('/update', verify, isLoggedIn, userController.updateProfile);

//[export route system]
module.exports = router;