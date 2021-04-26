import { Bot } from "../Client/Bot"
import { ClientEvents } from "discord.js"

interface IRun {
	(bot: Bot, ...args: any[])
}

export interface IEvent {
	name: keyof ClientEvents
	run: IRun
}
