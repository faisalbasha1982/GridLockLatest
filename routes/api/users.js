const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const gravatar = require('gravatar');
const bcrypt =  require('bcryptjs');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route POST api/users
// @desc Register User
// @access public
router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','Please enter valid email').isEmail(),
    check('password','Please enter valid password').isLength({ min: 6 })
],
async (req,res)=> { 
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() });
    }

   
    const { name, email, password } = req.body;
    try {

           // see if users exists
            let user = await User.findOne({ email });

            if(user){
                return res.status(400).json({
                    errors: [{
                        msg: 'user already exists'
                    }]
                });
            }

            // gravatar
            const avatar = gravatar.url(email,{
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            user = new User({
                name,
                email,
                avatar,
                password
            })

            // encrpyt password using bcrypt
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password,salt);
            await user.save();

            // return jsonwebtoken
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload,config.get('jwtSecret'),{ expiresIn: 360000}, (err,token) =>{

                    if(err){
                        throw err;
                    }
                    res.json({ token });
            });

        //res.send('User Registered');        

    }catch(error){
        console.error(error.message);        
        res.status(500).send('server error');
    }


});

module.exports = router;