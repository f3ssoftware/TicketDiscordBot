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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.data = void 0;
const discord_js_1 = require("discord.js");
const axios_1 = __importDefault(require("axios"));
const bot_1 = require("../bot");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('donate')
    .setDescription('Donate coin')
    .addStringOption(option => option.setName('name')
    .setDescription('Character Name')
    .setRequired(true));
function execute(interaction, client, selectedLanguage) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const name = (_a = interaction.options.get('name')) === null || _a === void 0 ? void 0 : _a.value;
        if (!name) {
            return;
        }
        try {
            yield axios_1.default.get(`http://localhost:3000/players/${name}`);
            const modal = new discord_js_1.ModalBuilder({ customId: "donate-form-modal", title: "Formulário para donate" });
            const name1 = new discord_js_1.ActionRowBuilder({ components: [
                    new discord_js_1.TextInputBuilder({
                        customId: "donate-name-input",
                        label: "Nome",
                        placeholder: "Digite seu nome",
                        style: discord_js_1.TextInputStyle.Short
                    })
                ] });
            modal.setComponents(name1);
            interaction.showModal(modal);
        }
        catch (error) {
            const modal = new discord_js_1.ModalBuilder({ customId: "donate-form-modal", title: "Formulário para donate" });
            const name1 = new discord_js_1.ActionRowBuilder({ components: [
                    new discord_js_1.TextInputBuilder({
                        customId: "donate-name-input",
                        label: "Nome",
                        placeholder: "Digite seu nome",
                        style: discord_js_1.TextInputStyle.Short
                    })
                ] });
            modal.setComponents(name1);
            interaction.showModal(modal);
            console.error(error);
            yield interaction.reply({
                content: bot_1.translations[selectedLanguage]['errorPlayer'],
                ephemeral: true,
            });
        }
    });
}
exports.execute = execute;
