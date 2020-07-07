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
    equipment:{
        type: String,
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
    likes_count:{
        type: Schema.Types.ObjectId,
        ref:'Likes'
    },
    liked_by_user:{
        type:Boolean,
        default:false
    },
    comments:{
        type: Schema.Types.ObjectId,
        ref:'Comments'
    }

});

module.exports = mongoose.model('Workout', workoutSchema);