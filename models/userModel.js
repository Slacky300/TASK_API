const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email!'],
        unique: true,
        lowercase: true,
        trim: true
    },
    
    password: {
        type: String,
        required: [true, 'Please provide a password!'],
        minlength: 8
    },

    tasksCreated: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Task'
        }
    ],

    tasksAssigned: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Task'
        }
    ],

},{timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;