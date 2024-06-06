"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const discord_js_1 = require("discord.js");
const config_1 = __importDefault(require("./config"));
const commandModules = __importStar(require("./commands"));
const buttonHelper_1 = require("./buttonHelper");
const translationHelper_1 = require("./translationHelper");
const axios_1 = __importDefault(require("axios"));
const commands = Object(commandModules);
exports.client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.DirectMessages
    ]
});
const userLanguagePreferences = new Map();
exports.client.once('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Discord bot ready!');
    const channelId = '1245156290997522503';
    const channel = yield exports.client.channels.fetch(channelId);
    if (channel) {
        channel.send({
            content: (0, translationHelper_1.getTranslation)('en', 'select_language_prompt'),
            components: [(0, buttonHelper_1.createLanguageSelectionButtons)()]
        });
    }
}));
exports.client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (interaction.isCommand()) {
        const { commandName } = interaction;
        if (commands[commandName]) {
            yield commands[commandName].execute(interaction, exports.client);
        }
    }
    else if (interaction.isButton()) {
        const userId = interaction.user.id;
        if (interaction.customId.startsWith('select_language_')) {
            const selectedLanguage = interaction.customId.split('_').pop();
            userLanguagePreferences.set(userId, selectedLanguage);
            yield interaction.reply({
                content: (0, translationHelper_1.getTranslation)(selectedLanguage, 'language_set'),
                ephemeral: true,
            });
        }
        else if (interaction.customId === 'resolve_ticket') {
            const { channelId } = interaction;
            try {
                yield interaction.reply({
                    content: (0, translationHelper_1.getTranslation)(userLanguagePreferences.get(interaction.user.id) || 'en', 'help_is_on_the_way'),
                    ephemeral: true
                });
                yield axios_1.default.post('https://ticketdiscordbot.onrender.com/resolve', { threadId: channelId });
            }
            catch (error) {
                console.log(error);
                yield interaction.reply({
                    content: (0, translationHelper_1.getTranslation)(userLanguagePreferences.get(interaction.user.id) || 'en', 'an_error_occurred'),
                    ephemeral: true,
                });
            }
        }
    }
}));
exports.client.login(config_1.default.DISCORD_TOKEN);
