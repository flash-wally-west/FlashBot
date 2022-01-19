const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    reviewerID: String,
    revieweeID: String,
    reviewer: String,
    reviewee: String,
    time: String,
})

module.exports=mongoose.model("Rating-Log",schema);
