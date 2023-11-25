const Task = require('../models/taskModel');
const User = require('../models/userModel');

const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo } = req.body;

        if (!title || !description) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }

        const newTask = await Task.create({ title, description, creator: req.user.id });

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        if(assignedTo){
            for (const userId of assignedTo) {
                const existingUser = await User.findById(userId);
    
                if (!existingUser) {
                    return res.status(404).json({ msg: "User not found", user: userId });
                }
    
                existingUser.tasksAssigned.push(newTask._id);
                await existingUser.save();
    
                newTask.assignedTo.push(userId);
            }
            await newTask.save();
        }

        res.status(201).json({
            msg: "Task created successfully",
            task: newTask,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};


const assignTaskToUsers = async (req, res) => {

    try{

        const {taskId} = req.params;
        const {listOfUsers} = req.body;
        const task = await Task.findById(taskId);

        if(!task){
            return res.status(404).json({msg: "Task not found"})
        }

        if(!listOfUsers){
            return res.status(400).json({msg: "Please enter all fields"})
        }

        const usersAlreadyAssignedsWithTheTask = [];


        for(const user of listOfUsers){

            const existingUser = await User.findById(user);

            if(!existingUser){
                return res.status(404).json({msg: "User not found", user: user})
            }

            if(existingUser.tasksAssigned.includes(taskId)){

                usersAlreadyAssignedsWithTheTask.push(existingUser._id);
                continue;
            }

            existingUser.tasksAssigned.push(taskId);
            await existingUser.save();

            task.assignedTo.push(user);

            await task.save();
        }

        res.status(200).json({msg: "Task assigned successfully", task: task, usersAlreadyAssignedsWithTheTask: usersAlreadyAssignedsWithTheTask})

    }catch(err){
        console.log(err)
        res.status(500).json({msg: "Server error"})
    }
}


const getAssignedTasks = async (req, res) => {
    
    try{
    
        const tasks = await Task.find({assignedTo:{$in: [req.user.id]}});
        
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
    
        const tasks = await Task.find({creator: req.user.id});
        
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
    try {

        const { taskId } = req.params;
        const { title, description, status, assignedTo } = req.body;

        const task = await Task.findById(taskId);

        if(task.creator.toString() !== req.user.id || task.assignedTo.includes(req.user.id) === false){
            return res.status(401).json({msg: "Not authorized"})
        }

        if (!task) {
            return res.status(404).json({ msg: "Task not found" });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;

        await task.save();

        const usersAlreadyAssignedsWithTheTask = [];

        if (assignedTo) {
            for (const user of assignedTo) {
                const existingUser = await User.findById(user);

                if (!existingUser) {
                    return res.status(404).json({ msg: "User not found", user: user });
                }

                if (existingUser.tasksAssigned.includes(taskId)) {
                    usersAlreadyAssignedsWithTheTask.push(existingUser._id);
                    continue;
                }

                existingUser.tasksAssigned.push(taskId);
                await existingUser.save();

                task.assignedTo.push(user);
            }

            await task.save();
        }

        if (assignedTo.length === 0) {
            task.assignedTo = undefined;
            await task.save();
        }

        res.status(200).json({
            msg: "Task updated successfully",
            task: task,
            usersAlreadyAssignedsWithTheTask: usersAlreadyAssignedsWithTheTask,
       
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server error" });
    }
};
const deleteTask = async (req, res) => {   


    try{

        const {taskId} = req.params;

        const task = await Task.findById(taskId);

        if(!task){
            return res.status(404).json({msg: "Task not found"})
        }

        if(task.creator.toString() !== req.user.id){
            return res.status(401).json({msg: "Not authorized"})
        }

        const creator = await User.findById(task.creator);

        if(!creator){
            return res.status(404).json({msg: "User not found"})
        }

        creator.tasksCreated.pull(taskId);

        await creator.save();

        for(const user of task.assignedTo){

            const existingUser = await User.findById(user);

            if(!existingUser){

                return res.status(404).json({msg: "User not found", user: user})
            }

            existingUser.tasksAssigned.pull(taskId);
        
            await existingUser.save();

        }


        await task.remove();

        res.status(200).json({msg: "Task deleted successfully"})

    }catch(err){
        console.log(err)
        res.status(500).json({msg: "Server error"})
    }
}

const getTasksAnalytics = async (req, res) => {

    try{
            
            const tasks = await Task.find({creator: req.user.id});
    
            if(!tasks){
                return res.status(404).json({msg: "No tasks found"})
            }

            const tasks_assinged = await Task.find({assignedTo:{$in: [req.user.id]}});

            const tasks_analytics = {
                total_tasks_created: tasks.length,
                total_tasks_completed: 0,
                total_tasks_in_progress: 0,
                total_tasks_todo: 0,
                total_tasks_assigned: 0,
            }

            for(const task of tasks_assinged){
                if(task.status === "done"){
                    tasks_analytics.total_tasks_completed += 1;
                }else if(task.status === "inProgress"){
                    tasks_analytics.total_tasks_in_progress += 1;
                }else if(task.status === "todo"){
                    tasks_analytics.total_tasks_todo += 1;
                }
                tasks_analytics.total_tasks_assigned += 1;
            }

            res.status(200).json(tasks_analytics)
    



    }catch(err){
        console.log(err)
        res.status(500).json({msg: "Server error"})
    }

}

const getSingleTask = async (req, res) => {

    try{

        const {taskId} = req.params;

        const task = await Task.findById(taskId);

        if(!task){
            return res.status(404).json({msg: "Task not found"})
        }

        res.status(200).json(task)

    }catch(err){
        console.log(err)
        res.status(500).json({msg: "Server error"})
    }
}

const getListOfAllTasks = async (req, res) => {

    try{

        const tasks = await Task.find();

        if(!tasks){
            return res.status(404).json({msg: "No tasks found"})
        }  

        res.status(200).json(tasks)
    }catch(err){
        console.log(err)
        res.status(500).json({msg: "Server error"})
    }
}

module.exports = {
    createTask,
    assignTaskToUsers,
    getAssignedTasks,
    getCreatedTasks,
    updateTask,
    deleteTask,
    getTasksAnalytics,
    getListOfAllTasks,
    getSingleTask
}