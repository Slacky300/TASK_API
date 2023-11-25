const Task = require('../models/task');
const User = require('../models/userModel');

const createTask = async (req, res) => {

    try{
        const {title, description, status} = req.body;
        if(!title || !description || !status){
            return res.status(400).json({msg: "Please enter all fields"})
        }
        const newTask = await Task.createOne({title, description, status, creator: req.user._id});

        const user = await User.findById(req.user._id);

        user.tasksCreated.push(newTask._id);
        await user.save();

        res.status(201).json(newTask)
    }catch(err){
        console.log(err)
        res.status(500).json({msg: "Server error"})
    }
}

const assignTask = async (req, res) => {

    try{

        const {taskId} = req.params;
        const {userId} = req.body;

        const task = await Task.findById(taskId);
        const user = await User.findById(userId);

        if(!task || !user){
            return res.status(404).json({msg: "Task or User not found"})
        }

        task.assignedTo = userId;
        await task.save();

        user.tasksAssigned.push(taskId);
        await user.save();

        res.status(200).json({msg: "Task assigned successfully", user: user, task: task})

    }catch(err){
        console.log(err)
        res.status(500).json({msg: "Server error"})
    }
}