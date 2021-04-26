import { Bot } from "../client/Bot"
import { Message } from "discord.js"

interface IRun {
	(client: Bot, message: Message, args: string[])
}

export interface ICommand {
	name: string
	description?: string
	aliases?: string[]
	run: IRun
}
