const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    reviewerID: Number,
    revieweeID: Number,
    reviewer: String,
    reviewee: String,
    time: String,
})

module.exports=mongoose.model("Rating-Log",schema);
