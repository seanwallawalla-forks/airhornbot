const express = require('express');

const { publishHorn } = require('../lib/VoiceState');

const app = express();
const port = process.env.PORT || 4500;

const API_ENDPOINT = process.env.API_ENDPOINT || 'https://discord.com/api/v8';
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const InteractionResponseType = Object.freeze({
  PONG: 1,
  ACK: 2,
  CHANNEL_MESSAGE: 3,
  CHANNEL_MESSAGE_WITH_SOURCE: 4,
});

const InteractionType = Object.freeze({
  PING: 1,
  COMMAND: 2,
});

app.use(express.json());

app.get('/api/oauth_redirect', async (req, res) => {
  const qs = require('querystring');
  const axios = require('axios');

  const { code, error, error_description } = req.query;
  if (error) {
    res.status(500).send(`${error}: ${error_description}`);
    return;
  }

  const body = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: REDIRECT_URI,
    scope: 'bot applications.commands',
  };

  try {
    const url = `${API_ENDPOINT}/oauth2/token`;
    const resp = await axios.post(url, qs.stringify(body), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    res.send(resp.data);
  } catch (err) {
    console.error(`Oauth2 token exchange error: ${err}`);
    if (err.response) {
      console.error(`Error response data: ${err.response.status}`);
      console.error(`Error response data: ${JSON.stringify(err.response.headers, undefined, 2)}`);
      console.error(`Error response data: ${JSON.stringify(err.response.data, undefined, 2)}`);
    }
    res.status(500).send(`Error: ${err}`);
    return;
  }
});

app.post('/api/interactions', (req, res) => {
  const message = req.body;
  if (message && message.type === InteractionType.COMMAND) {
    handleCommand(message.member, message.data, res);
  } else {
    res.send({
      type: InteractionResponseType.PONG,
    });
  }
});

async function handleCommand(member, data, res) {
  switch (data.name) {
    case 'airhorn':
      let soundName = 'classic';
      if (data.options) {
        data.options.forEach((option) => {
          if (option.name === 'sound') {
            soundName = option.value;
          }
        });
      }
      const sentHorn = await publishHorn(member.user.id, soundName);
      if (sentHorn) {
        res.send({
          type: InteractionResponseType.ACK,
        });
      } else {
        res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE,
          data: {
            content: "Sorry, I couldn't find you in a voice channel :(",
            flags: 1 << 6,
          },
        });
      }
      break;
    default:
      res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE,
        data: {
          content: "Sorry, I don't understand this command :(",
        },
        flags: 1 << 6,
      });
      break;
  }
}

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
