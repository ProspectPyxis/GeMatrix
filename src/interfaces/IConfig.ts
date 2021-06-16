export interface IConfig {
	token?: string
	prefix: string
	timeout: number
	timeoutWarn: number
}

export const DefaultConfig: IConfig = {
	prefix: "gm!",
	timeout: 90,
	timeoutWarn: 15
}

