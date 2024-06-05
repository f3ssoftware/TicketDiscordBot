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
      const { channelId } = interaction;

        try {
            await axios.post('https://ticketdiscordbot.onrender.com/resolve', { threadId: channelId });
        } catch (error) {
          console.log(channelId)
            await interaction.reply({
                content: 'An error occurred while updating the ticket status.',
                ephemeral: true,
            });
        }
    }
})

  client.login(config.DISCORD_TOKEN)
