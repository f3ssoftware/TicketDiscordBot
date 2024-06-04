import { Client, GatewayIntentBits } from "discord.js";
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

  client.once("ready", () =>{
    console.log("Discord bot ready!")
  });

  client.on('interactionCreate', async interaction =>{
    if(!interaction.isCommand()){
        return
    }
    const {commandName} = interaction;
    commands[commandName].execute(interaction, client)
  })

  client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'resolve_ticket') {
        const threadId = interaction.channelId;

        try {
            await axios.post('http://localhost:3000/resolve', { threadId });
        } catch (error) {
            await interaction.reply({
                content: 'An error occurred while updating the ticket status.',
                ephemeral: true,
            });
        }
    }
})

  client.login(config.DISCORD_TOKEN)
