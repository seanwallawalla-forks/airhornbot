const Redis = require('ioredis');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT, 10) || 6379;

const REDIS_PREFIX = 'airhornbot';
const REDIS_HORN_CHANNEL = `${REDIS_PREFIX}:horn`;
const REDIS_COUNT_HORN_KEY = `${REDIS_PREFIX}:horncount`;
const REDIS_COUNT_GUILDS_KEY = `${REDIS_PREFIX}:hornguilds`;
const REDIS_KEY_EXPIRY = 12 * 60 * 60;

const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
});
const subscriber = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
});
subscriber.subscribe(REDIS_HORN_CHANNEL);

function onUserJoin(userId, channelId) {
  console.log(`Recorded ${userId} -> ${channelId}`);
  redis.set(`${REDIS_PREFIX}:${userId}`, channelId, 'ex', REDIS_KEY_EXPIRY);
}

function onUserLeave(userId) {
  console.log(`Recorded ${userId} -> null`);
  redis.del(`${REDIS_PREFIX}:${userId}`);
}

async function publishHorn(userId, soundName) {
  const channelId = await getUserChannel(userId);
  if (channelId == null) {
    console.log('Discarded a horn');
    return null;
  }
  console.log('Publishing a horn event');
  redis.publish(REDIS_HORN_CHANNEL, `${channelId}:${soundName}`);
  const hornCount = await redis.incr(REDIS_COUNT_HORN_KEY);
  return {
    hornCount,
  };
}

function subscribeHorn(handlerFn) {
  subscriber.on('message', (channel, message) => {
    if (channel === REDIS_HORN_CHANNEL) {
      const [channelId, soundName] = message.split(':');
      handlerFn(channelId, soundName);
    }
  });
}

async function getUserChannel(userId) {
  return await redis.get(`${REDIS_PREFIX}:${userId}`);
}

async function getHornCount() {
  return (await parseInt(redis.get(REDIS_COUNT_HORN_KEY), 10)) || 0;
}

module.exports = {
  onUserJoin,
  onUserLeave,
  publishHorn,
  subscribeHorn,
  getUserChannel,
  getHornCount,
};
