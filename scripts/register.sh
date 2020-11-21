#!/bin/bash -e

API_ENDPOINT_DEFAULT='https://discord.com/api/v8'
API_ENDPOINT=${API_ENDPOINT:=$API_ENDPOINT_DEFAULT}

curl "${API_ENDPOINT}/applications/${CLIENT_ID}/guilds/${GUILD_ID}/commands" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bot ${BOT_TOKEN}" \
  -d '{
        "name": "airhorn",
        "description": "Blow an airhorn in your current voice channel",
        "options": [
          {
            "name": "sound",
            "description": "Spice it up",
            "required": false,
            "type": 3,
            "choices": [
              {
                  "name": "classic",
                  "value": "classic"
              },
              {
                  "name": "more horn",
                  "value": "more horn"
              },
              {
                  "name": "vuvuzela",
                  "value": "vuvuzela"
              },
              {
                  "name": "didgeridoo",
                  "value": "didgeridoo"
              },
              {
                  "name": "aoe",
                  "value": "aoe"
              },
              {
                  "name": "wow",
                  "value": "wow"
              }
            ]
          }
        ]
    }'
