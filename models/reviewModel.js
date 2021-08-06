const mongoose = require('mongoose');
const {Schema} = mongoose;
const Tour = require('./tourModel');

const reviewSchema = new Schema({
    review: {
        type: String,
        required: [true, 'Review cannot be empty!']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour!']
    },    
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user!']
    }
}, {//this is to make sure that when we have a field that is not stored in the database but 
    //calculated using some other value, it should still also show up in the output
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

//PREVENTING DUPLICATE REVIEWS
reviewSchema.index({tour: 1, user: 1}, {unique: true});

reviewSchema.pre(/^find/, function(next) {
    // this.populate({
    //     path: 'tour',
    //     select: 'name', //this means we only want the tour name and nothing else
    // }).populate({
    //     path: 'user',
    //     select: 'name photo'
    // });
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

//CALCULATING AVERAGE RATING ON TOURS
reviewSchema.statics.calcAverageRatings = async function(tourId) {
    //in a static method, the "this" keyword points to the current model(in this case Review)
    const stats = await this.aggregate([
        {
            $match: {tour: tourId}
        },
        {
            $group: {
                _id: '$tour',
                numRatings: {$sum: 1},
                avgRating: {$avg: '$rating'}
            }
        }
    ]);
    // console.log(stats);

    //Persisting the statistics into the tour collection
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].numRatings,
            ratingsAverage: stats[0].avgRating
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    }
};

reviewSchema.post('save', function() {
    //"this" points to current review
    //the constructor is the model that created the document, so "this.constructor" stands for the tour
    this.constructor.calcAverageRatings(this.tour);
    // next(); //the post middleware does not get access to next
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.rev = await this.findOne();
    // console.log(this.rev);
    next();
});

reviewSchema.post(/^findOneAnd/, async function() {
    //this.rev = await this.findOne(); does not work here cuz query has already executed
    await this.rev.constructor.calcAverageRatings(this.rev.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;