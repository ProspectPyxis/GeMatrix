import { IEvent } from "../interfaces"

const event: IEvent = {
	name: "ready",
	run: (bot) => {
		bot.logger.success(`${bot.user.tag} is ready and running! Now serving in ${bot.guilds.cache.size} servers.`)
	}
}

export default event
