const path = require('path');

const { ShardingManager } = require('discord.js');

const botPath = path.join(__dirname, './bot.js');
const manager = new ShardingManager(botPath, {
  token: process.env.BOT_TOKEN,
});

manager.on('shardCreate', (shard) => console.log(`Launched shard ${shard.id}`));

manager.spawn();
