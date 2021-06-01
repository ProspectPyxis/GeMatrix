import { ICommand } from "../interfaces"

const command: ICommand = {
	name: "ping",
	run: async (bot, msg, args) => {
		msg.channel.send(`${bot.ws.ping} ping!`)
	}
}

export default command
