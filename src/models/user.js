const mongoose = require('mongoose');

const Userschema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        index : {
            unique : true
        }
    },
    email : {
        type: String,
        required: true,
        index : {
            unique : true
        }
    },
    password : {
        type: String,
        required: true,
    },
    avatar : {
        type: String
    },
    favorites: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
    }
},
{
    timestamps : true
});

const User = mongoose.model('User', Userschema);
module.exports = User;