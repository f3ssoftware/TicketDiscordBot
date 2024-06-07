import {
    ChannelType, Client, CommandInteraction, SlashCommandBuilder, TextChannel,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from "discord.js";
import { createTicket } from "../firebase";
import { translations } from "../bot";

export const data = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Creates a new help ticket.")
    .addStringOption(option => 
        option.setName("description")
            .setDescription("describe your problem") // Use the default language for the description
            .setRequired(true)
    );

export async function execute(interaction: CommandInteraction, client: Client, selectedLanguage: string) {
    if (!interaction?.channelId) {
        return;
    }

    const channel = await client.channels.fetch(interaction.channelId);
    if (!channel || channel.type != ChannelType.GuildText) {
        return;
    }

    const thread = await (channel as TextChannel).threads.create({
        name: `${translations[selectedLanguage]['support_ticket']}-${Date.now()}`,
        reason: `${translations[selectedLanguage]['support_ticket']} ${Date.now()}`,
        type: 12
    });

    const problemDescription = (interaction.options.get('description')?.value as string) || '';
    const { user } = interaction;

    console.log(`Selected Language: ${selectedLanguage}`);
    console.log(`Translation for 'resolve_ticket': ${translations[selectedLanguage]['resolve_ticket']}`);

    const resolveButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId('resolve_ticket')
            .setLabel(translations[selectedLanguage]['resolve_ticket'])
            .setStyle(ButtonStyle.Success)
    );

    thread.send({
        content: `**${translations[selectedLanguage]['user']}:** ${user}\n**${translations[selectedLanguage]['problem']}:** ${problemDescription}`,
        components: [resolveButton]
    });

    // Create the ticket and store it in Firestore
    await createTicket(thread.id, problemDescription);

    return interaction.reply({
        content: translations[selectedLanguage]['help_message'],
        ephemeral: true,
    });
}


