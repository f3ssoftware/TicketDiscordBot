import {
    ChannelType, Client, CommandInteraction, SlashCommandBuilder, TextChannel,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';
import { createTicket } from '../firebase';
import { getTranslation } from '../translationHelper';

export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription(getTranslation('en', 'help_command_description'))
    .addStringOption(option => option
        .setName('description')
        .setDescription(getTranslation('en', 'help_command_problem_description'))
        .setRequired(true));

export async function execute(interaction: CommandInteraction, client: Client) {
    if (!interaction?.channelId) {
        return;
    }

    const userLanguagePreferences = new Map<string, string>();
    const userLanguage = userLanguagePreferences.get(interaction.user.id) || 'en';

    const description = interaction.options.get('description');


    const channel = await client.channels.fetch(interaction.channelId);
    if (!channel || channel.type != ChannelType.GuildText) {
        return;
    }

    const thread = await (channel as TextChannel).threads.create({
        name: `support-${Date.now()}`,
        reason: `Support ticket ${Date.now()}`,
        type: 12
    });

    const resolveButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId('resolve_ticket')
            .setLabel(getTranslation(userLanguage, 'resolve_ticket_label'))
            .setStyle(ButtonStyle.Success)
    );

    thread.send({
        content: `**User:** ${interaction.user}\n**Problem:** ${description}`,
        components: [resolveButton]
    });

    await createTicket(thread.id, description);

    await interaction.reply({
        content: getTranslation(userLanguage, 'help_is_on_the_way'),
        ephemeral: true,
    });
}
