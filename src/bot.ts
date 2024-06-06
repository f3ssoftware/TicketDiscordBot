import { ButtonInteraction, Client, GatewayIntentBits, TextChannel } from 'discord.js';
import config from './config';
import * as commandModules from './commands';
import { createLanguageSelectionButtons } from './buttonHelper';
import { getTranslation } from './translationHelper';
import axios from 'axios';

const commands = Object(commandModules);

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages
    ]
});

const userLanguagePreferences = new Map<any, any>();

client.once('ready', async () => {
    console.log('Discord bot ready!');
    
    const channelId = '1245156290997522503';
    const channel = await client.channels.fetch(channelId) as TextChannel;
    
    if (channel) {
        channel.send({
            content: getTranslation('en', 'select_language_prompt'),
            components: [createLanguageSelectionButtons()]
        });
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const { commandName } = interaction;
        if (commands[commandName]) {
            await commands[commandName].execute(interaction, client);
        }
    } else if (interaction.isButton()) {
        const userId = interaction.user.id;
        
        if (interaction.customId.startsWith('select_language_')) {
            const selectedLanguage = interaction.customId.split('_').pop();
            userLanguagePreferences.set(userId, selectedLanguage);
            
            await interaction.reply({
                content: getTranslation(selectedLanguage, 'language_set'),
                ephemeral: true,
            });
        } else if (interaction.customId === 'resolve_ticket') {
            const { channelId } = interaction;
            
            try {
                await interaction.reply({
                    content: getTranslation(userLanguagePreferences.get(interaction.user.id) || 'en', 'help_is_on_the_way'),
                    ephemeral: true
                });

                await axios.post('https://ticketdiscordbot.onrender.com/resolve', { threadId: channelId });

            } catch (error) {
                console.log(error);

                await interaction.reply({
                    content: getTranslation(userLanguagePreferences.get(interaction.user.id) || 'en', 'an_error_occurred'),
                    ephemeral: true,
                });
            }
        }
    }
});

client.login(config.DISCORD_TOKEN);

