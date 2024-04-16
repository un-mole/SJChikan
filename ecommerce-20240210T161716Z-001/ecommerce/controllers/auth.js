const User = require('../models/user');
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for authorization check
const { errorHandler } = require('../helpers/dbErrorHandler');
const nodemailer = require('nodemailer');

// using promise
exports.signup = (req, res) => {
    console.log(req.body);
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                // error: errorHandler(err)
                error: 'Email is taken'
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });
    });
};

exports.checkSignup = (req, res) => {
    const { email } = req.body;
    User.findOne({ email }, (err, user) => {
        if(err || !user){
            return res.status(200).json({
                error: false
            })
        }
        else{
            console.log("User found");
            return res.status(400).json({
                error: `Email already exists`
            });
        }
    })
};

// using async/await
// exports.signup = async (req, res) => {
//     try {
//         const user = await new User(req.body);
//         console.log(req.body);

//         await user.save((err, user) => {
//             if (err) {
//                 // return res.status(400).json({ err });
//                 return res.status(400).json({
//                     error: 'Email is taken'
//                 });
//             }
//             res.status(200).json({ user });
//         });
//     } catch (err) {
//         console.error(err.message);
//     }
// };

exports.signin = (req, res) => {
    // find the user based on email
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {        
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup'
            });
        }
        // if user is found make sure the email and password match
        // create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password dont match'
            });
        }
        // generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        // persist the token as 't' in cookie with expiry date
        res.cookie('t', token, { expire: new Date() + 9999 });
        // return response with user and token to frontend client
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    });
};

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: 'Signout success' });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth'
});

exports.isAuth = (req, res, next) => {
    // console.log(req.body);
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: 'Access denied'
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: 'Admin resourse! Access denied'
        });
    }
    next();
};

exports.forgot = (req, res, next) => {
    const email = req.body;
    console.log(email);
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            console.log(err);            
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup'
            });
        }
        else{
            console.log(user);
        }
    });
};

exports.otp = (req, res, next) => {    
    console.log(req.body);
    const otp = Math.round(Math.random()*9999)
    // console.log(otp);
    const output = `
    <h3>OTP for SIGN UP ${otp}</h3>
    `;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: `${process.env.USER}`,
            pass: `${process.env.PASS}`,
        }
    });

    let mailOptions = {
        from: "adityasharma21902@gmail.com",
        to: `${req.body.email}`,        
        subject: "OTP For SIGN UP",
        html: `${output}`
    };

    transporter.sendMail(mailOptions, function(err, info) {
        if(err){            
            console.log(err);
            return;
        }
        console.log("Sent: " + info.response);
    });    
    return res.status(200).json({
        otp: otp
    });
};