const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json({ extended: false }));
app.get('/',(req,res)=> res.send("api running"));

app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/todo',require('./routes/api/todo'));

app.listen(PORT,() => {
    console.log(`Server Started on PORT : ${PORT}`);
})
