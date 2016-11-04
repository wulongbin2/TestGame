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
			this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this); 
		}

		private onTap():void{
			gameviews.viewManager.showHeroPanel(this._roleId,false);
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
				this.heroPlayer.setHeroAnimaId(this._roleInfo.animaSource);
			}
			else
			{
				this.bg.source = null;
				this.heroPlayer.setHeroAnimaId('');
			}
		}

		public set scale(value:number){
			this.bg.scaleX = this.bg.scaleY = value;
			this.bg.y = this.bg.x = (112)*0.5*(1-value);
		}
	}
}