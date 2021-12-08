//Hello Word

require('dotenv').config()

const Discord = require('discord.js')
const mongoose = require('mongoose')
const { Client, Intents } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const BC_Schema = require('./models/better-currencies');
const fs = require("fs");
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MEMBERS,Intents.FLAGS.GUILD_PRESENCES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,Intents.FLAGS.GUILD_VOICE_STATES,
  Intents.FLAGS.DIRECT_MESSAGES,Intents.FLAGS.DIRECT_MESSAGE_REACTIONS
], partials: ['MESSAGE','GUILD_MEMBER', 'USER', 'CHANNEL', 'REACTION']   });
client.commands= new Discord.Collection();
client.aliases= new Discord.Collection();


//READ COMMANDS FOLDER
fs.readdir("./commands/", (err, files) => {
  if(err) console.log(err);

  let jsfile = files.filter(f =>f.split(".").pop()==="js")
  if(jsfile.length <= 0 ) {
      console.log("Could not find any commands");
      return;
  }

  jsfile.forEach((f) => {
      let props = require(`./commands/${f}`);
      console.log(`${f} loaded!`)
      client.commands.set(props.help.name, props);

      props.help.aliases.forEach(alias => {
          client.aliases.set(alias, props.help.name);
      })
  })

  
})

client.on('ready', async() => {
    await mongoose.connect(process.env.MONGO_URI,{
        keepAlive:true
        
    })
	console.log('Ready!');
});

client.on("message", msg => {
    if(msg.content.indexOf("Better")!==-1||msg.content.indexOf("better")!==-1){
        if(msg.author.id!=='913880004083986473'){msg.react('❤️');}
    }

   /*if(msg.content.indexOf(`Review:\n\nDid you have a better conversation? React with the rating you'd like to give to this user, 0 being a much worse conversation, and 5 being a much better conversation.`)!==-1){
        if(msg.author.id===""){};
    }*/
    
    if(msg.channel.name==="🗳suggestion-box"){
    //if (msg.channel.name === "suggestion-box") {
      if((!msg.content.startsWith("!suggest"))&&(!msg.author.bot)){
          msg.reply('Please preface your message with "!suggest" so that Carl-bot can track your suggestions and you can see whether it was approved or denied. For example:\n\n> !suggest ban flash')
          //msg.channel.send("!suggest "+msg.content)
          //msg.reply("Please preface your message with \n\n> !suggest ban flash\n\n so that Carl Bot can track your suggestions and you can see whether it was approved or denied")
      }
    }
    let prefix = "better.";
    if(!msg.content.startsWith(prefix)){
      return;
    }
    //DEFINE ARGS AND COMMANDS
    let args = msg.content.slice(prefix.length).trim().split(/ +/g);
    let cmd;
    cmd = args.shift().toLowerCase();
    let command;
    let commandfile = client.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(client, msg, args)

    //RUN COMMANDS
    if (client.commands.has(cmd)) {
        command = client.commands.get(cmd);
    } else if (client.aliases.has(cmd)){
        command = client.commands.get(client.aliases.get(cmd));
    }
    try {
        command.run(client, msg, args);
    } catch(e){
        return;
    }


        
    //}

});

client.on('voiceStateUpdate',(oldMember,newMember) => {
    const vc_alert_channel = client.channels.cache.find(channel => channel.name === 'vc-alert');
    if(oldMember.channel===null){
        vc_alert_channel.send(`${newMember.member.user.username} joined ${newMember.channel.name}`);
    } else if(newMember.channel===null) {
        vc_alert_channel.send(`${newMember.member.user.username} left ${oldMember.channel.name}`);
    } else{
        vc_alert_channel.send(`${newMember.member.user.username} switched from ${oldMember.channel.name} to ${newMember.channel.name}`);
    }
    
});

client.on('messageReactionAdd', async(reaction, user) => {
    if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
    }

    


    
    //reaction.message.reply(`${user.username} reacted with "${reaction.emoji.name}".`);
	console.log(`${user.username} reacted with "${reaction.emoji.name}".`);

    const bad_emojis = ['🤮','🤢', '💩','🤦','🤦‍♀️','🤦‍♂️','🖕',
    '😠','😡','🤨','🙄','🤡','😬','🤥','🤬','👎','🤣','😂','😆','❓','❔'];
    const log_channel = client.channels.cache.find(channel => channel.name === 'modbotlog');

    
    if(bad_emojis.includes(reaction.emoji.name)){
        //log_channel.send(`${user.tag} reacted with bad emoji ${reaction.emoji.name} on ${reaction.message.url}`);
        log_channel.send({
            embeds: [
              {
                color: '#297ECD',
                description: `**${user} reacted with ${
                  reaction.emoji
                }** [Jump to Message](${reaction.message.url})\n\n${
                  reaction.message.content || (await reaction.message.fetch()).content
                }`,
                footer: {
                  text: `User: ${user.id} | Message ID: ${reaction.message.id}`,
                },
                timestamp: reaction.createdTimestamp,
                author: {
                  name: user.tag,
                  iconURL: user.displayAvatarURL(),
                },
              },
              ...reaction.message.embeds,
            ],
          });
        //reaction.remove();
    }
    
});


client.login(process.env.BOT_TOKEN);
