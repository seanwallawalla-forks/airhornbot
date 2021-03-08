import {AirhornBot} from "../bot";

export abstract class DiscordListener {

  abstract registerListener(airhornBot: AirhornBot): void;
}
