const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');
dotenv.config({path: './../../config.env'});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
// const DB = 'mongodb://localhost:27017/tours';

const connectToDb = async function() {
    try {
        await mongoose.connect(DB, {
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        });
        console.log(`Database is connected!`);

    } catch (error) {
        console.log(error);
    }
};
connectToDb();

//READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf8'));

//IMPORT DATA INTO DATABASE
const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, {validateBeforeSave: false});
        await Review.create(reviews);
        console.log('Data successfully loaded!');
    } catch (error) {
        console.log(error);
    }
    process.exit(); //Stopping the application from running
};

//DELETE ALL DATA FROM THE COLLECTION
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data successfully deleted!');
    } catch (error) {
        console.log(error);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
}
if (process.argv[2] === '--delete') {
    deleteData();
}