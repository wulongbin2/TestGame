module gamevo {
	export class DialogVO extends BaseVO{
		public actions:DialogActionVO[] = [];
		public analysis(config:any):void{
			var xml:egret.XML = config;
			this.id = xml.attributes.id;
			xml.children.forEach(item=>{
				var action:DialogActionVO = new DialogActionVO();
				action.analysis(item as egret.XML);
				this.actions.push(action);
			});
		}
	}

	export class DialogActionVO{
		public word:string;
		public teamId:number;
		public analysis(xml:egret.XML){
			this.teamId = parseInt( xml.attributes.teamId);
			this.word = xml.attributes.word;
		}
	}
}