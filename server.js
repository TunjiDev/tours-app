const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥💥💥 Shutting down...');
    console.log(err.name, err.message, err, err.stack);
    process.exit(1);
});

dotenv.config({path: './config.env'});
const app = require('./app');

const port = process.env.PORT || 9090;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
// const DB = 'mongodb://localhost:27017/tours';

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('Database connection successful!'));

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥💥💥 Shutting down...');
  console.log(err.name, err.message, err);
  server.close(() => {
    process.exit(1);
  });
});

console.log(process.env.NODE_ENV);

// const connectToDb = async function() {
//     let server;
//     try {
//         await mongoose.connect(DB, {
//             useCreateIndex: true,
//             useUnifiedTopology: true,
//             useNewUrlParser: true,
//             useFindAndModify: false
//         });
//         server = app.listen(port, () => {
//             console.log(`App is running on port ${port} and database is connected`);
//         });
//     } catch (error) {
//         console.log(error.name, error.message);
//         console.log('UNHANDLED REJECTION! 💥💥💥 Shuting down...');
//         server.close(() => {
//             process.exit(1);
//         });
//     }
// };
// connectToDb();