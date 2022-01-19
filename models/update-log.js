const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    influencerID: String,
    influenceeID: String,
    influencer: String,
    influencee: String,
    message: String,
    time: String,
})

module.exports=mongoose.model("update-log",schema);
