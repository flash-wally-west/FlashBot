const mongoose = require("mongoose");
const Discord = require('discord.js');
const mongoPass = process.env.MONGO_URI;
const Data = require("../models/better-currencies.js");
const ratinglog = require("../models/rating-log.js");

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
    var recipientID;
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
        return message.reply("Please specify the tag of the user you wish to review. This includes the # and the 4 numbers following their username. For example:\n\n> better.review flash#4171")
    } else{
        list.members.cache.each(member => {
            //console.log(member.user.tag);
            if(args[0]===member.user.tag){
                found_a_user = 1;
                recipientID = member.user.id;
            }
        });
        if(found_a_user===0){return message.reply(`Sorry, couldn't find ${args[0]} in the Better Conversations server. You can only review users the Better Conversations server. \n\nMake sure to specify the tag of the user you wish to review. This includes the # and the 4 letters following their username. For example:\n\n> better.review flash#4171`);}
        try{
            const reply = await message.reply(
                {content:`Review:\n\nDid you have a better conversation with ${args[0]}? Using reactions, rate how much you enjoyed conversing with this user, 0 being a much worse conversation, and 5 being a much better conversation.`,
            fetchReply:true});
            await reply.react('0️⃣');
            await reply.react('1️⃣');
            await reply.react('2️⃣');
            await reply.react('3️⃣');
            await reply.react('4️⃣');
            await reply.react('5️⃣');
            var rating;
            const filter = (reaction, user) => {
                return ['0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣'].includes(reaction.emoji.name) && user.id === message.author.id;
            }

            reply.awaitReactions({filter,max: 1, time: 60000, errors: ['time']})
                .then(collected => {
                    const reaction = collected.first();

                    if(reaction.emoji.name==='0️⃣'){
                        rating = 0;
                    } else if(reaction.emoji.name==='1️⃣'){
                        rating = 1;
                    } else if(reaction.emoji.name==='2️⃣'){
                        rating = 2;
                    } else if(reaction.emoji.name==='3️⃣'){
                        rating = 3;
                    } else if(reaction.emoji.name==='4️⃣'){
                        rating = 4;
                    } else if(reaction.emoji.name==='5️⃣'){
                        rating = 5;
                    } else {
                        return message.reply("Error 1: You reacted with an invalid emoji");
                    }
                })
                .then(() => {
                    Data.findOne({
                        userID: recipientID
                    },(err,data)=>{
                        if(err) console.log(err);
                        if(!data) {
                            const newData = new Data({
                                name: args[0],
                                userID: recipientID,
                                influence: 0,
                                version:0,
                                better_coin:rating,
                                pieces:0,
                            })
                            newData.save().catch(err=>console.log(err));
                            message.reply(`Successfully gave ${rating} BetterCoin to ${args[0]}`);
                            
                        } else {
                            data.better_coin+=rating;
                            data.save().catch(err=>console.log(err));
                            message.reply(`Successfully gave ${rating} BetterCoin to ${args[0]}`);
                        }
                    })
                    const newLog = new ratinglog({
                        reviewerID:message.author.id,
                        revieweeID:recipientID,
                        reviewer:message.author.tag,
                        reviewee:args[0],
                        time: new Date(Date.now()).toString(),
                    })
                    newLog.save().catch(err=>console.log(err));
                })
                .catch(collected => {
                    message.reply("Timed out");
                })
        }catch(error){
            console.log(error);
            //handle error
        }
        //console.log(reply.message);
        //delay(10);
        
        
    }
    

}

module.exports.help = {
    name: "rate",
    aliases: ["r"]
}
