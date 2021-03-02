const fs = require('fs');
const path = require('path');

const { Readable } = require('stream');

const AUDIO_FILES = {
  classic: ['airhorn_default.ogg'],
  'more horn': [
    'airhorn_clownshort.ogg',
    'airhorn_clownspam.ogg',
    'airhorn_distant.ogg',
    'airhorn_echo.ogg',
    'airhorn_fourtap.ogg',
    'airhorn_highfartlong.ogg',
    'airhorn_highfartshort.ogg',
    'airhorn_midshort.ogg',
    'airhorn_reverb.ogg',
    'airhorn_spam.ogg',
    'airhorn_tripletap.ogg',
    'airhorn_truck.ogg',
  ],
  aoe: ['aoe.ogg'],
  wow: ['owen_wilson.opus'],
  vuvuzela: ['vuvuzela.ogg'],
  didgeridoo: ['didgeridoo.ogg'],
  'human man': ['human_man.ogg'],
  'robot man': ['robot_man.ogg'],
  stan: ['cow_herd.ogg', 'cow_moo.ogg', 'cow_x3.ogg'],
  jc: ['jc_airhorn.ogg', 'jc_echo.ogg', 'jc_full.ogg', 'jc_jc.ogg', 'jc_nameis.ogg', 'jc_spam.ogg'],
  anotha: ['another_one.ogg', 'another_one_classic.ogg', 'another_one_echo.ogg'],
  ostrich: ['ostrich.opus'],
  gavel: ['gavel.opus'],
};
const AUDIO_BUFFERS = {};

for (const soundName of Object.keys(AUDIO_FILES)) {
  const fileNames = AUDIO_FILES[soundName];
  for (const fileName of fileNames) {
    AUDIO_BUFFERS[fileName] = fs.readFileSync(path.join(__dirname, '..', 'audio', fileName));
  }
}

function getStreamForSound(soundName) {
  let fileNames;

  // return a random sound for no sound name
  if (soundName == null || soundName == 'random') {
    fileNames = Object.keys(AUDIO_BUFFERS);
  } else if (AUDIO_FILES.hasOwnProperty(soundName)) {
    fileNames = AUDIO_FILES[soundName];
  }

  if (fileNames == null || fileNames.length === 0) {
    return null;
  }

  return Readable.from(AUDIO_BUFFERS[fileNames[Math.floor(fileNames.length * Math.random())]]);
}

module.exports = {
  getStreamForSound,
};
