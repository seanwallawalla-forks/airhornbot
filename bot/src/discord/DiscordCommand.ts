import fetch, {Response} from "node-fetch";
import {Client} from "discord.js-light";

export type InteractionCommandOption = {
  name: string;
  value: string | number;
};

export interface Interaction {
  type: number;
  id: string;
  token: string;
  data: {
    name: string;
    options?: InteractionCommandOption[];
  };
  guild_id?: string;
  member?: {
    user: {
      id: string;
    };
  };
  user?: {
    id: string;
  };
}

export enum InteractionResponseType {
  CHANNEL_MESSAGE_WITH_SOURCE = 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5
}

export type InteractionResponseData = {
  type: InteractionResponseType;
  data?: {
    content: string;
    flags?: number
  };
};

export abstract class DiscordCommand {

  public readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract executeInteraction(client: Client, interaction: Interaction, discordCommandResponder: DiscordCommandResponder): Promise<void>;

}

export class DiscordCommandResponder {

  public readonly interactionId: string;
  public readonly interactionToken: string;

  constructor(interactionId: string, interactionToken: string) {
    this.interactionId = interactionId;
    this.interactionToken = interactionToken;
  }

  async sendBackMessage(text: string, showForAll: boolean): Promise<void> {
    await DiscordCommandResponder.sendInteractionCallback(this.interactionId, this.interactionToken, {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: text,
        flags: showForAll ? undefined : 1 << 6
      }
    });
  }

  static async sendInteractionCallback(interactionId: string, interactionToken: string, data: InteractionResponseData): Promise<Response> {
    return fetch("https://discord.com/api/v8/interactions/" + interactionId + "/" + interactionToken + "/callback", {
      method: "post",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    });
  }
}
