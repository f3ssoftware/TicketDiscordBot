"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.data = void 0;
const discord_js_1 = require("discord.js");
const firebase_1 = require("../firebase");
const translationHelper_1 = require("../translationHelper");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('help')
    .setDescription((0, translationHelper_1.getTranslation)('en', 'help_command_description'))
    .addStringOption(option => option
    .setName('description')
    .setDescription((0, translationHelper_1.getTranslation)('en', 'help_command_problem_description'))
    .setRequired(true));
function execute(interaction, client) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(interaction === null || interaction === void 0 ? void 0 : interaction.channelId)) {
            return;
        }
        const userLanguagePreferences = new Map();
        const userLanguage = userLanguagePreferences.get(interaction.user.id) || 'en';
        const description = interaction.options.get('description');
        const channel = yield client.channels.fetch(interaction.channelId);
        if (!channel || channel.type != discord_js_1.ChannelType.GuildText) {
            return;
        }
        const thread = yield channel.threads.create({
            name: `support-${Date.now()}`,
            reason: `Support ticket ${Date.now()}`,
            type: 12
        });
        const resolveButton = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId('resolve_ticket')
            .setLabel((0, translationHelper_1.getTranslation)(userLanguage, 'resolve_ticket_label'))
            .setStyle(discord_js_1.ButtonStyle.Success));
        thread.send({
            content: `**User:** ${interaction.user}\n**Problem:** ${description}`,
            components: [resolveButton]
        });
        yield (0, firebase_1.createTicket)(thread.id, description);
        yield interaction.reply({
            content: (0, translationHelper_1.getTranslation)(userLanguage, 'help_is_on_the_way'),
            ephemeral: true,
        });
    });
}
exports.execute = execute;
