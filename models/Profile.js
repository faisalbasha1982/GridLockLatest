const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const profileSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    todolist: [
        {
            title: {
                type: String,
            },
            description: {
                type: String
            },
            status: {
                type: Number
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }    
});

const Profile = mongoose.model('profile', profileSchema);

module.exports = Profile;