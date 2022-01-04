const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    influencerID: Number,
    influenceeID: Number,
    influencer: String,
    influencee: String,
    message: Number,
    time: String,
})

module.exports=mongoose.model("update-log",schema);
