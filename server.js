const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json({ extended: false }));

app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/todo',require('./routes/api/todo'));

if(process.env.NODE_ENV === 'production')
{
    //static folder
    app.use(express.static('client/build'));
    app.get('*',(req,res) =>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    });
}

app.listen(PORT,() => {
    console.log(`Server Started on PORT : ${PORT}`);
})
