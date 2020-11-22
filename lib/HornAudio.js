const path = require('path');

const AUDIO_FILES = {
  classic: 'airhorn_classic2.ogg',
  'more horn': 'airhorn_dj.ogg',
  aoe: 'aoe.ogg',
  wow: 'wow.ogg',
  vuvuzela: 'vuvuzela.ogg',
  didgeridoo: 'didgeridoo.ogg',
};

function getPathForSound(soundName) {
  const fileName = AUDIO_FILES[soundName];
  if (!fileName) {
    return null;
  }
  return path.join(__dirname, `../audio/${fileName}`);
}

module.exports = {
  getPathForSound,
};
