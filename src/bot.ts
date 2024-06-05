import { ButtonInteraction, Client, GatewayIntentBits, Interaction, InteractionType } from 'discord.js';
import config from "./config";
import * as commandModules from "./commands"
import axios from "axios";

const commands = Object(commandModules)

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages
  ]
});

client.once("ready", () => {
  console.log("Discord bot ready!")
});

client.on('interactionCreate', async interaction => {
  if (interaction.isCommand()) {
    const { commandName } = interaction;
    commands[commandName].execute(interaction, client);
  } else if (interaction.isButton()) {
    if (interaction.customId === 'resolve_ticket') {
      const { channelId } = interaction;

      try {

        // Confirm the interaction was successful
        await (interaction as ButtonInteraction).reply({
          content: 'The ticket has been marked as resolved and the thread is archived.',
          ephemeral: true
        });

        await axios.post('https://ticketdiscordbot.onrender.com/resolve', { threadId: channelId });

      } catch (error) {
        console.log(error);

        // Reply to the interaction indicating an error
        await (interaction as ButtonInteraction).reply({
          content: 'An error occurred while updating the ticket status.',
          ephemeral: true,
        });
      }
    }
  }
});

client.login(config.DISCORD_TOKEN)
