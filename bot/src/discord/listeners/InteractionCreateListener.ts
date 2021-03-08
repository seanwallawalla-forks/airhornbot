import {DiscordListener} from "../DiscordListener";
import {Interaction, DiscordCommand, DiscordCommandResponder} from "../DiscordCommand";
import {AirhornBot} from "../../bot";

export class InteractionCreateListener extends DiscordListener {

  registerListener(airhornBot: AirhornBot): void {
    airhornBot.client.ws.on("INTERACTION_CREATE" as never, async (interaction: Interaction) => {
      try {
        const commandName = interaction.data.name.toLowerCase();
        // Check to make sure the command exists
        if (!airhornBot.commands.has(commandName)) {
          return new DiscordCommandResponder(interaction.id, interaction.token).sendBackMessage("The command requested was not understood.", false);
        }
        // Execute the command
        await (airhornBot.commands.get(commandName) as DiscordCommand).executeInteraction(airhornBot.client, interaction, new DiscordCommandResponder(interaction.id, interaction.token));
      } catch (e) {
        console.error(e);
        return new DiscordCommandResponder(interaction.id, interaction.token).sendBackMessage("The bot encountered an error when running the command.", false);
      }
    });
  }
}
