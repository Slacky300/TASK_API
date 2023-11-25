const jwt = require('jsonwebtoken');
require('dotenv').config();
const isAuthenticated = async(req,res,next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                res.status(401);
                throw new Error("Current user is not authenticated");
            }

            req.user = decoded;
            next();
        });

        if(!token){
            res.status(401);
            throw new Error("Either user is not authorized or token is missing")
        }
    }
};

module.exports = {isAuthenticated};