import { IEvent } from "../interfaces"

export const event: Event = {
	name: "ready",
	run: (bot) => {
		bot.logger.success(`${bot.user.tag} is ready and running! Now serving in ${bot.guilds.cache.size} servers.`)
	}
}
