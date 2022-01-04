const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    reviewer: String,
    reviewee: String,
    reviewername: String,
    revieweename: String,
    time: Number,
})

module.exports=mongoose.model("Rating-Log",schema);
