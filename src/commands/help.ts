import { ChannelType, Client, CommandInteraction, SlashCommandBuilder, TextChannel,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageComponentInteraction,
    Interaction} from "discord.js";
import { createTicket } from "../firebase";
import { client } from "../bot";
import axios from "axios";

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
client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'resolve_ticket') {
        const threadId = interaction.channelId;

        try {
            await axios.post('http://localhost:3000/resolve', { threadId });
            await interaction.reply({
                content: 'The ticket has been marked as resolved and the thread is now archived.',
                ephemeral: true,
            });
        } catch (error) {
            await interaction.reply({
                content: 'An error occurred while updating the ticket status.',
                ephemeral: true,
            });
        }
    }
});
