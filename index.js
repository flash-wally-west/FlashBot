//Hello Word

require('dotenv').config()

const Discord = require('discord.js')
const { Client, Intents } = require('discord.js');
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS], partials: ['MESSAGE', 'CHANNEL', 'REACTION']   });

client.on('ready', () => {
	console.log('Ready!');
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

    const bad_emojis = ['👎','🤮','🤢', '💩','🤦','🤦‍♀️','🤦‍♂️'];

    
    if(bad_emojis.includes(reaction.emoji.name)){
        reaction.remove();
    }
    
});


client.login(process.env.BOT_TOKEN);