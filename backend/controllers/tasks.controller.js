import Task from "../models/task.model.js"

export const getUserTasks = async(req, res, next)=>{
    try{
        const userId = req.user._id;

        const tasks = await Task.find({ user : userId }).sort({ updatedAt : -1 });

        res.status(200).json({
            success : true,
            count : tasks.length,
            data : tasks
        });
        
    }catch(error){
        next(error);
    }
}

export const addTask = async(req, res, next)=>{
    
    try{
        const newTask = await Task.create({ 
            ...req.body,
            user : req.user._id
        });

        res.status(201).json({ success : true, data : newTask });

    }catch(error){
        next(error);
    }

}

export const updateTask = async(req, res, next)=>{
    try{
        const task = await Task.findById(req.params.id);

        if(!task){
            const error = new Error("Task not found");
            error.statusCode = 404;
            throw error;
        }

        if(task.user.toString() !== req.user._id.toString()){
            const error = new Error("You are not the owner !!");
            error.statusCode = 401;
            throw error;
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new : true }
        );

        res.status(200).json({ success : true, data : updatedTask });

    }catch(error){
        next(error);
    }
}

export const deleteTask = async(req, res, next)=>{
    try{
        const task = await Task.findById(req.params.id);

        if(!task){
            const error = new Error("Task not found");
            error.statusCode = 404;
            throw error;
        }

        if(task.user.toString() !== req.user._id.toString()){
            const error = new Error("You are not owner");
            error.statusCode = 401;
            throw error;
        }

        await task.deleteOne();

        res.status(200).json({ success : true, message : "Task deleted successfully"});

    }catch(error){
        next(error);
    }
}