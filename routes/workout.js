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
            workout_author: response._id,
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
   newWorkoutModel.find()
   .populate('workout_author', 'username')
   .populate('likes_count')
   .then(response => {
       res.send(response)
   })
   .catch(err => res.status(500).send({message:"something when wrong when trying to get the workouts"}))   
});


////************
///// LIKE A WORKOUT 
// *****************
router.post('/:id/like', verify, (req,res) => {
    const userID = req.user;
    const workout_id  = req.params.id;

    likesModel.findOne({workout_id})
    .then(response => {
        if(response === null){
            const newLike = new likesModel({
                user_ids:userID._id,
                workout_id,
                likes: 1
            })
            newLike.save()
            .then(likesresponse => {
                res.send(likesresponse)
                newWorkoutModel.findOneAndUpdate({workout_id})
                .then(workoutresponse => {
                    workoutresponse.likes_count = likesresponse._id
                    workoutresponse.liked_by_user = likesresponse.user_ids.includes(userID._id) ? true : false
                    workoutresponse.save()
                }).catch(errworkout => res.status(500).send(errworkout))
            })
            .catch(errlikes => console.log(errlikes))
        }else{
            if(!response.user_ids.includes(userID._id)){
                response.user_ids = response.user_ids.concat(userID)
                response.likes = response.likes + 1
                response.save()
                res.send(response)
            }else{
                res.status(500).send({message:"duplicated id"})
            }
        }
    })
    .catch(err => {
        res.status(500).send(err)
    })
})


///remove like from a workout
router.post('/:id/dislike', verify, (req,res) => {
    const userID = req.user;
    const workout_id  = req.params.id;

    likesModel.findOneAndUpdate({workout_id}, {$pull: {'user_ids': userID._id}, '$inc': {likes: -1}})
    .then(response => {
        res.send(response);
        newWorkoutModel.findOneAndUpdate({workout_id})
            .then(workoutresponse => {
                workoutresponse.liked_by_user = response.user_ids.includes(userID._id) ? true : false
                workoutresponse.save()
            }).catch(errworkout => res.status(500).send(errworkout))
    })
    .catch(err => {
        res.status(500).send(err)
    })
})




module.exports = router;