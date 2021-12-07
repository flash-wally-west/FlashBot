module.exports.run = async(bot, message, args) => {
    const m = await message.channel.send("Ping??");
    m.edit(`Pong! ${m.createdTimeStamp - message.createdTimeStamp}ms`)
}

module.exports.help = {
    name: "ping",
    aliases: ["p"]
}