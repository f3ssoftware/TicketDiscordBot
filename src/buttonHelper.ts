import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export function createLanguageSelectionButtons() {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId('select_language_en')
            .setLabel('English')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('select_language_es')
            .setLabel('Español')
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId('select_language_pt')
            .setLabel('Português')
            .setStyle(ButtonStyle.Primary),

    );
}
