const express = require('express');
const userController = require('../controllers/userControllers');
const authController = require('../controllers/authControllers');

const router = express.Router();


router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

//Admin can assign task to normal user

router.route('/assign-task/:taskid/:userid').put(authController.protect,authController.restrictTo('admin'),userController.assignTask)

router.route('/').post(userController.createUser).get(userController.getAllUser).delete(userController.deleteAllUser);
router.route('/:id').get(userController.getUser).delete(authController.protect,authController.restrictTo('admin'),userController.deleteUser)


module.exports = router;