import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder().setName("ping").setDescription("Replies with pong")

export async function execute(interection: CommandInteraction){
    return interection.reply("Pong!")
}