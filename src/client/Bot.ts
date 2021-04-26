import { Client, Collection } from "discord.js"
import path from "path"
import { readdirSync } from "fs"
import { ICommand, IEvent, IConfig } from "../interfaces"
import configJson from "../config.json"
import consola, { Consola } from "consola"
import Enmap from "enmap"

class Bot extends Client {
	public commands: Enmap = new Enmap()
	public aliases: Enmap = new Enmap()
	public config: IConfig = configJson

	public logger: Consola = consola

	public async init (): Promise<void> {
		this.logger.info("Starting pre-initialization phase!")

		const cmdPath = path.join(__dirname, "..", "commands")
		const cmdFiles = readdirSync(cmdPath).filter((f) => file.endsWith(".ts")
		this.logger.info(`Attempting to load a total of ${cmdFiles.length} commands.`)
		cmdFiles.forEach((cmdName) => {
			try {
				this.logger.info(`Loading command: ${cmdName}`)
				const cmd = await import(`${cmdPath}/${cmdName}`)

				this.commands.set(cmd.name, cmd)
				
				if (cmd.aliases) {
					cmd.aliases.forEach((alias) => { this.aliases.set(alias, cmd.name) })
				}
			} catch(e) {
				this.logger.warn(`Unable to load command ${cmdName}: ${e}`)
				return
			}
		})

		const evtPath = path.join(__dirname, "..", "events")
		const evtFiles = readdirSync(evtPath).filter((f) => file.endsWith(".ts")
		this.logger.info(`Attempting to load a total of ${evtFiles.length} events.`)
		evtFiles.forEach((evtName) => {
			try {
				const { evt } = await import(`${evtPath}/${evtName}`)
				this.logger.info(`Loading event: ${evt.name}`)
				this.on(evt.name, evt.run.bind(null, this))
			} catch(e) {
				this.logger.warn(`Unable to load event ${evtName}: ${e}`)
				return
			}
		})

		this.logger.info("Logging in...")
		this.login(this.config.token)
	}
}

export default Bot
