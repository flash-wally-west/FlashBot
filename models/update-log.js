const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    influencer: String,
    influencee: String,
    message: Number,
    time: Number,
})

module.exports=mongoose.model("Log",schema);