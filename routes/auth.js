const router = require('express').Router();
const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');

router.post('/signup', async (req, res) => {
    const {username, password, email} = req.body;

///check if username and email exist
    UserModel.findOne({username})
    .then( response => { 
        if(response){
            res.send({message:"username already exist"})
        }else{
            UserModel.findOne({email})
            .then(response => { if(response){ res.send({message:"email already exist"});} })
        }
    });

    ///hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    ///create the new user
    const user = new UserModel({
        username,
        password:hashPassword,
        email
    });

    user.save()
    .then(response => {
        res.send(response);
    })
    .catch(err => {
        res.status(400).send({message:"something when wrong"});
    })                
   

});





module.exports = router;