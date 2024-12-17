const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const auth = require("../auth.js");


//Register a User

module.exports.registerUser = async (req, res) => {
    try {
        // Checks if the email is in the right format
        if (!req.body.email.includes("@")) {
            return res.status(400).send({ message: 'Invalid email format' });
        }

        // Checks if the username has at least 5 characters
        if (req.body.username.length < 5) {
            return res.status(400).send({ message: 'Username must be at least 5 characters long' });
        }

        // Checks if the password has at least 8 characters
        if (req.body.password.length < 8) {
            return res.status(400).send({ message: 'Password must be at least 8 characters long' });
        }

        // Check if user already exists (by email or username)
        const existingUser = await User.findOne({
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        });

        if (existingUser) {
            return res.status(409).send({ message: 'User already exists' });
        }

        // If all requirements are satisfied, create new user
        let newUser = new User({
            email: req.body.email,
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10)
        });

        const result = await newUser.save();

        return res.status(201).send({
            message: 'Registered successfully',
            user: result
        });
    } catch (error) {
        errorHandler(error, req, res);
    }
};



//User Login

module.exports.loginUser = (req, res) => {
    const input = req.body.email; // Accepts both email or username as input

    // Determine if input is email or username
    const query = input.includes("@")
        ? { email: input }   // If input contains "@", assume it's an email
        : { username: input }; // Otherwise, assume it's a username

    return User.findOne(query)
        .then(result => {
            if (result == null) {
                return res.status(404).send({ message: 'No user found' });
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {
                    return res.status(200).send({
                        message: 'Logged in successfully',
                        access: auth.createAccessToken(result)
                    });
                } else {
                    // 401 - Unauthorized
                    return res.status(401).send({ message: 'Incorrect email/username or password' });
                }
            }
        })
        .catch(error => errorHandler(error, req, res));
};



//Get Profile

module.exports.getProfile = (req, res) => {
	console.log(req.user);
    return User.findById(req.user.id)
    .then(user => {


        if(!user){
            //if the user has an invalid token
            return res.status(403).send({ message: 'invalid signature'})
        }else{
            user.password = "";
            //For a get request, 200 means that the server processed the request successfully and returned a response back to the client without any errors
            return res.status(200).send(user);
        }
        
    })
    .catch(error => errorHandler(error, req, res));
};
