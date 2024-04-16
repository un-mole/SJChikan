const express = require("express");
const router = express.Router();

const { create, sendOrder } = require('../controllers/supplier');
const { addSupplierValidator, sendOrderValidator } = require('../validator/index');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { see, list } = require('../controllers/supplier');

router.post("/supplier/create", addSupplierValidator, create);
router.post("/supplier/sendorder", sendOrderValidator, sendOrder); //
router.get("/suppliers", list);

// router.param("userId", see);
module.exports = router;