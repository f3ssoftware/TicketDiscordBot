import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export function createLanguageSelectionButtons() {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId('select_english')
            .setLabel('English')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('select_spanish')
            .setLabel('Español')
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId('select_portuguese')
            .setLabel('Português')
            .setStyle(ButtonStyle.Primary),

    );
}
