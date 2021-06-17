export interface IConfig {
	token?: string
	prefix: string
	timeout: number
	timeoutWarn: number
	setupTimeout: number
	setupTimeoutWarn: number
}

export const DefaultConfig: IConfig = {
	prefix: "gm!",
	timeout: 90,
	timeoutWarn: 15,
	setupTimeout: 120,
	setupTimeoutWarn: 15
}

