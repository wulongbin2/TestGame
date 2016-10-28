module gameutils {
	export class VersionCtrl extends RES.VersionController {

		public constructor() {
			super();
		}

		public getVirtualUrl(url:string):string{
			return url+'?version='+gamesystem.version;
		}
	}
}