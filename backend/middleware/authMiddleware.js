const jwt = require('jsonwebtoken');
const user = require('../models/User');

//Middleware to protect routes

const protect = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            //Get token from header
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await user.findById(decoded.user.id).select('-password'); //Exclude Password from response
            next();
        }
        catch(error){
            console.error("Token verification failed:",error);
            res.status(401).json({message: 'Not authorized, token failed'});
        }
    } else {
        res.status(401).json({message: 'Not authorized, no token provided'});
    }
};

//middleware to check if user is admin
const admin = (req, res, next) => {
    if(req.user && req.user.role === 'admin'){
        next();
    } else {
        res.status(401).json({message: 'Not authorized as an admin'});
    }
};

module.exports = {protect, admin};