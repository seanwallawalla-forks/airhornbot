import fetch from "node-fetch";
import {config} from "./utils/Configuration";

(async () => {
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

  const response = await fetch("https://discord.com/api/v8/applications/" + config.discord.applicationId + "/commands", {
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
