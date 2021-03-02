const axios = require('axios');
const ed = require('noble-ed25519');
const express = require('express');
const qs = require('querystring');

const { publishHorn, getHornCount } = require('../lib/VoiceState');

const PORT = process.env.PORT || 4500;

const app = express();

const API_ENDPOINT = process.env.API_ENDPOINT || 'https://discord.com/api/v8';
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_PUBLIC_KEY = process.env.CLIENT_PUBLIC_KEY;
const REDIRECT_URI = process.env.REDIRECT_URI;

const InteractionResponseType = Object.freeze({
  PONG: 1,
  CHANNEL_MESSAGE_WITH_SOURCE: 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
});

const InteractionType = Object.freeze({
  PING: 1,
  COMMAND: 2,
});

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
);

async function verifyKey(req) {
  const timestamp = req.get('X-Signature-Timestamp');
  const signature = req.get('X-Signature-Ed25519');
  return await ed.verify(
    signature,
    Buffer.concat([Buffer.from(timestamp, 'utf-8'), req.rawBody]),
    CLIENT_PUBLIC_KEY,
  );
}

app.get('/api/oauth_redirect', async (req, res) => {
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

app.post('/api/interactions', async (req, res) => {
  if (!(await verifyKey(req))) {
    res.status(403).end('Invalid signature');
    return;
  }

  const message = req.body;
  if (message && message.type === InteractionType.COMMAND) {
    const isDM = !message.member;
    handleCommand(message.user || message.member.user, message.data, isDM, res);
  } else {
    res.send({
      type: InteractionResponseType.PONG,
    });
  }
});

async function handleCommand(user, data, isDM, res) {
  switch (data.name) {
    case 'airhorn':
      if (isDM) {
        res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "You can't trigger airhorns from DM.",
          },
        });
      } else {
        handleSound(user, data, res);
      }
      break;
    case 'airhornmeta':
      // There should only ever be one subcommand.
      const subcommand = data.options[0];
      switch (subcommand.name) {
        case 'stats':
          handleStats(res);
          break;
        case 'invite':
          handleInvite(res);
          break;
      }
      break;
    default:
      res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "Sorry, I don't understand this command :(",
          flags: 1 << 6,
        },
      });
      break;
  }
}

async function handleSound(user, data, res) {
  let soundName = 'classic';
  if (data.options) {
    data.options.forEach((option) => {
      if (option.name === 'sound') {
        soundName = option.value;
      }
    });
  }
  const result = await publishHorn(user.id, soundName);
  if (result == null) {
    res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "Sorry, I couldn't find you in a voice channel :(",
        flags: 1 << 6,
      },
    });
  } else {
    res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'Sending sound.',
        flags: 1 << 6,
      },
    });
  }
}

async function handleStats(res) {
  const hornCount = await getHornCount();
  res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `${hornCount.toLocaleString()} airhorns have been used.`,
      flags: 1 << 6,
    },
  });
}

async function handleInvite(res) {
  res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content:
        'Add me: https://discord.com/api/oauth2/authorize?client_id=159799960412356608&permissions=3146752&scope=applications.commands%20bot',
      flags: 1 << 6,
    },
  });
}

app.get('/api/hornCount', async (req, res) => {
  res.send({
    hornCount: await getHornCount(),
  });
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
