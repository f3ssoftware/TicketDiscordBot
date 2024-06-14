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

export async function execute(interaction: CommandInteraction, client: Client, selectedLanguage: string) {
  const name = interaction.options.get('name')?.value as string;

  if (!name ) {
    return;
  }

  try {
    await axios.get(`http://localhost:3000/players/${name}`);

    await interaction.reply({
      content: "Success",
      ephemeral: true,
    });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: translations[selectedLanguage]['errorPlayer'],
      ephemeral: true,
    });
  }
}
