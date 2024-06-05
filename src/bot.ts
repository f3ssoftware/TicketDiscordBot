import { Client, GatewayIntentBits, Interaction, InteractionType } from 'discord.js';
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

client.on('interactionCreate', async (interaction: Interaction) => {
  if (interaction.type === InteractionType.ApplicationCommand) {
    const { commandName } = interaction;
    if (commands[commandName]) {
      commands[commandName].execute(interaction, client);
    }
  } else if (interaction.type === InteractionType.MessageComponent) {
    if (interaction.customId === 'resolve_ticket') {
      const { channelId } = interaction;

      try {
        await axios.post('https://ticketdiscordbot.onrender.com/resolve', { threadId: channelId });
        await interaction.reply({
          content: 'The ticket has been marked as resolved and the thread is now archived.',
          ephemeral: true,
        });
      } catch (error) {
        console.log(error);
        await interaction.reply({
          content: 'An error occurred while updating the ticket status.',
          ephemeral: true,
        });
      }
    }
  }
});

client.login(config.DISCORD_TOKEN)
