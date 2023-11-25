const express = require('express');
const {dbConnect} = require('./utils/dbConnect');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();


app.use(express.json());

const PORT = process.env.PORT || 8000;



app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tasks', taskRoutes);

const start = async () => {

    try{

        await dbConnect(process.env.MONGODB_URI);

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })

    }catch(err){
        console.log(err)
    }
}

start();