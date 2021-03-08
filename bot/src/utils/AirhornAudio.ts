import {readFileSync} from "fs";
import path from "path";
import {Readable} from "stream";
import {VoiceChannel} from "discord.js";
import {config} from "./Configuration";

const audioBuffers: {
  [key: string]: Buffer
} = {};

const soundsKeys = Object.keys(config.sounds);
for (const index in soundsKeys) {
  const key = soundsKeys[index];
  const sound = config.sounds[key].paths;
  for (const fileName of sound) {
    audioBuffers[fileName] = readFileSync(path.join(__dirname, "..", "..", "sounds", fileName));
  }
}

export function getStreamForSound(soundName: string): Readable | undefined {
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
  const randomFileName = fileNames[Math.floor(Math.random() * fileNames.length)];
  return Readable.from(audioBuffers[randomFileName]);
}

export async function playSound(voiceChannel: VoiceChannel, sound: Readable): Promise<void> {
  try {
    const connection = await voiceChannel.join();
    const dispatcher = connection.play(sound, {
      type: "ogg/opus",
      volume: false
    });
    dispatcher.on("finish", () => {
      voiceChannel.leave();
    });
  } catch (e) {
    console.error(e);
    voiceChannel.leave();
  }
}
