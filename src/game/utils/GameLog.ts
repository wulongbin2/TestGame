module gameLog {
	export function log(...param):void{
		console.log.apply(null,param);
	}
}