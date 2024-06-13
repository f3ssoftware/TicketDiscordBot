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
const bot_1 = require("../bot");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("help")
    .setDescription("Creates a new help ticket.")
    .addStringOption(option => option.setName("description")
    .setDescription("describe your problem") // Use the default language for the description
    .setRequired(true));
function execute(interaction, client, selectedLanguage) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!(interaction === null || interaction === void 0 ? void 0 : interaction.channelId)) {
            return;
        }
        const channel = yield client.channels.fetch(interaction.channelId);
        if (!channel || channel.type != discord_js_1.ChannelType.GuildText) {
            return;
        }
        const thread = yield channel.threads.create({
            name: `${bot_1.translations[selectedLanguage]['support_ticket']}-${Date.now()}`,
            reason: `${bot_1.translations[selectedLanguage]['support_ticket']} ${Date.now()}`,
            type: 12
        });
        const problemDescription = ((_a = interaction.options.get('description')) === null || _a === void 0 ? void 0 : _a.value) || '';
        const { user } = interaction;
        console.log(`Selected Language: ${selectedLanguage}`);
        console.log(`Translation for 'resolve_ticket': ${bot_1.translations[selectedLanguage]['resolve_ticket']}`);
        const resolveButton = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId('resolve_ticket')
            .setLabel(bot_1.translations[selectedLanguage]['resolve_ticket'])
            .setStyle(discord_js_1.ButtonStyle.Success));
        thread.send({
            content: `**${bot_1.translations[selectedLanguage]['user']}:** ${user}\n**${bot_1.translations[selectedLanguage]['problem']}:** ${problemDescription}`,
            components: [resolveButton]
        });
        // Create the ticket and store it in Firestore
        yield (0, firebase_1.createTicket)(thread.id, problemDescription);
        return interaction.reply({
            content: bot_1.translations[selectedLanguage]['help_message'],
            ephemeral: true,
        });
    });
}
exports.execute = execute;
