const User = require("../models/userModel");
const Task = require("../models/taskModel");

const assignTask = async (listOfUsers,taskId) => {

    const tasksAssigned = {
        assignedTo: [],
        alreadyAssigned: [],
        errors: {
            taskId: "",
            listOfUsers: "",
            userNotFound: []
        }
    };
    try{



        const task = await Task.findById(taskId);

        if(!task){
            tasksAssigned.errors.taskId = "Task not found";
            return tasksAssigned;
        }

        if(!Array.isArray(listOfUsers)){
            tasksAssigned.errors.listOfUsers = "Please enter an array of userIds";
            return tasksAssigned;
        }

        for(let i = 0; i< listOfUsers.length; i++){

            const user = await User.findById(listOfUsers[i]);

            if(!user){
                tasksAssigned.errors.userNotFound.push(listOfUsers[i]);
                continue;
            }

            for(let j = 0; j< user.tasksAssigned.length; j++){
                    
                if(user.tasksAssigned[j].toString() == task._id.toString()){
                    tasksAssigned.alreadyAssigned.push(user._id);
                    continue;
                }
            }

            user.tasksAssigned.push(task._id);
            await user.save();

            task.assignedTo.push(listOfUsers[i]);
            await task.save();

            tasksAssigned.assignedTo.push(user._id);
        }

        return tasksAssigned;
        

    }catch(err){
        console.log(err)
        throw new Error('An error occurred in assignTask function.');
    }

}



module.exports = assignTask;