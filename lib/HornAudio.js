const fs = require('fs');
const path = require('path');

const { Readable } = require('stream');

const AUDIO_FILES = {
  classic: 'airhorn_classic2.ogg',
  'more horn': 'airhorn_dj.ogg',
  aoe: 'aoe.ogg',
  wow: 'wow.ogg',
  vuvuzela: 'vuvuzela.ogg',
  didgeridoo: 'didgeridoo.ogg',
};

const audioBuffers = {};

function setupAudio() {
  Object.keys(AUDIO_FILES).forEach((soundName) => {
    const fileName = AUDIO_FILES[soundName];
    const audioPath = path.join(__dirname, `../audio/${fileName}`);
    const audioBuf = fs.readFileSync(audioPath);
    audioBuffers[soundName] = audioBuf;
  });
}

setupAudio();

function getStreamForSound(soundName) {
  const buf = audioBuffers[soundName];
  return buf ? Readable.from(buf) : null;
}

module.exports = {
  getStreamForSound,
};
