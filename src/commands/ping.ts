import { ICommand } from "../interfaces"

const command: ICommand = {
	name: "ping",
	run: async (bot, msg, args) => {
		msg.channel.send(`**Pong!** Current ping is ${bot.ws.ping}ms.`)
	}
}

export default command
