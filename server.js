const express = require('express');


const app = express();


app.use(express.json());

const PORT = process.env.PORT || 8000;

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