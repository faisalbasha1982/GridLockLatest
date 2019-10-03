var mongoose = require('mongoose');
var config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
       await  mongoose.connect(db,{ useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify:false });
       console.log("mongo db connected");
    }
    catch(err){
            console.error(err.message);
            process.exit(1); // exit the process with failure
    }
}

module.exports = connectDB;