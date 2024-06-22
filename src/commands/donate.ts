import { SlashCommandBuilder, CommandInteraction, Client, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } from 'discord.js';
import axios from 'axios';
import { translations } from "../bot";

export const data = new SlashCommandBuilder()
  .setName('donate')
  .setDescription('Donate coin')
  .addStringOption(option =>
    option.setName('Nome')
      .setDescription('Character Name')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('Valor')
      .setDescription('Amount')
      .setRequired(true))

export async function execute(interaction: CommandInteraction, client: Client, selectedLanguage: string) {
  const name = interaction.options.get('name')?.value as string;
  const amount = interaction.options.get('valor')?.value as number;

  if (!name) {
    return;
  }

  try {
    await axios.get(`http://localhost:3000/players/${name}`);

    const modal = new ModalBuilder({ customId: "donate-form-modal", title: `Você irá receber ${amount * 8} coins` });

    const name1 = new ActionRowBuilder<TextInputBuilder>({
      components: [
        new TextInputBuilder({
          customId: "donate-name-input",
          label: "Nome completo",
          placeholder: "Digite seu nome",
          style: TextInputStyle.Short
        })
      ]
    });
    const email = new ActionRowBuilder<TextInputBuilder>({
      components: [
        new TextInputBuilder({
          customId: "donate-email-input",
          label: "Email",
          placeholder: "Digite seu email",
          style: TextInputStyle.Short
        })
      ]
    });
    const phone = new ActionRowBuilder<TextInputBuilder>({
      components: [
        new TextInputBuilder({
          customId: "donate-phone-input",
          label: "Telefone",
          placeholder: "Telefone",
          style: TextInputStyle.Short
        })
      ]
    });
    const cpf = new ActionRowBuilder<TextInputBuilder>({
      components: [
        new TextInputBuilder({
          customId: "donate-cpf-input",
          label: "CPF",
          placeholder: "Digite seu CPF",
          style: TextInputStyle.Short
        })
      ]
    });
    const birth = new ActionRowBuilder<TextInputBuilder>({
      components: [
        new TextInputBuilder({
          customId: "donate-birth-input",
          label: "Nascimento",
          placeholder: "Digite sua data de nascimento",
          style: TextInputStyle.Short
        })
      ]
    });
    const country = new ActionRowBuilder<TextInputBuilder>({
      components: [
        new TextInputBuilder({
          customId: "donate-country-input",
          label: "País",
          placeholder: "Digite seu CPF",
          style: TextInputStyle.Short
        })
      ]
    });
    const cep = new ActionRowBuilder<TextInputBuilder>({
      components: [
        new TextInputBuilder({
          customId: "donate-cep-input",
          label: "CEP",
          placeholder: "Digite seu CEP",
          style: TextInputStyle.Short
        })
      ]
    });
    const county = new ActionRowBuilder<TextInputBuilder>({
      components: [
        new TextInputBuilder({
          customId: "donate-county-input",
          label: "Município",
          placeholder: "Digite seu município",
          style: TextInputStyle.Short
        })
      ]
    });
    const neighborhood = new ActionRowBuilder<TextInputBuilder>({
      components: [
        new TextInputBuilder({
          customId: "donate-neighborhood-input",
          label: "Bairro",
          placeholder: "Digite seu bairro",
          style: TextInputStyle.Short
        })
      ]
    });
    const publicPlace = new ActionRowBuilder<TextInputBuilder>({
      components: [
        new TextInputBuilder({
          customId: "donate-publicPlace-input",
          label: "Logradouro",
          placeholder: "Digite seu logradouro",
          style: TextInputStyle.Short
        })
      ]
    });
    const number = new ActionRowBuilder<TextInputBuilder>({
      components: [
        new TextInputBuilder({
          customId: "donate-number-input",
          label: "Número",
          placeholder: "Digite seu numero",
          style: TextInputStyle.Short
        })
      ]
    });
    const gender = new ActionRowBuilder<TextInputBuilder>({
      components: [
        new TextInputBuilder({
          customId: "donate-gender-input",
          label: "Sexo",
          placeholder: "Digite seu sexo",
          style: TextInputStyle.Short
        })
      ]
    });

    modal.setComponents(name1, email, phone, cpf, birth, country, cep, county, neighborhood, publicPlace, number, gender);
    interaction.showModal(modal)
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: translations[selectedLanguage]['errorPlayer'],
      ephemeral: true,
    });
  }
}
