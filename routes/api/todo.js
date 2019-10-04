const express = require('express');
const router = express.Router();
const TodoList = require('../../models/TodoList');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');


// @route POST api/todo/status
// @desc  Changes status
// @access public
router.post('/status',[auth, [
    check('status','description is required').not().isEmpty(),
    check('newstatus','description is required').not().isEmpty(),
    check('description','description is required').not().isEmpty(),
    check('title','title is required').not().isEmpty()
 ]
],
async (req,res)=> 
{ 
     const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

      try {
        const user = await User.findById(req.user.id).select("-password");

           const currentTodoList = new TodoList({
               status: req.body.status,
               description: req.body.description,
               title: req.body.title,
               user: req.user.id
           })

           let newTodoList = new TodoList({
            status: req.body.newstatus,
            description: req.body.description,
            title: req.body.title,
            user: req.user.id
        });

        const todolists = await TodoList.find();
        let found = false;
        let matchingId = "";

        console.log(currentTodoList);

        todolists.map(item => {

            if(item.status === req.body.status 
                && item.description === req.body.description
                && item.title === req.body.title)
                 {
                    console.log(item._id);
                    matchingId = item._id;
                    found = true;                    
                 }
            });



      if(!found)
        console.log("record not found");
      else {
          newTodoList= {
                          status: req.body.newstatus,
          };
           const todolist = await TodoList.findByIdAndUpdate(matchingId,newTodoList,{new: true});
           await todolist.save();

             const profileTodoListArray = [{
            "status": req.body.newstatus,
            "description": req.body.description,
            "title": req.body.title
        }];

        const profile = await Profile.find();
        let matchingIdProfile = "";
        found = false;

        profile.map(item => {
            console.log("item="+item.todolist);
            item.todolist.map(i => {
                if(i.status === currentTodoList.status &&
                 i.description === currentTodoList.description 
                 && i.title === currentTodoList.title)
                 {
                    matchingIdProfile = i._id;
                    console.log("found");
                    found =true;
                 }
            })
        });

        if(found){
            console.log("matchingProfieid="+matchingIdProfile);
            let profile = await Profile.findByIdAndUpdate(matchingIdProfile,newTodoList,{ "new": true });
            console.log("profile="+profile);
        }
        else {
            console.log("not found in profile");
        }
            res.json(todolist);
      }

    }
  catch(err){
        console.log(err.message);
          res.status(500).send("Server error");
  }
});

// @route POST api/todo
// @desc Test route
// @access public
router.post('/',[auth, [
    check('description','description is required').not().isEmpty(),
    check('title','title is required').not().isEmpty(),
 ]
]
,
async (req,res)=> { 
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select("-password");
        const newTodoList = new TodoList({
            status: 'Working',
            description: req.body.description,
            title: req.body.title,
            user: req.user.id
        });

        let todolist = await TodoList.findById(req.user.id);

        if(todolist){
            todolist.map((item) => {
                if(item.status === "Working" 
                    && item.title === req.body.title 
                    && item.description === req.body.description)
                {
                    return res.status(400).json({
                        errors: [{
                            msg: 'task already exists'
                        }]
                    });
                }
            });
        }

        if(todolist) {
            todolist = await TodoList.findOneAndUpdate(
                {user: req.user.id},
                { $set: newTodoList},
                { new: true}
            ).populate('user',['name','avatar']);
        }
        
        const profileTodoListArray = [{
            "status": "Working",
            "description": req.body.description,
            "title": req.body.title
        }];

        const profile = Profile.findById(req.user.id);

        if(profile){

          try {

          const profilenew =   Profile.findOneAndUpdate(
                 { user: req.user.id},
                {$push: {todolist: profileTodoListArray}},
                {safe: true, upsert: true},
                function(err, doc) {
                    if(err){
                    console.log(err);
                    }else{
                    //do stuff
                    }
                }
            );
            console.log("updated profile ");
            const todo = await newTodoList.save();
            res.json(todo);        

          }catch(err){

            console.error(error.message);

            if(err.kind == 'ObjectId') {
                res.status(400).json({ msg:  "Profile Not Found"});
            }
            res.status(500).send("Server Error");
    
          }           
        }
        else {
            console.log("PRofile Not found! user id="+req.user.id);
            res.status(500).send("Server Error");
        }       

        //return res.json(todolist);

    }catch(err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }


});

// @route GET api/todo
// @desc  Get all the todo list
// @access private
router.get('/',auth,async (req,res) => {

    try {
        const todolists =await TodoList.find().sort({date: -1});
        res.json(todolists);
    }catch(err){
        console.log(err.message);
        res.status(500).send("SERVER ERROR");
    }
});

// @route  GET api/todo/:id
// @desc   Get todolist by ID
// @access Private

router.get('/:id',auth,async (req,res) => {

    try {

        const todolist = await TodoList.find({user: req.params.id});

        if(!todolist){
            return res.status(404).json({ msg: "No Todo List found!"});
        }

        res.json(todolist);

    
    }catch(err){
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(404).json({ msg: "No Todo List found!"});
        }

        res.status(500).send("SERVER ERROR");
    }

})

// @route  DELETE api/todo/:id
// @desc   Removes todolist by ID
// @access Private

router.delete('/:id',auth, async (req,res) => {
    try {
        const todolist = await TodoList.findById(req.params.id);

        if(!todolist){
            return res.status(401).json({ msg: 'usr not authorizaed'});
        }

        if(todolist.user.toString() !== req.user.id){
            return res.status(401).json({ msg: 'usr not authorizaed'});
        }

        await todolist.remove();
        res.json({ msg: ' deleted to do list'});
    }catch(err) {

        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(404).json({ msg: "No Todo List found!"});
        }

        res.status(500).send("SERVER ERROR");

    }

})


module.exports = router;