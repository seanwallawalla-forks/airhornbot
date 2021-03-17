import {readFileSync} from "fs";
import path from "path";
import {Readable} from "stream";
import {VoiceChannel} from "discord.js";
import {config} from "./Configuration";

const audioBuffers: {
  [key: string]: Buffer
} = {};

type GuildQueueItem = {
  voiceChannel: VoiceChannel,
  soundFileName: string
};

const guildQueues = new Map<string, GuildQueueItem[]>();

const soundsKeys = Object.keys(config.sounds);
for (const index in soundsKeys) {
  const key = soundsKeys[index];
  const sound = config.sounds[key].paths;
  for (const fileName of sound) {
    audioBuffers[fileName] = readFileSync(path.join(__dirname, "..", "..", "sounds", fileName));
  }
}

function getGuildQueue(guildId: string): GuildQueueItem[] {
  return guildQueues.get(guildId) || [];
}

export function getFileNameForSound(soundName: string): string | undefined {
  let fileNames;
  // Return a random sound for no sound name or "random" sound name
  if (soundName == null || soundName == "random") {
    fileNames = Object.keys(audioBuffers);
  } else if (config.sounds[soundName]) {
    fileNames = config.sounds[soundName].paths;
  }
  if (fileNames == null || fileNames.length === 0) {
    return undefined;
  }
  return fileNames[Math.floor(Math.random() * fileNames.length)];
}

export async function enqueueSound(voiceChannel: VoiceChannel, soundFileName: string): Promise<void> {
  // Make sure the server queue exists
  if (!guildQueues.has(voiceChannel.guild.id)) {
    guildQueues.set(voiceChannel.guild.id, []);
  }
  const guildQueue = getGuildQueue(voiceChannel.guild.id);
  // Add the sound to the queue if the queue is less than the max
  if (guildQueue.length < config.settings.maxQueueSize) {
    guildQueue.push({
      voiceChannel,
      soundFileName
    });
  }
  if (guildQueue.length === 1) {
    playSound(voiceChannel.guild.id);
  }
}

async function playSound(guildId: string): Promise<void> {
  let voiceChannel: VoiceChannel | undefined;
  try {
    // Loop through the queue
    let connection;
    const guildQueue = getGuildQueue(guildId);
    while (guildQueue.length > 0) {
      const itemFromQueue = guildQueue[0];
      if (!connection || connection.channel.id !== itemFromQueue.voiceChannel.id) {
        voiceChannel = itemFromQueue.voiceChannel;
        connection = await voiceChannel.join();
      }
      // Play the sound from the queue
      const dispatcher = connection.play(Readable.from(audioBuffers[itemFromQueue.soundFileName]), {
        type: "ogg/opus",
        volume: false
      });
      // Wait until the sound finishes
      await new Promise<void>(resolve => {
        dispatcher.on("finish", () => {
          resolve();
        });
      });
      guildQueue.shift();
    }
    // Remove the queue since we are done and leave the voice channel
    guildQueues.delete(guildId);
    if (voiceChannel) {
      voiceChannel.leave();
    }
  } catch (e) {
    console.error(e);
    guildQueues.delete(guildId);
    if (voiceChannel) {
      voiceChannel.leave();
    }
  }
}
