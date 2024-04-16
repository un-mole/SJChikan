const Product = require('../models/product');
const Supplier = require('../models/supplier');
const nodemailer = require('nodemailer');
const { errorHandler } = require('../helpers/dbErrorHandler');
const user = require('../models/user');

exports.create = (req, res, next) => {        
    const supplier = new Supplier(req.body);
    supplier.save((err, supplier) => {
        if(err || !supplier){            
            return res.status(400).json({
                error: `Data didn't save`
            });
        }
        res.status(200).json({
            supplier
        });        
    });
};

exports.see = (req, res) => {
    console.log("Userid params");
}

exports.list = (req, res) => {
    Supplier.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.sendOrder = (req, res, next) => {
    console.log(req.body);
    const output = `
    <h3>Order for ${req.body.name}</h3>
    <h3>Category : ${req.body.category}</h3>
    <h3>Description : ${req.body.description}</h3>
    <h3>Quantity required ${req.body.quantity}</h3>
    <h2>${req.body.message}</h2>
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
        subject: "Order for Inventory",
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
        message: "Order has been placed"
    });
};