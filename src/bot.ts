import { ButtonInteraction, Client, GatewayIntentBits, Interaction, InteractionType, TextChannel } from 'discord.js';
import config from "./config";
import * as commandModules from "./commands"
import axios from "axios";
import fs from 'fs';
import path from 'path';
import { createLanguageSelectionButtons } from './buttonHelper';

const commands = Object(commandModules);

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages
  ]
});

let selectedLanguage: string = 'en'; // Default language
const localesPath = path.join(__dirname, 'locales');
export const translations: { [key: string]: any } = {
  en: JSON.parse(fs.readFileSync(path.join(localesPath, 'en.json'), 'utf-8')),
  es: JSON.parse(fs.readFileSync(path.join(localesPath, 'es.json'), 'utf-8')),
  pt: JSON.parse(fs.readFileSync(path.join(localesPath, 'pt.json'), 'utf-8')),
};

client.once('ready', async () => {
  console.log('Discord bot ready!');
  
  const channelId = '1245156290997522503';
  const channel = await client.channels.fetch(channelId) as TextChannel;
  
  if (channel) {
      channel.send({
          content: "Select your language",
          components: [createLanguageSelectionButtons()]
      });
  }
});
client.on('interactionCreate', async interaction => {
  if (interaction.isCommand()) {
    const { commandName } = interaction;
    commands[commandName].execute(interaction, client, selectedLanguage);
  } else if (interaction.isButton()) {
    if (interaction.customId === 'select_english') {
      selectedLanguage = 'en';
      await interaction.reply({ content: 'Language set to English', ephemeral: true });
    } else if (interaction.customId === 'select_spanish') {
      selectedLanguage = 'es';
      await interaction.reply({ content: 'Idioma configurado para Español', ephemeral: true });
    } else if (interaction.customId === 'select_portuguese') {
      selectedLanguage = 'pt';
      await interaction.reply({ content: 'Idioma configurado para Português', ephemeral: true });
    } else if (interaction.customId === 'resolve_ticket') {
      const { channelId } = interaction;

      try {
        // Confirm the interaction was successful
        await interaction.reply({
          content: translations[selectedLanguage]['ticket_marked_resolved'],
          ephemeral: true
        });

        await axios.post('https://ticketdiscordbot.onrender.com/resolve', { threadId: channelId });
      } catch (error) {
        console.log(error);

        // Reply to the interaction indicating an error
        await interaction.reply({
          content: translations[selectedLanguage]['ticket_status_updated'],
          ephemeral: true,
        });
      }
    }
  }
});

client.login(config.DISCORD_TOKEN);


