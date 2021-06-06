import { IEvent, ICommand } from "../interfaces"
import { Message } from "discord.js"

const event: IEvent = {
	name: "message",
	run: (bot, msg: Message) => {
		if (msg.author.bot) return

		if (msg.guild && msg.content.startsWith(bot.config.prefix)) {
			const args = msg.content.slice(bot.config.prefix.length).trim().split(/ +/g)
			const command = args.shift().toLowerCase()

			const cmd = bot.commands.get(command) || bot.commands.get(bot.aliases.get(command))

			if (cmd) (cmd as ICommand).run(bot, msg, args)
		}
	}
}

export default event
