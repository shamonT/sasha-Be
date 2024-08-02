const User = require('../model/users.model');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt= require('jsonwebtoken')
// Display list of all users
const user_list = async (req, res) => {
  
};
const signup = async (req, res) => {
  console.log(req.body, "dddddd");

 
  try {
    const is_email_exist = await User.findOne({ email: req.body.email });
    const is_phone_exist = await User.findOne({  PhoneNo: req.body.phoneNo });
console.log(is_email_exist,is_email_exist);

if (is_email_exist||is_phone_exist) {
    return res.status(400).send({ status: "error", code: 400, message: "User already exists" });
}

try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const response = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        PhoneNo: req.body.phoneNo
    });

    console.log(response);
    return res.status(201).send({ status: "success", code: 200 });
} catch (error) {
    console.error(error);
    return res.status(500).send({ status: "error", code: 500, message: "Internal server error" });
}
       // Send a response back to the client
  } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'An error occurred during signup' }); // Send an error response to the client
  }
};
const  signin = async (req, res) => {
    try {
      // Fetch the user by email
      let user = await User.findOne({ email: req.body.email });
  
      if (!user) {
        return res.status(401).json({ status: "error", code: 401, message: "Authentication failed. User not found." });
      }
  
      // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(req.body.password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({ status: "error", code: 401, message: "Authentication failed. Wrong password." });
      }
      let resp={
        id:user._id,
        email:user.email
      }
      console.log(resp,"resp");
  let token =jwt.sign(resp,"secretkey",{expiresIn:60})
  console.log(token,"token");
      // If the password matches, proceed with your logic (e.g., generating a token, etc.)
      console.log('User authenticated:', user);
      res.status(200).json({ status: "success", code: 200, message: "Sign in successful", token:token });
    } catch (error) {
      console.error('Error during sign in:', error);
      res.status(500).json({ status: "error", code: 500, message: "An error occurred during sign in. Please try again." });
    }
  };


  function verifyToken(req,res,next) {
    const AuthHeader = req.headers.authorization;
    if ( AuthHeader !== 'undefined') {
        const bearer = AuthHeader.split(' ');
        const Token = bearer[1];
        jwt.verify(Token,"secretkey",function(err,decoded){
            if (err) {
                res.status(500).send({error:'Auth failed'})
                
            }else{res.send(decoded)}
        })
        req.token = bearerToken;
        next();
        } else {
            res.sendStatus(403);


    }
    
  }
module.exports={user_list,signup,signin}