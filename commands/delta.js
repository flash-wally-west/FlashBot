const mongoose = require("mongoose");

const mongoPass = process.env.MONGO_URI;

//Connect to DB
mongoose.connect(mongoPass,{
    keepAlive:true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Models
const Data = require("../models/better-currencies.js");
const log = require("../models/update-log.js");

function arrMin(arr){
    return Math.min(...arr);
}

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  }

async function deltaLimit(donorid,userid){
    var output = [0,0];
    let dailycount=0;
    var diff_array=[];
    for await (const doc of log.find()) {
        console.log(donorid);
        console.log(doc.influenceeID);
        if(donorid===doc.influenceeID){
            console.log("found a doc with this donor");
            console.log(userid);
            console.log(doc.influencerID);
            if(userid===doc.influencerID){
                
                var diff = (Date.now()-doc.time)
                if(diff<86400000){
                    diff_array.push(86400000-diff);
                    dailycount+=1;
                }
            }
        }
    }
    
    output[0]=dailycount;
    output[1]=round(arrMin(diff_array)/3600000,2);
    console.log(output[0]);
    return output;
}

module.exports.run = async (bot, message, args) => {
    if(!args[0]) {
        return message.reply("Please specify the user you wish to award influence");
    } else {
        mentions = message.mentions.users;
        for (let value of mentions.values()) {
            var user = value;
            var donor = message.author;
            
            
            
            if(!user) {
                message.reply("Sorry couldn't find that user.");
            }
            else if(user===donor) {
                message.reply("Nice try. You can't give yourself influence.");
            }
            else if(user.bot) {
                message.reply("Can't award influence to a bot. They'll be influential enough when they take over the world.");
            }
            else {
                var output = await deltaLimit(donor.id,user.id);
                if(output[0]>=2){
                    message.reply(`Daily limit of 2 influence for this recipient reached. Award again in ${output[1]} hours.`);
                } else{
                    Data.findOne({
                        userID: user.id
                    },(err,data)=>{
                        if(err) console.log(err);
                        if(!data) {
                            const newData = new Data({
                                name: bot.users.cache.get(user.id).tag,
                                userID: user.id,
                                influence: 1,
                                version:0,
                                better_coin:1,
                                pieces:0,
                            })
                            newData.save().catch(err=>console.log(err));
                            
                        } else {
                            data.influence+=1;
                            data.better_coin+=1;
                            data.save().catch(err=>console.log(err));
                        }
                    })
    
                    Data.findOne({
                        userID: donor.id
                    },(err,data)=>{
                        if(err) console.log(err);
                        if(!data) {
                            const newData = new Data({
                                name: bot.users.cache.get(donor.id).tag,
                                userID: donor.id,
                                influence: 0,
                                version:1,
                                better_coin:1,
                                pieces:0,
                            })
                            newData.save().catch(err=>console.log(err));
                            
                        } else {
                            data.version+=1;
                            data.better_coin+=1;
                            data.save().catch(err=>console.log(err));
                        }
                    })
                    const newLog = new log({
                        influenceeID:donor.id,
                        influencerID:user.id,
                        influencee:donor.tag,
                        influencer:user.tag,
                        message:message.id,
                        time: new Date(Date.now()).toString(),
                    })
                    newLog.save().catch(err=>console.log(err));
    
                    //Send message
                    message.channel.send(`Influence awarded successfully to ${bot.users.cache.get(user.id).username}`);
                }

                
            }
        }
        
    }

    
    
}

module.exports.help = {
    name: "delta",
    aliases: ['d']
}
