import {DiscordListener} from "../DiscordListener";
import {AirhornBot} from "../../bot";

export class ReadyListener extends DiscordListener {

  registerListener(airhornBot: AirhornBot): void {
    airhornBot.client.on("ready", async () => {
      console.log("AIRHORN SOLUTIONS is ready.");
    });
    airhornBot.client.on("shardReady", async (shardId: number) => {
      console.log("Shard ID " + shardId + " is ready.");
    });
  }
}
