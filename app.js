const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingsRouter = require('./routes/bookingsRoutes');
const bookingsController = require('./controllers/bookingsController');
const viewRouter = require('./routes/viewRoutes');

//Start express app
const app = express();

app.enable('trust proxy');

//GLOBAL MIDDLEWARES
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Implement CORS
app.use(cors()); // Access-Control-Allow-Origin * ('*' means all the requests no matter where they are coming from)

app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());

//Set security HTTP headers. NOTE: Always use for all ur express applications!
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Limit requests from the same API
const limiter = rateLimit({
    max: 100, //100 request per hour
    windowMs: 60 * 60 * 1000, //1 hour in milliseconds
    message: 'Too many request from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.post('/webhook-checkout', express.raw({type: 'application/json'}), bookingsController.webhookCheckout);

//Body parser. Reading data from the body into req.body
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended: true, limit: '10kb'}));
app.use(cookieParser());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization XSS(cross-site scripting)
app.use(xss());

//Prevent parameter pollution
app.use(hpp({whiteList: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']}));

//Compress all the texts that is sent to clients
app.use(compression());

//Test middleware
// app.use((req, res, next) => {
//     // console.log(req.cookies);
//     next();
// });

//ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingsRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;