module gameviews {
	export class SkillSlot extends egret.Sprite{
		protected bg:eui.Image;
		public constructor() {
			super();
			this.bg = new eui.Image();
			this.addChild(this.bg);
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		}

		private onTap():void{
			if(this._skill){
				gameviews.viewManager.showTip(this,this._skill.des);

			}
		}

		private _skill:gamevo.SkillBaseVO;
		public setSkillId(id:string){
			this._skill = gameMngers.skillInfoMnger.getVO(id);
			this.bg.source = RES.getRes(this._skill.icon)
		}
	}
}