const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;


const likesSchema = new mongoose.Schema({
    user_ids:{
        type:[String],
        required: true
    },
    workout_id:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Likes', likesSchema);