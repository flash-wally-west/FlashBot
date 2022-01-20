const mongoose = require("mongoose");
const Discord = require('discord.js');
const mongoPass = process.env.MONGO_URI;

mongoose.connect(mongoPass,{
    keepAlive:true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports.run = async(bot, message, args) => {
    if(message.channel.name.indexOf("vote")!==-1 && message.channel.name.indexOf("voting")!==-1){
        return message.reply("This only works in a voting channel");
    }
    const filter = () => {
        return true;
    }
    
    message.reply("Okay, listening for candidates")
        .then( async()=> {
            message.channel.awaitMessages({filter, max: 20, time: 30000, errors: ['time'] })
                .then( async collected => {
                    collected.forEach( async member => {
                        if(member.content==="end"){
                            return message.reply("No longer listening");
                        } else {
                            try {
                                await member.react('0️⃣');
                                await member.react('1️⃣');
                                await member.react('2️⃣');
                                await member.react('3️⃣');
                                await member.react('4️⃣');
                                await member.react('5️⃣');

                            }catch(error){
                                console.log(error);
                                //handle error
                            }

                            //other stuff
                            //somehow keep track of the incoming reactions
                            //disallow >1 reaction per message
                        }
                        });
                    
                })
                .catch(collected => {
                    message.reply("Timed out");
                });
        
       });
}

module.exports.help = {
    name: "star-vote",
    aliases: ["star"]
}
