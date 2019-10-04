const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile  = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator/check');

// @route  GET api/profile/me
// @desc   GET current users profile
// @access Private
router.get('/me',auth,async (req,res)=> { 
    try {
            const profile = await Profile.findOne({ user: req.user.id});
            const user = await User.findById(req.user.id);

            let finalResult = {};

            if(user){
                finalResult = {
                    "name": user.name,
                    "email": user.email,
                    "avatar": user.avatar,
                    "todolist": profile.todolist
                }
            }            


        if(!profile) {
            return res.status(400).json({ msg:'No Profile for this user' })
        }

        if(!user) {
            return res.status(400).json({ msg:'No User found for this profile' })
        }

        res.json(finalResult);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route  POST api/profile
// @desc   Create pr update user profile
// @access Private

router.post('/',[auth,[
        check('todolist','tasks is required').not().isEmpty(),
    ]],
  async  (req,res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }

    const {
        todolist
    } = req.body;

    console.log("received todolist:");
    console.log(todolist);

    // build profile object
    const profileFields = { todolist:[] };
    let todolistFields = {};

    profileFields.user = req.user.id;
    var parsedJSON = JSON.parse(JSON.stringify(todolist));

    console.log("parsed JSON");
    console.log(parsedJSON);

    parsedJSON.map((item) => {

        todolistFields.title = item.title;
        todolistFields.description = item.description;
        todolistFields.status = item.status;

        profileFields.todolist.push({ title: item.title, description: item.description, status: item.status});
    });

    try {

        let profile = await Profile.findOne({
            user: req.user.id,
        });

        if(profile) {
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                { $set: profileFields},
                { new: true}
            );

            return res.json(profile);
        }

        // Create 
        profile = new Profile(profileFields);
        await profile.save((error3, response) => {
            if (error3) {
                console.error(`Error ${error3}\n${error3.stack}`);                
            }
    
            console.log('Successfully saved profile');
            process.exit(0);
          });    
          
        // console.log(profile);        
        res.json(profile);
        
    }catch(error){
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});



// @route  GET api/profile
// @desc   Get all profiles
// @access Private

router.get('/',async (req,res)=>{

    try {
        const profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);

    }catch(error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }

});


// @route  GET api/profile/user/:user_id
// @desc   Get profile by user ID
// @access Public
router.get('/user/:user_id',async (req,res)=>{

    try {
        const profile = await Profile.findOne({user: req.params.user_id }).populate('user',['name','avatar']);

        if(!profile)
          res.status(400).json({ msg:  "There is no profile for this user"});

          res.json(profile);

    }catch(error) {
        console.error(error.message);
        if(err.kind == 'ObjectId') {
            res.status(400).json({ msg:  "Profile Not Found"});
        }
        res.status(500).send("Server Error");
    }

});


// @route  DELETE api/profile
// @desc   Delete profile by user ID
// @access Private
router.delete('/',auth,async (req,res)=>{

    try {
        console.log("req id="+req.user.id);
        // @todo - remove tasks
        await Profile.findOneAndRemove({ user: req.user.id });
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: "user deleted"});

    }catch(error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }

});


module.exports = router;