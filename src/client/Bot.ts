import { Client, User, Channel, MessageAdditions } from "discord.js"
import path from "path"
import { readdirSync, readFileSync } from "fs"
import { IConfig, DefaultConfig } from "../interfaces"
import toml from "toml"
import consola, { Consola } from "consola"
import Enmap from "enmap"

class Bot extends Client {
	public commands: Enmap = new Enmap()
	public aliases: Enmap = new Enmap()
	public config: IConfig = DefaultConfig

	public logger: Consola = consola

	public games: Enmap = new Enmap()
	public activeGames: Enmap = new Enmap()

	public async init (): Promise<void> {
		this.logger.info("Starting pre-initialization phase!")

		this.logger.info("Loading config...")
		try {
			const configPath = path.join(__dirname, "..", "config.toml")
			const configFile = readFileSync(configPath).toString()
			this.config = {...DefaultConfig, ...toml.parse(configFile)}
		} catch(e) {
			this.logger.error(`Fatal Error: Unable to read config: ${e}`)
			this.exitBot(1)
			return
		}
		if (!this.config.token) {
			this.logger.error(`Fatal Error: Login token not found`)
			this.exitBot(1)
			return
		}
		this.logger.success("Config loaded successfully!")

		const cmdPath = path.join(__dirname, "..", "commands")
		const cmdFiles = readdirSync(cmdPath).filter((f) => f.endsWith(".ts"))
		this.logger.info(`Attempting to load a total of ${cmdFiles.length} commands.`)
		cmdFiles.forEach(async (cmdName) => {
			try {
				const cmd = (await import(`${cmdPath}/${cmdName}`)).default
				this.logger.info(`Loading command: ${cmd.name}`)

				this.commands.set(cmd.name, cmd)

				if (cmd.aliases) {
					cmd.aliases.forEach((alias: string) => { this.aliases.set(alias, cmd.name) })
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

	// TODO: Make this link to a proper page explaining dm permissions
	public async attemptDM (user: User, baseChannel: Channel, content: string, options?: MessageAdditions): Promise<void> {
		try {
			if (options) await user.send(content, options)
			else await user.send(content)
		} catch(e) {
			this.logger.warn(`Error: couldn't DM user ${user.tag}!`)
		}
	}

	public exitBot(exitcode = 0): void {
		this.logger.info(`Destroying bot instance and exiting with code ${exitcode}.`)
		process.exitCode = exitcode
		this.destroy()
	}
}

export default Bot
