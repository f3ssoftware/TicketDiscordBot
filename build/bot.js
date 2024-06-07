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
exports.translations = exports.client = void 0;
const discord_js_1 = require("discord.js");
const config_1 = __importDefault(require("./config"));
const commandModules = __importStar(require("./commands"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const buttonHelper_1 = require("./buttonHelper");
const commands = Object(commandModules);
exports.client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.DirectMessages
    ]
});
let selectedLanguage = 'en'; // Default language
exports.translations = {
    en: JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'locales/en.json'), 'utf-8')),
    es: JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'locales/es.json'), 'utf-8')),
    pt: JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'locales/pt.json'), 'utf-8')),
};
exports.client.once('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Discord bot ready!');
    const channelId = '1245156290997522503';
    const channel = yield exports.client.channels.fetch(channelId);
    if (channel) {
        channel.send({
            content: "Select your language",
            components: [(0, buttonHelper_1.createLanguageSelectionButtons)()]
        });
    }
}));
exports.client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (interaction.isCommand()) {
        const { commandName } = interaction;
        commands[commandName].execute(interaction, exports.client, selectedLanguage);
    }
    else if (interaction.isButton()) {
        if (interaction.customId === 'select_english') {
            selectedLanguage = 'en';
            yield interaction.reply({ content: 'Language set to English', ephemeral: true });
        }
        else if (interaction.customId === 'select_spanish') {
            selectedLanguage = 'es';
            yield interaction.reply({ content: 'Idioma configurado para Español', ephemeral: true });
        }
        else if (interaction.customId === 'select_portuguese') {
            selectedLanguage = 'pt';
            yield interaction.reply({ content: 'Idioma configurado para Português', ephemeral: true });
        }
        else if (interaction.customId === 'resolve_ticket') {
            const { channelId } = interaction;
            try {
                // Confirm the interaction was successful
                yield interaction.reply({
                    content: exports.translations[selectedLanguage]['ticket_marked_resolved'],
                    ephemeral: true
                });
                yield axios_1.default.post('https://ticketdiscordbot.onrender.com/resolve', { threadId: channelId });
            }
            catch (error) {
                console.log(error);
                // Reply to the interaction indicating an error
                yield interaction.reply({
                    content: exports.translations[selectedLanguage]['ticket_status_updated'],
                    ephemeral: true,
                });
            }
        }
    }
}));
exports.client.login(config_1.default.DISCORD_TOKEN);
