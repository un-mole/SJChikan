const express = require("express");
const router = express.Router();

const {
    signup,
    signin,
    signout,
    forgot,
    requireSignin,
    otp,
    checkSignup
} = require("../controllers/auth");
const { userSignupValidator, userForgotValidator } = require("../validator");

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.post("/signin/forgot", forgot);
router.post("/otp", otp);
router.post("/checkSignup", userForgotValidator, checkSignup);

module.exports = router;
