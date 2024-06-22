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
exports.handleModalSubmit = void 0;
function handleModalSubmit(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        if (interaction.customId === 'donationForm') {
            const name = interaction.fields.getTextInputValue('name');
            const email = interaction.fields.getTextInputValue('email');
            const phone = interaction.fields.getTextInputValue('phone');
            const cpf = interaction.fields.getTextInputValue('cpf');
            const birth = interaction.fields.getTextInputValue('birth');
            const country = interaction.fields.getTextInputValue('country');
            const cep = interaction.fields.getTextInputValue('cep');
            const city = interaction.fields.getTextInputValue('city');
            const neighborhood = interaction.fields.getTextInputValue('neighborhood');
            const street = interaction.fields.getTextInputValue('street');
            const number = interaction.fields.getTextInputValue('number');
            // Process the form data as needed
            console.log({
                name,
                email,
                phone,
                cpf,
                birth,
                country,
                cep,
                city,
                neighborhood,
                street,
                number,
            });
            yield interaction.reply({
                content: 'Form submitted successfully!',
                ephemeral: true,
            });
        }
    });
}
exports.handleModalSubmit = handleModalSubmit;
