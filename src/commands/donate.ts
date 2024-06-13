import { SlashCommandBuilder, CommandInteraction, Client } from 'discord.js';
import axios from 'axios';
import { translations } from "../bot";

export const data = new SlashCommandBuilder()
  .setName('donate')
  .setDescription('Donate coin')
  .addStringOption(option =>
    option.setName('name')
      .setDescription('Character Name')
      .setRequired(true))
  .addNumberOption(option =>
    option.setName('amount')
      .setDescription('Amount to donate')
      .setRequired(true));

export async function execute(interaction: CommandInteraction, client: Client, selectedLanguage: string) {
  const name = interaction.options.get('name')?.value as string;
  const amount = interaction.options.get('amount')?.value as number;

  if (!name || !amount) {
    return;
  }

  try {
    await axios.post('http://localhost:3000/players', { name, amount });

    await interaction.reply({
      content: "batendo aqui",
      ephemeral: true,
    });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: translations[selectedLanguage]['error'],
      ephemeral: true,
    });
  }
}
