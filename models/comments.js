const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;


const commentsSchema = new mongoose.Schema({
    workout_id:{
        type: Schema.Types.ObjectId,
        ref:'Workout'
    },
    total_comments:{
        type:Number,
        default: 0,
    },
    comments:{
        type:[String]
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comments', commentsSchema);