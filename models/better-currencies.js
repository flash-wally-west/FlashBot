const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: String,
    userID: String,
    version: Number,
    influence: Number,
    pieces: Number,
    better_coin: Number,
    total_rating: Number,
    num_ratings: Number,
})

module.exports=mongoose.model("Data",schema);
