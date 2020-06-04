const Discord = require('discord.js');

const bot = new Discord.Client();
bot.login(process.env.BOT_TOKEN);
const userID = process.env.USER_ID;
const serverID = process.env.SERVER_ID;
var connection;
var avatar;
var user;

bot.on('ready', () =>{
    user = bot.users.cache.get(userID);
    bot.user.setUsername(user.username);//init

    bot.user.setAvatar(user.displayAvatarURL());//init
    avatar = user.displayAvatarURL();

    let server = bot.guilds.cache.get(serverID);
    let user2 = server.members.cache.get(userID);
    let bot2 = server.members.cache.get(bot.user.id.toString());
    bot2.setNickname(user2.nickname);//init

    console.log('Bot initialised');

});

bot.on('voiceStateUpdate', (oldMember, newMember) => {
    process.setMaxListeners(0);

    if(newMember.channelID === null && newMember.id.toString() === userID){ //leave when user leaves
        let channel = bot.channels.cache.get(oldMember.channelID.toString());
        channel.leave();
        console.log('disconnected');
        return;
    }

    try{ //get channelid but ignore if joined from void or disconnected
        var UserChannel = newMember.channelID.toString();
        var OldChannel = oldMember.channelID.toString();
    }catch(t){}

    if(UserChannel !== undefined && newMember.id.toString() === userID && UserChannel !== OldChannel) { //join if user switches/joins channel
        console.log('voicestate updated');
        let channel = bot.channels.cache.get(UserChannel);
        connection = channel.join();
    }
});

bot.on("guildMemberUpdate", function(oldMember, newMember){


    if(oldMember.username !== newMember.username && newMember.id.toString() === userID){ //change username if user changes username (CAUTION: username != nickname)
        bot.user.setUsername(user.username);
        console.log('username changed to \'' + user.username + '\'');
    }

    if (avatar !== user.displayAvatarURL()) { //changes avatar if user changes avatar (gotta save avatarurl externally if you start/restart this often)
        bot.user.setAvatar(user.displayAvatarURL());
        avatar = user.displayAvatarURL();
        console.log('avatar changed');
    }


    const server = bot.guilds.cache.get(serverID);
    let user2 = server.members.cache.get(userID);
    let bot2 = server.members.cache.get(bot.user.id.toString());

    if(user2.nickname !== bot2.nickname){ //changes nickname if user changed nickname
        bot2.setNickname(user2.nickname);
        console.log('nickname changed to \'' + user2.nickname + '\'');
    }
});