const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;


const workoutSchema = new mongoose.Schema({
    workout_name:{
        type: String,
        required: true,
    },
    workout_type:{
        type:[String],
        required: true,
    },
    required_equipment:{
        type: [String],
        required: true,
    },
    muscle_group:{
        type:[String],
        required: true
    },
    workout_focus:{
        type:[String],
        required:true
    },
    difficulty:{
        type:Number,
        required:true
    },
    workout_author:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    author_visible:{
        type:Boolean,
        default:true
    },
    date:{
        type:Date,
        default: Date.now
    },
    workout_description:{
        required:true,
        type:{}
    },
    likes:{
        type: Schema.Types.ObjectId,
        ref:'Likes'
    }

});

module.exports = mongoose.model('Workout', workoutSchema);