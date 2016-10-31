module gameviews {
	export class HeroSlot extends egret.Sprite {
		protected bg:eui.Image;
		protected heroPlayer:gameAnima.HeroAnimaPlayer;
		protected _roleId:string;
		protected _roleInfo:gamevo.RoleBaseVO;
		public constructor() {
			super();
			this.bg = new eui.Image();
			this.addChild(this.bg);

			this.heroPlayer = new gameAnima.HeroAnimaPlayer();
			this.heroPlayer.x = 112*0.5;
			this.heroPlayer.y = 90;
			this.addChild(this.heroPlayer); 
		}

		public set roleId(id:string){
			if(this._roleId === id) return;
			this._roleId = id;
			this._roleInfo = gameMngers.roleInfoMnger.getVO(this._roleId);
			this.updateView();
		}

		public get roleId():string{
			return this._roleId; 
		}

		protected updateView():void{
			if(this._roleInfo)
			{
				this.bg.source = RES.getRes(`herolist_bg${this._roleInfo.qualityNum}_png`);
				this.heroPlayer.setHeroId(this._roleInfo.animaSource);
			}
			else
			{
				this.bg.source = null;
				this.heroPlayer.setHeroId('');
			}
		}
	}
}