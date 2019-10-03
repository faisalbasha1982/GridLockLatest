const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
const bcrypt =  require('bcryptjs');

const User = require('../../models/User');

// @route GET api/auth
// @desc Test route
// @access public
router.get('/',auth, async (req,res)=> {

     try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
     }
     catch(err) {
        console.error(err.message);
        res.status(500).send('server error');
     }

     //res.send('Auth Route');
    
    }     
);

// @route POST api/auth
// @Desc Authenticate users & get token 
// @access public
router.post('/',[
    check('email','Please enter valid email').isEmail(),
    check('password','password is required').exists()
],
async (req,res)=> { 
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() });
    }

   
    const {  email, password } = req.body;
    try {

           // see if users exists
            let user = await User.findOne({ email });

            if(!user){
                return res.status(400).json({
                    errors: [{
                        msg: 'Invalid credentials'
                    }]
                });
            }

            const isMatch = await bcrypt.compare(password,user.password);

            if(!isMatch){
                return res.status(400).json({
                    errors: [{
                        msg: 'Invalid credentials'
                    }]
                });
            }

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
    }catch(error){
        console.error(error.message);        
        res.status(500).send('server error');
    }


});

module.exports = router;