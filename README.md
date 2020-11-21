# airhornbot-node

A node implementation of Airhorn Bot.

# Setup

```
yarn install
```

# Web server

Handles Oauth and hosts the interaction endpoint for slash commands.

Example run command:
```
CLIENT_ID=7787106001233451 CLIENT_SECRET='abc_123-456' REDIRECT_URI='https://airhornbot.gov/api/oauth_redirect' node server.js
```

# Bot server

Handles gateway events and records voice presence.

Example run command:
```
BOT_TOKEN=foo node bot.js
```
