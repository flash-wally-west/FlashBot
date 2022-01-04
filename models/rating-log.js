const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    reviewer: String,
    reviewee: String,
    message: Number,
    time: Number,
})

module.exports=mongoose.model("Rating-Log",schema);
