const router = require('express').Router();
const verify = require('./verifyToken');
const newWorkoutModel = require('../models/workouts');
const userModel = require('../models/user');
const likesModel = require('../models/likes');


///post a new workout

router.post('/new', verify ,(req, res) => {
    const userID = req.user;
    const { workout_name, workout_type, required_equipment, 
            workout_focus, muscle_group, difficulty, author_visible,
            workout_description   } = req.body;

   userModel.findById(userID)
   .then(response => {
        const workout = new newWorkoutModel({
            workout_name,
            workout_type,
            required_equipment,
            workout_focus,
            muscle_group,
            difficulty,
            author_visible,
            type: "workout",
            workout_description,
            workout_author: response._id
        });
        workout.save()
        .then(bresponse => {
            res.send(bresponse)
        })
        .catch(err => res.send({message:"something when wrong when trying to create the workout"}))
   })   
});


///get all the workouts
router.get('/all',(req, res) => {
    // const userID = req.user;
    
   newWorkoutModel.find()
   .populate('workout_author', 'username')
   .then(response => {
       res.send(response)
   })
   .catch(err => res.status(500).send({message:"something when wrong when trying to get the workouts"}))   
});


///like a workout
router.post('/like', verify, (req,res) => {
    const userID = req.user;
    const { workout_id } = req.body;

    likesModel.findOne({workout_id})
    .then(response => {
        if(response === null){
            const newLike = new likesModel({
                user_ids:userID,
                workout_id
            })
            newLike.save()
            res.status(200).send;
        }else{
            response.user_ids = response.user_ids.concat(userID)
            response.save()
        }
    })
    .catch(err => {
        res.status(500).send
    })



})

///get all the likes from a workout
router.get('/all/likes', (req,res) => {
    const userID = req.user;
    const { workout_id } = req.body;
    
    likesModel.find()
    .then(response => {
        console.log(response)
    })

})


module.exports = router;