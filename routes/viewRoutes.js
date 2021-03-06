const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');
const bookingsController = require('./../controllers/bookingsController');

const router = express.Router();


// router.get('/', (req, res) => {
//     res.status(200).render('index', {
//         tour: 'The Forest Hiker',
//         user: 'Tunji'
//     });
// });

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-bookings', /*bookingsController.createBookingCheckout,*/ authController.protect, viewsController.getMyBookings);

router.post('/submit-user-data', authController.protect, viewsController.updateUserData);

module.exports = router;