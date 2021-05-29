import { Client, Collection, User, Channel, MessageAdditions } from "discord.js"
import path from "path"
import { readdirSync, readFileSync } from "fs"
import { ICommand, IEvent, IConfig } from "../interfaces"
import toml from "toml"
import consola, { Consola } from "consola"
import Enmap from "enmap"

class Bot extends Client {
	public commands: Enmap = new Enmap()
	public aliases: Enmap = new Enmap()
	public config: IConfig

	public logger: Consola = consola

	public async init (): Promise<void> {
		this.logger.info("Starting pre-initialization phase!")

		this.logger.info("Loading config...")
		const configPath = path.join(__dirname, "..", "config.toml")
		const configFile = readFileSync(configPath)
		try {
			this.config = toml.parse(configFile)
		} catch(e) {
			this.logger.error(`Fatal Error: Unable to read config: ${e}`)
			return
		}
		this.logger.success("Config loaded successfully!")

		const cmdPath = path.join(__dirname, "..", "commands")
		const cmdFiles = readdirSync(cmdPath).filter((f) => f.endsWith(".ts"))
		this.logger.info(`Attempting to load a total of ${cmdFiles.length} commands.`)
		cmdFiles.forEach(async (cmdName) => {
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
		const evtFiles = readdirSync(evtPath).filter((f) => f.endsWith(".ts"))
		this.logger.info(`Attempting to load a total of ${evtFiles.length} events.`)
		evtFiles.forEach(async (evtName) => {
			try {
				const evt = (await import(`${evtPath}/${evtName}`)).default
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

	public attemptDM (user: User, baseChannel: Channel, content: string, options?: MessageAdditions) {
		try {
			user.send(content, options)
		} catch(e) {
			this.logger.warn(`Error: couldn't DM user ${user.tag}!`)
		}
	}
}

export default Bot
