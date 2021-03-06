const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
// const AppError = require('./../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1) Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);

    // 2) Create checkout session
    const session = await stripe.checkout.sessions.create({
        //INFORMATION ABOUT THE SESSION ITSELF
        payment_method_types: ['card'],
        // success_url: `${req.protocol}://${req.get('host')}/my-bookings/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        success_url: `${req.protocol}://${req.get('host')}/my-bookings`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        //INFORMATION ABOUT THE PRODUCT THAT THE USER IS ABOUT TO PURCHASE
        line_items: [
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                images: [`${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`],
                amount: tour.price * 100, //in cents
                currency: 'usd',
                quantity: 1
            }
        ]
    });

    // 3) Create session as response
    res.status(200).json({
        status: 'success',
        session
    });
});

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//     //THIS IS ONLY TEMPORARY, BECAUSE ITS UNSECURE: EVERYONE CAN MAKE BOOKINGS WITHOUT PAYING
//     const { tour, user, price } = req.query;
//     if (!tour && !user && !price) return next();

//     await Booking.create({
//         tour,
//         user,
//         price
//     });

//     res.redirect(req.originalUrl.split('?')[0]);
// });

const createBookingCheckout = catchAsync(async (session) => {
    const tour = session.client_reference_id;
    const user = (await User.findOne({email: session.customer_email})).id;
    const price = session.display_items[0].amount / 100;
    await Booking.create({ tour, user, price });
});

exports.webhookCheckout = catchAsync(async (req, res, next) => {
    // ALL OF THIS CODE WILL RUN WHENEVER A PAYMENT WAS SUCCESSFUL
    const signature = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        return res.status(400).send(`Webhook error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') createBookingCheckout(event.data.object);

    res.status(200).json({ received: true });
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);