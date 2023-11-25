const mongoose = require('mongoose');
require('dotenv').config();
const dbConnect = async (db) => {

    
    await mongoose.connect(db)
        .then(() => console.log('Connected to MongoDB...'))
        .catch(err => console.log('Could not connect to MongoDB...', err));
}

module.exports = {dbConnect};