const Discord = require('discord.js-light');

const { onUserJoin, onUserLeave, subscribeHorn } = require('../lib/VoiceState');
const { getStreamForSound } = require('../lib/HornAudio');

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

  try {
    const connection = await channel.join();
    const sound = getStreamForSound(soundName);
    if (sound == null) {
      console.log('Unknown sound for', soundName);
      channel.leave();
    } else {
      console.log('Streaming', soundName);
      const dispatcher = connection.play(sound, {
        type: 'ogg/opus',
        volume: false,
      });
      dispatcher.on('finish', () => {
        channel.leave();
      });
    }
  } catch (ex) {
    console.error(ex);
    channel.leave();
  }
});
