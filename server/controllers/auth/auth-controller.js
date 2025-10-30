const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');


// Register

exports.registerUser = async(req, res)=> {
    const {UserName, email, password} = req.body;

    try {
        const checkUser = await User.findOne({email})
        if(checkUser) return res.json({
            success: false,
            message: "User already exist with same email. Please try with other email."
        })
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            UserName, 
            email, 
            password : hashPassword
        })

        await newUser.save();
        res.status(200).json({
            success : true,
            message : "Registration successful"
        })
        
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Some error occured"
        })
    }
}


// Login

exports.loginUser = async(req, res) =>{
    const {email, password} = req.body;

    try {
        const checkUser = await User.findOne({email});
        if(!checkUser) return res.json({
            success: false,
            message: "User doesn't exixts! Please register first."
        })

        const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
        if(!checkPasswordMatch) return res.json({
            success: false,
            message: "Incorrect password! Please try again..."
        })

        const token = jwt.sign({
            id: checkUser._id, 
            role: checkUser.role, 
            email: checkUser.email,
            UserName: checkUser.UserName 
        }, 'CLIENT_SECRET_KEY', {expiresIn : '1d'})

        res.cookie('token', token, {httpOnly: true, secure: false}).json({
            success: true,
            message: "Loggedin successfull",
            user: {
                email: checkUser.email,
                role: checkUser.role,
                id: checkUser._id,
                UserName: checkUser.UserName 
            }
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Some error occured"
        })
    }
}



// Logout

exports.logoutUser = (req, res) =>{
    res.clearCookie("token").json({
        success: true,
        message: "Logged out successfully!"
    })
}


// auth-middleware 

exports.authMiddleware = async(req, res, next)=>{
    const token = req.cookies.token;
    if(!token) return res.status(401).json({
        success: false,
        message: "Unautherized User"
    })

    try {
        const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
        // console.log('Decoded Token:', decoded);
        req.user = decoded;
        next()
    }
    catch(error) {
        // console.log('JWT Verification Error:', error.message);
        res.status(401).json({
            success: false,
            message: "Unautherized User!"
        })
    }
}