"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLanguageSelectionButtons = void 0;
const discord_js_1 = require("discord.js");
function createLanguageSelectionButtons() {
    return new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
        .setCustomId('select_english')
        .setLabel('English')
        .setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder()
        .setCustomId('select_spanish')
        .setLabel('Español')
        .setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder()
        .setCustomId('select_portuguese')
        .setLabel('Português')
        .setStyle(discord_js_1.ButtonStyle.Primary));
}
exports.createLanguageSelectionButtons = createLanguageSelectionButtons;
