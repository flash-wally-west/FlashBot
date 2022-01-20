const mongoose = require("mongoose");
const Discord = require('discord.js');
const mongoPass = process.env.MONGO_URI;

mongoose.connect(mongoPass,{
    keepAlive:true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports.run = async(bot, message, args) => {
    if(message.channel.name!=="vote"||message.channel.name!=="✅voting"||message.channel.name!=="voting"||message.channel.name!=="book-club-vote"){
        return message.reply("This only works in a voting channel");
    }
    const filter = () => {
        return true;
    }
    
    message.reply("Okay, listening for candidates")
        .then( async()=> {
            message.channel.awaitMessages({filter, max: 1, time: 30000, errors: ['time'] })
                .then( async collected => {
                    if(collected.content==="end"){
                        return;
                    } else {
                        try {
                            await collected.react('0️⃣');
                            await collected.react('1️⃣');
                            await collected.react('2️⃣');
                            await collected.react('3️⃣');
                            await collected.react('4️⃣');
                            await collected.react('5️⃣');
                            
                        }catch(error){
                            console.log(error);
                            //handle error
                        }
                        
                        //other stuff
                        //somehow keep track of the incoming reactions
                        //disallow >1 reaction per message
                    }
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
