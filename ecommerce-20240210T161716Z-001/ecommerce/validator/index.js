exports.userSignupValidator = (req, res, next) => {    
    req.check('name', 'Name is required').notEmpty();
    req.check('email', 'Email must be between 3 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 4,
            max: 32
        });
    req.check('phone', 'Phone number is required')
        .notEmpty()
        .isLength({
            min: 10,
            max: 10
        })
        .withMessage('Phone number must be 10 digits only');
    req.check('password', 'Password is required').notEmpty();
    req.check('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number')
        // .matches(/.+\#./)
        // .matches(/.+\!.+\@.+\#.+\$.+\%.+.\^.+\&.+\*.+\(.+\).+/)
        // .withMessage('Password must contain a special character');
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

exports.userForgotValidator = (req, res, next) => {
    // console.log(req.body);
    req.check('email', 'Email must be between 3 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 4,
            max: 32
        });    
    // req.check('password', 'Password is required').notEmpty();
    // req.check('password')
    //     .isLength({ min: 6 })
    //     .withMessage('Password must contain at least 6 characters')
    //     .matches(/\d/)
    //     .withMessage('Password must contain a number')
        // .matches(/.+\#./)
        // .matches(/.+\!.+\@.+\#.+\$.+\%.+.\^.+\&.+\*.+\(.+\).+/)
        // .withMessage('Password must contain a special character');
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

exports.addSupplierValidator = (req, res, next) => {
    req.check('name', 'Name is required').notEmpty();
    req.check('phone', 'Phone number is required')
        .notEmpty()
        .isLength({
            min: 10,
            max: 10
        })
        .withMessage('Phone number must be 10 digits only');
    req.check('email', 'Email must be between 3 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 4,
            max: 32
        });
    req.check('address', 'Address is required').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

exports.sendOrderValidator = (req, res, next) => {
    console.log("Inside validator");
    console.log(req.body);
    req.check('name', 'Name is required').notEmpty();
    req.check('description', 'Description is required').notEmpty();
    req.check('supplier', 'Supplier cannot be empty').notEmpty();
    req.check('category', 'Category is required').notEmpty();
    // req.check('quantity')
    // .notEmpty()
    //     .isLength({
    //         max: 3
    //     })
    //     .withMessage('Max order limit 999')
        // .matches(/\d/)
        // .withMessage('Quantity must be a number');
    req.check('message', 'Message is required').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
}