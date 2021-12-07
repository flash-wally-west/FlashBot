const mongoose = require("mongoose");
const Discord = require('discord.js');
const mongoPass = process.env.MONGO_URI;
const Data = require("../models/better-currencies.js");

function numToEmoji(num) {
    var outStr = "";
    var emoji = [":zero:", ":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:"];
    var numString = num.toString();
    var chars = numString.split('');
    for (var i = 0; i < chars.length; i++) {
        var emoj = parseInt(chars[i]);
        outStr = outStr + emoji[emoj];
      }
      return outStr;
}

function makeStatEmbed(name,influence,version,coin){
    console.log("setting up embed");
    const embed = new Discord.MessageEmbed()
      // Set the title of the field
      .setTitle(`${name}'s stats`)
      // Set the color of the embed
      .setColor(0xff0000)
      // Set the main content of the embed
      .addField('Influence',influence)
      .addField('Version',version)
      .addField('Better Coin',coin)
    return embed;
}

//Connect to DB
mongoose.connect(mongoPass,{
    keepAlive:true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports.run = async(bot, message, args) => {
    var user;
    if(!args[0]) {
        user = message.author;
    } else {
        user = message.mentions.users.first() || bot.users.cache.get(args[0]);
    }
    if(user===undefined){
        return message.channel.send(`Sorry, couldn't find user ${args[0]}`);
    } else if(user.bot){
        return message.channel.send(`Bots do not participate in the delta system. Yet.`);
    }
    Data.findOne({
        userID: user.id
    },(err,data)=>{
        if(err) console.log(err);
        if(!data) {
            const newData = new Data({
                name: bot.users.cache.get(user.id).tag,
                userID: user.id,
                influence: 0,
                version:0,
                better_coin:0,
                pieces:0
            })
            newData.save().catch(err=>console.log(err));
            const embed = makeStatEmbed(bot.users.cache.get(user.id).username,numToEmoji(0),numToEmoji(0),numToEmoji(0));
            // Send the embed
            return message.channel.send(`${bot.users.cache.get(user.id).username} stats:\nInfluence: 0\nVersion: 0\nBetterCoin: 0`);
        } else {

            const embed = makeStatEmbed(bot.users.cache.get(user.id).username,
            numToEmoji(data.influence),numToEmoji(data.version),numToEmoji(data.better_coin));
            // Send the embed
            return message.channel.send(`${bot.users.cache.get(user.id).username} stats:\nInfluence: ${data.influence}\nVersion: ${data.version}\nBetterCoin: ${data.better_coin}`);
        }
    })
}

module.exports.help = {
    name: "stats",
    aliases: ["s"]
}