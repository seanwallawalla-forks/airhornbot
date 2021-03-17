import fetch from "node-fetch";
import {config} from "./utils/Configuration";

const specifiedCommandArgs = process.argv.slice(2);

const mode = specifiedCommandArgs[0] || "set";
const guildId = specifiedCommandArgs[1] || undefined;

(async () => {
  if (!["set", "clear"].includes(mode.toLowerCase())) {
    return console.log("The mode specified must be one of 'set' or 'clear'");
  }
  if (guildId && !String(guildId).match(/^\d+$/g)) {
    return console.log("The guild id must be valid.");
  }

  const guildUrlPart = guildId ? "/guilds/" + String(guildId) : "";

  // Clear all of the commands if the mode is clear and then exit
  if (mode.toLowerCase() === "clear") {
    const response = await fetch("https://discord.com/api/v8/applications/" + config.discord.applicationId + guildUrlPart + "/commands", {
      method: "put",
      headers: {
        "authorization": "Bot " + config.discord.token,
        "content-type": "application/json"
      },
      body: JSON.stringify([])
    });
    return console.log(await response.json());
  }

  const soundChoices = Object.entries(config.sounds).map((sound) => {
    return {
      name: sound[1].name,
      value: sound[0]
    };
  });
  // Add the random choice (this shouldn't be added in the config)
  soundChoices.push({
    name: "Random",
    value: "random"
  });

  const response = await fetch("https://discord.com/api/v8/applications/" + config.discord.applicationId + guildUrlPart + "/commands", {
    method: "put",
    headers: {
      "authorization": "Bot " + config.discord.token,
      "content-type": "application/json"
    },
    body: JSON.stringify([
      // airhorn command
      {
        "name": "airhorn",
        "description": "Blow an airhorn in your current voice channel.",
        "type": 1,
        "options": [
          {
            "name": "sound",
            "description": "Spice it up with some different sounds!",
            "required": false,
            "type": 3,
            "choices": soundChoices
          }
        ]
      },
      // airhornmeta command
      {
        "name": "airhornmeta",
        "description": "Useful airhorn-related commands.",
        "type": 1,
        "options": [
          {
            "name": "stats",
            "description": "See the numbers!",
            "type": 1,
            "options": []
          },
          {
            "name": "invite",
            "description": "Instructions for inviting the bot.",
            "type": 1,
            "options": []
          }
        ]
      }
    ])
  });

  console.log(await response.json());
})();
