const express = require('express');
const router = express.Router();

const registerController = require('../controllers/auth/registerControllers');
const loginController = require('../controllers/auth/loginControllers');
const userController = require("../controllers/auth/userControllers");


//Routes
router.post('/auth/register' , registerController.registerUser); 
router.post("/auth/login", loginController.loginUser); 
router.get("/auth/me", userController.userData);


module.exports = router;