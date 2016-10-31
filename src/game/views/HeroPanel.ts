/**英雄信息面板 */
class HeroPanel extends eui.Component implements  eui.UIComponent {
	private closeBtn:eui.Button;
	private newIcon:eui.Image;
	private roleTagTf:eui.Label;
	private desTf:eui.Label;
	private nameTf:eui.Label;
	private heroAnimaPlayer:gameAnima.HeroAnimaPlayer;
	public constructor() {
		super();
		this.heroAnimaPlayer = new gameAnima.HeroAnimaPlayer();
		 this.addEventListener( eui.UIEvent.COMPLETE, this.onComplete, this );
	}
	
	private onComplete():void{
		this.heroAnimaPlayer.x = this.width*0.5;
		this.heroAnimaPlayer.y = this.height*0.5-35;
		this.heroAnimaPlayer.scale = 3;
		this.addChild(this.heroAnimaPlayer);
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this)
		this.updateView();
	}

	private onClose():void{
		gameviews.viewManager.hideCurrentPanel();
	}

	private _roleId:string;
	private _checkNew:boolean;
	public showHero(roleId:string,checkNew:boolean = false):void{
		this._roleId = roleId;
		this._checkNew = checkNew;
		if(this.closeBtn)
		{
			this.updateView();
		}
	}

	private updateView():void{
		if(this._checkNew)
		{
			//todo check
			this.newIcon.visible = true;
		}
		else{
			this.newIcon.visible = false;
		}
		var info:gamevo.RoleBaseVO = gameMngers.roleInfoMnger.getVO(this._roleId);
		this.heroAnimaPlayer.setHeroId(this._roleId);
		this.heroAnimaPlayer.playAnimaById(gamesystem.AnimaDownWalk)
		this.nameTf.text = info.name;
		this.desTf.text = info.des;
		this.roleTagTf.text = info.tag.join('/');
	}

	
}