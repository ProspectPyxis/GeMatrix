import { keys } from "ts-transformer-keys"

export interface IConfig {
	token?: string
	prefix: string
}

export const ConfigKeys: string[] = keys<IConfig>()

export const DefaultConfig: IConfig = {
	prefix: "gm!"
}

