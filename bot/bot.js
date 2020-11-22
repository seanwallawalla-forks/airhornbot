const Discord = require('discord.js-light');

const { onUserJoin, onUserLeave, subscribeHorn } = require('../lib/VoiceState');
const { getPathForSound } = require('../lib/HornAudio');

const client = new Discord.Client({
  ws: {
    intents: ['GUILDS', 'GUILD_VOICE_STATES'],
  },
});

client.on('voiceStateUpdate', async (oldMember, newMember) => {
  if (newMember == null) {
    onUserLeave(oldMember.id);
  } else {
    onUserJoin(newMember.id, newMember.channelID);
  }
});

client.once('ready', () => {
  console.log('Ready!');
});

client.login(process.env.BOT_TOKEN);

subscribeHorn(async (channelId, soundName) => {
  console.log('Received a horn event', channelId, soundName);
  const channel = await client.channels.fetch(channelId);
  if (channel == null) {
    console.log('Null channel for', channelId);
    return;
  }
  const connection = await channel.join();
  const soundPath = getPathForSound(soundName);
  if (soundPath == null) {
    console.log('Unknown sound for', soundName);
    channel.leave();
  } else {
    const dispatcher = connection.play(soundPath);
    dispatcher.on('finish', () => {
      channel.leave();
    });
  }
});
