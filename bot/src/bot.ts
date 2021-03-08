import {Client} from "discord.js-light";
import {config} from "./utils/Configuration";
import {DiscordListener} from "./discord/DiscordListener";
import {ReadyListener} from "./discord/listeners/ReadyListener";
import {InteractionCreateListener} from "./discord/listeners/InteractionCreateListener";
import {DiscordCommand} from "./discord/DiscordCommand";
import {AirhornCommand} from "./discord/commands/AirhornCommand";
import {AirhornMetaCommand} from "./discord/commands/AirhornMetaCommand";

export class AirhornBot {

  public readonly client: Client;
  public readonly commands: Map<string, DiscordCommand>;

  constructor() {
    this.client = new Client({
      ws: {
        intents: ["GUILDS", "GUILD_VOICE_STATES"]
      },
      shards: "auto",
      presence: {
        status: "online",
        activity: {
          type: "PLAYING",
          name: "airhorn.solutions"
        }
      }
    });
    this.commands = new Map<string, DiscordCommand>();
    // Register the listeners
    this.registerListener(new InteractionCreateListener());
    this.registerListener(new ReadyListener());
    // Register the commands
    this.registerCommand(new AirhornCommand());
    this.registerCommand(new AirhornMetaCommand());
  }

  async start(): Promise<void> {
    await this.client.login(config.discord.token);
  }

  registerListener(discordListener: DiscordListener): void {
    discordListener.registerListener(this);
  }

  registerCommand(discordCommand: DiscordCommand): void {
    this.commands.set(discordCommand.name, discordCommand);
  }
}

(async () => {
  const airhornBot = new AirhornBot();
  try {
    await airhornBot.start();
  } catch (e) {
    console.error(e);
  }
})();
