const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, 'Please provide a title!'],
        trim: true
    },

    description: {
        type: String,
        required: [true, 'Please provide a description!'],
        trim: true
    },

    status: {
        type: String,
        enum: ['todo', 'inProgress', 'done'],
        default: 'todo'
    },

    creator: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },

    assignedTo: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }]

},{timestamps: true});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;