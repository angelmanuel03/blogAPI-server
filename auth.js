const jwt = require("jsonwebtoken");

// [Section] Environment Setup
const dotenv = require("dotenv");
dotenv.config();

// [SECTION] Token Creation
module.exports.createAccessToken = (user) =>{
	// this contain the information of the user that logged in on the application
	const data = {
		id: user._id,
		username: user.username,
		email: user.email,
		isAdmin: user.isAdmin
	}

	// Generate a json web token using the jwt's sign method
	// .sign() method jwt
	return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
}



//[SECTION] Token verification
	//we will be unwrapping the JWT token
module.exports.verify = (req, res, next) => {
	// console.log(req.headers.authorization);

	let token = req.headers.authorization;

	if(typeof token === "undefined"){
		return res.send({auth : "Failed. No Token"});
	}else{
		token = token.slice(7, token.length);
		// console.log(token);

		// Token decryption
			//validate the token using the verify method from jwt for decrypting the token using the secret code.

		jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken){

			if(err){
				return res.status(403).send({
					auth: "Failed",
					message: err.message
				})
			}else{
				// we added user property in the request object with the decrypted information from the jwt as its value
				req.user = decodedToken;
				// console.log(req);

				//next() function will allow us to move to the next function in the route.
				next();
			}
		})
	}
}


module.exports.verifyAdmin = (req, res, next) => {
	console.log("This is from verifyAdmin");
	console.log(req.user);
	if(req.user.isAdmin){
		next();
	}else{
		return res.status(403).send({
			auth: "Failed",
			message: "Action Fobidden"
		})
	}
}


//[SECTION] Error Handler

module.exports.errorHandler = (err, req, res, next) =>{

	//log the error
	console.error(err);

	//Use the error message if available, otherwise default to 'Internal Server error'
	//Add status code 500
	const statusCode = err.status || 500;
	const errorMessage = err.message || 'Internal Server Error';

	//Sends a json response back to the client/POSTMAN
	res.status(statusCode).json({
		error:{
			message: errorMessage,
			errorCode: err.code || 'SERVER_ERROR',
			details: err.details || null
		}
	});
}