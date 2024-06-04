import {
    ChannelType, Client, CommandInteraction, SlashCommandBuilder, TextChannel,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from "discord.js";
import { createTicket } from "../firebase";

export const data = new SlashCommandBuilder().setName("help").setDescription("Creates a new help ticket.").addStringOption(option => option.setName("description").setDescription("Describe your problem").setRequired(true));

export async function execute(interaction: CommandInteraction, client: Client) {
    if (!interaction?.channelId) {
        return
    }

    const channel = await client.channels.fetch(interaction.channelId)
    if (!channel || channel.type != ChannelType.GuildText) {
        return
    }

    const thread = await (channel as TextChannel).threads.create({
        name: `support-${Date.now()}`,
        reason: `Support ticket ${Date.now()}`,
        type: 12
    })

    const problemDescription = (interaction.options.get('description')?.value as string) || '';
    const { user } = interaction;

    const resolveButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId('resolve_ticket')
            .setLabel('Resolve Ticket')
            .setStyle(ButtonStyle.Success)
    );

    thread.send({
        content: `**User:** ${user}\n**Problem:** ${problemDescription}`,
        components: [resolveButton]
    });

    //create the ticket and store it in the firestore
    await createTicket(thread.id, problemDescription)


    return interaction.reply({
        content: "Help is on the way!",
        ephemeral: true,
    })

}
