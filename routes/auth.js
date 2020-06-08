const router = require('express').Router();
const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');

router.post('/signup', async (req, res) => {
    const {username, password, email} = req.body;

///hash password
const salt = await bcrypt.genSalt(10);
const hashPassword = await bcrypt.hash(password, salt);

///check if username and email exist
    UserModel.findOne({username})
    .then( response => { 
        if(response){
            res.send({message:"username already exist"})
        }else{
            UserModel.findOne({email})
            .then(response => { 
                if(response){ 
                    res.send({message:"email already exist"});
                }else{
                      ///create the new user
                        const user = new UserModel({
                            username,
                            password:hashPassword,
                            email
                        });

                        user.save()
                        .then(response => {
                            res.send({message:"user was sucessfully created"});
                        })
                        .catch(err => {
                            res.status(400).send({message:"something when wrong"});
                        })  
                }
            
            })
        }
    });
});


router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    
    //check if username exist
    UserModel.findOne({username})
    .then(response => {
        if(response){
            const validPass = bcrypt.compare(password, response.password)
            .then(bresponse => {
                if(validPass){
                    res.send("Success")
                }else{
                    res.send({message:"incorrect username or password"})
                }
            })
        }else{
            res.send({message:"incorrect username or password"})
        }
    })
    .catch(err => {
        res.send(err)
    })

})





module.exports = router;