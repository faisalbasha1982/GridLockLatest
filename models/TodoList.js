const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TodoListSchema = new Schema({ 

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
    },
    date: {
        type: Date,
        defaults: Date.now
    }
});

const TodoList = mongoose.model('TodoList', TodoListSchema);

module.exports = TodoList;