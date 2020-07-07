const router = require('express').Router();
const verify = require('./verifyToken');
const newWorkoutModel = require('../models/workouts');
const userModel = require('../models/user');
const likesModel = require('../models/likes');
const commentsModel = require('../models/comments');


///post a new workout

router.post('/new', verify ,(req, res) => {
    const userID = req.user;
    const { workout_name, workout_type, required_equipment, 
            workout_focus, muscle_group, difficulty, author_visible,
            workout_description, equipment   } = req.body;

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
            equipment
        });
        workout.save()
        .then(bresponse => {
            res.send(bresponse)
            
        })
        .catch(err => res.send({message:"something when wrong when trying to create the workout"}))
   })   
});


////************
///// GET ALL THE WORKOUTS
// *****************

router.get('/all',(req, res) => {
   const page = parseInt(req.query.page);
   const pagination = parseInt(req.query.pagination);

   newWorkoutModel.count()
   .then(response => {
       const meta={
           total_pages: Math.round(response / pagination),
           page
        }
        newWorkoutModel.find()
        .skip((page - 1) * pagination)
        .limit(pagination)
        .populate('workout_author', 'username')
        .populate('likes_count')
        .populate('comments', 'total_comments')
        .then(response => {
            const dataa = {
                data: response,
                meta
            }
            res.send(dataa)
        })
        .catch(err => res.status(500).send({message:"something when wrong when trying to get the workouts"}))   
   })
   .catch(err => { console.log(err)})
});


////************
///// GET ONE WORKOUT
// *****************

router.get('/workout/:id',(req, res) => {
    const workout_id = req.params.id;  

    newWorkoutModel.findOne({_id:workout_id})
    .populate('workout_author', 'username')
    .populate('likes_count')
    .populate('comments')
    .then(response => {
        res.send(response)
    })
    .catch(err => { res.send(err)})
 });




////************
///// LIKE A WORKOUT 
// *****************

router.post('/like', verify, (req,res) => {
    const userID = req.user._id;
    const workout_id  = req.body.workoutid;

    likesModel.findOne({workout_id})
    .then(response => {
        if(response){
            if(!response.user_ids.includes(userID)){
                response.user_ids = response.user_ids.concat(userID);
                response.likes = response.likes + 1
                response.save();
                res.send({message:"like posted"})
            } 
        }else{
           const like = new likesModel({workout_id: workout_id, likes:1, user_ids:userID});
           like.save().then(likeres => {
                newWorkoutModel.findByIdAndUpdate(workout_id, {likes_count:likeres._id}).then(workoutres => console.log(workoutres)).catch(error => console.log(error))
           }).catch(err => console.log(err))
           res.send({message:"like posted"})
        }
    })
    .catch(err => {
        res.status(500).send(err);
        console.log(err);
    })
})


///remove like from a workout
router.post('/:id/dislike', verify, (req,res) => {
    const userID = req.user;
    const workout_id  = req.params.id;

    likesModel.findOneAndUpdate({workout_id}, {$pull: {'user_ids': userID._id}, '$inc': {likes: -1}})
    .then(response => {
        res.send(response)
    })
    .catch(err => {
        res.status(500).send(err)
    })
})



////************
///// POST A COMMENT
// *****************


router.post('/comment', verify, (req,res) => {
    const userID = req.user._id;
    const { workout_id, comment }  = req.body;

    commentsModel.findOne({workout_id})
    .then(response => {
        if(response){
            response.comments = response.comments.concat(comment);
            response.total_comments = response.comments.length;
            response.save();
            res.send(response);
        }else{
           const newComment = new commentsModel({workout_id: workout_id, total_comments:1, comments:comment});
           newComment.save().then(newCommentResponse => {
               newWorkoutModel.findByIdAndUpdate(workout_id, {comments:newCommentResponse._id})
               .then(workoutres => res.send({message:"posted"})).catch(error => console.log(error))
           }).catch(err => console.log(err))
        }
    })
    .catch(err => {
        res.status(500).send(err);
        console.log(err);
    })
})


module.exports = router;