const mongoose = require("mongoose");
const Discord = require('discord.js');
const mongoPass = process.env.MONGO_URI;
const Data = require("../models/better-currencies.js");

mongoose.connect(mongoPass,{
    keepAlive:true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports.run = async(bot, message, args) => {
    if(message.channel.type!=="DM"){
        return message.reply("This is a DM only command.");
    }
    const list = bot.guilds.cache.get("663406888272134204");
    var found_a_user = 0;
    /*if(!args[0]){
        return message.reply("Please enter the rating between 0-5 followed by the tag of the user you want to review. For example:\n> better.review 1 flash#4171");
    } else{
        var rating = parseInt(args[0]);
        console.log(rating);
        if(isNaN(rating)){
            return message.reply("Please enter a number as a rating.")
        } else if(rating>5||rating<0){
            return message.reply("Please enter a rating between 0 and 5 inclusive.");
        }
    }*/
    if(!args[0]) {
        return message.reply("Please specify the user you wish to review.");
    } else{
        try{
            const reply = await message.reply(
                {content:`Review:\n\nDid you have a better conversation? React with the rating you'd like to give to this user, 0 being a much worse conversation, and 5 being a much better conversation.`,
            fetchReply:true});
            await reply.react('0️⃣');
            await reply.react('1️⃣');
            await reply.react('2️⃣');
            await reply.react('3️⃣');
            await reply.react('4️⃣');
            await reply.react('5️⃣');
        }catch(error){
            //handle error
        }
        

        //console.log(reply.message);
        /*
        list.members.cache.each(member => {
            console.log(member.user.tag);
            if(args[0]===member.user.tag){
                found_a_user = 1;
                Data.findOne({
                    userID: member.user.id
                },(err,data)=>{
                    if(err) console.log(err);
                    if(!data) {
                        const newData = new Data({
                            name: member.user.tag,
                            userID: member.user.id,
                            influence: 0,
                            version:0,
                            better_coin:rating,
                            pieces:0,
                        })
                        newData.save().catch(err=>console.log(err));
                        message.reply(`Successfully gave ${rating} BetterCoin to ${member.user.tag}`);
                        
                    } else {
                        data.better_coin+=rating;
                        data.save().catch(err=>console.log(err));
                        message.reply(`Successfully gave ${rating} BetterCoin to ${member.user.tag}`);
                    }
                })
            }
        });
        if(found_a_user===0){message.reply('You did not specify a user in the Better Conversations server');}
        */
    }
    

}

module.exports.help = {
    name: "review",
    aliases: ["r"]
}