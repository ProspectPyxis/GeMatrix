import Bot from "../client/Bot"
import { ClientEvents } from "discord.js"

interface IRun {
	(bot: Bot, ...args: any[]): void
}

export interface IEvent {
	name: keyof ClientEvents
	run: IRun
}
