const Task = require('../models/task');
const User = require('../models/userModel');
const assignTasks = require('../helpers/assignTasks');

const createTask = async (req, res) => {

    try{
        const {title, description, status, assignedTo} = req.body;


        if(!title || !description || !status){
            return res.status(400).json({msg: "Please enter all fields"})
        }


        const newTask = await Task.createOne({title, description, status, creator: req.user._id});

        const user = await User.findById(req.user._id);

        user.tasksCreated.push(newTask._id);
        await user.save();

        if(assignedTo){

            const result =  await assignTasks(assignedTo, newTask._id);

            if(result.errors.taskId){
                return res.status(404).json({msg: result.errors.taskId})
            }

            if(result.errors.listOfUsers){
                return res.status(400).json({msg: result.errors.listOfUsers})
            }

            if(result.errors.userNotFound.length > 0){
                return res.status(404).json({msg: "User not found", users: result.errors.userNotFound})
            }

            res.status(201).json({msg: "Task created successfully", task: newTask, assignedTo: result.assignedTo, alreadyAssigned: result.alreadyAssigned})

        }

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

        const result = await assignTasks(userId, taskId);

        if(result.errors.taskId){
            return res.status(404).json({msg: result.errors.taskId})
        }

        if(result.errors.listOfUsers){
            return res.status(400).json({msg: result.errors.listOfUsers})
        }

        res.status(200).json({msg: "Task assigned successfully", assignedTo: result.assignedTo, alreadyAssigned: result.alreadyAssigned})


    }catch(err){
        console.log(err)
        res.status(500).json({msg: "Server error"})
    }
}


const getAssignedTasks = async (req, res) => {
    
    try{
    
        const tasks = await Task.find({assignedTo:{$in: [req.user._id]}});
        
        if(!tasks){
            return res.status(404).json({msg: "No tasks found"})
        }
        res.status(200).json(tasks)
    
    }catch(err){
        console.log(err)
        res.status(500).json({msg: "Server error"})
    }
}

const getCreatedTasks = async (req, res) => {
    
    try{
    
        const tasks = await Task.find({creator: req.user._id});
        
        if(!tasks){
            return res.status(404).json({msg: "No tasks found"})
        }
        res.status(200).json(tasks)
    
    }catch(err){
        console.log(err)
        res.status(500).json({msg: "Server error"})
    }
}

const updateTask = async (req, res) => {

    try{

        const {taskId} = req.params;
        const {title, description, status, assignedTo} = req.body;

        const task = await Task.findById(taskId);



        if(!task){
            return res.status(404).json({msg: "Task not found"})
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;

        await task.save();

        if(assignedTo){

            const result =  await assignTasks(assignedTo, task._id);

            if(result.errors.taskId){
                return res.status(404).json({msg: result.errors.taskId})
            }

            if(result.errors.listOfUsers){
                return res.status(400).json({msg: result.errors.listOfUsers})
            }

            if(result.errors.userNotFound.length  === assignedTo.length){
                return res.status(404).json({msg: "Users not found", users: result.errors.userNotFound})
            }

            if(result.alreadyAssigned.length  === assignedTo.length){
                return res.status(400).json({msg: "Task already assigned to all users", users: result.alreadyAssigned})
            }

            res.status(200).json({msg: "Task created successfully", task: task, assignedTo: result.assignedTo, alreadyAssigned: result.alreadyAssigned})

        }

        res.status(200).json({msg: "Task updated successfully", task: task})

    }catch(err){
        console.log(err)
        res.status(500).json({msg: "Server error"})
    }
}

const deleteTask = async (req, res) => {   


    try{

        const {taskId} = req.params;

        const task = await Task.findById(taskId);

        if(!task){
            return res.status(404).json({msg: "Task not found"})
        }

        const user = await User.findById(task.creator);

        user.tasksCreated = user.tasksCreated.filter(task => task.toString() !== taskId.toString());

        await user.save();

        for(let i = 0; i< task.assignedTo.length; i++){
                
            const user = await User.findById(task.assignedTo[i]);
    
            user.tasksAssigned = user.tasksAssigned.filter(task => task.toString() !== taskId.toString());
    
            await user.save();
        }

        await task.remove();

        res.status(200).json({msg: "Task deleted successfully"})

    }catch(err){
        console.log(err)
        res.status(500).json({msg: "Server error"})
    }
}

module.exports = {
    createTask,
    assignTask,
    getAssignedTasks,
    getCreatedTasks,
    updateTask,
    deleteTask
}