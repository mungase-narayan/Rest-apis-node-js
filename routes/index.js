const express = require('express');
const router = express.Router();

const registerController = require('../controllers/auth/registerControllers');
const loginController = require('../controllers/auth/loginControllers');
const userController = require("../controllers/auth/userControllers");
const refreshController = require('../controllers/auth/refreshControllers');
const productsController = require('../controllers/products/productsController');
const forgotPassControllers = require('../controllers/auth/forgotPassControllers')
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const { passwordResetValidator } = require('../helpers/validation')


//Routes
router.post('/auth/register' , registerController.registerUser); 
router.post("/auth/login", loginController.loginUser);
router.get("/auth/me", auth, userController.me);
router.post("/auth/refresh", refreshController.refresh);
router.post("/auth/logout", loginController.logout);
router.post(
    "/auth/forgot-password",
    passwordResetValidator,
    forgotPassControllers.forgotPassword
);

router.post("/products",[auth, admin], productsController.store);
router.put("/products/:id",[auth, admin], productsController.update);
router.delete("/products/:id",[auth, admin], productsController.destroy);
router.get("/products", productsController.index);
router.get("/products/:id", productsController.show);




module.exports = router;