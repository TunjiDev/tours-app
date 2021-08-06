const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

// router.param('id', (req, res, next, val) => {
//     console.log(`User ID is ${val}`);
//     next();
// });

//Open to everyone. U don't need to be logged in to perform any of the 4 actions below
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//Protects all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe); //Update profile
router.delete('/deleteMe', userController.deleteMe); //Delete/deactivate user account

//Admins only
router.use(authController.restrictTo('admin'));

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;