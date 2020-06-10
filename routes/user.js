const router = require('express').Router();
const UserModel = require('../models/user');


router.post('/',  (req, res) => {
    const { id } = req.body;


///check if username and email exist
    UserModel.findById(id)
    .then( response => { 
        res.send(response)
    })
    .catch(err => {
        console.log(err)
    })
});


module.exports = router;