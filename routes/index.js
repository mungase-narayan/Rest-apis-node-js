const express = require('express');
const router = express.Router();

const registerController = require('../controllers');
const loginController = require('../controllers');


//Routes
router.post('/register' , registerController.registerUser); 
router.post("/login", loginController.loginUser); 

module.exports = router;