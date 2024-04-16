const { text } = require("body-parser");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const supplierSchema = mongoose.Schema(
    {
    name:{
        type: String,
        trim: true,
        required: true,
    },
    phone:{
        type: Number,
        trim: true,
        maxLength: 10,
        minLength: 10,
        required: true,
    },
    email:{
        type: String,
        trim: true,
        maxLength: 32,
        required: true,
    },
    address:{
        type: String,
        trim: true
    },
    category:{
        type: ObjectId,
        ref: "Category",
        required: true
    },
},
{timestamps : true}
);

module.exports = mongoose.model("Supplier", supplierSchema);