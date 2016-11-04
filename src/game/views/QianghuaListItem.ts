/**升级列表子项 */
class QianghuaListItem extends eui.ItemRenderer implements  eui.UIComponent {

	public levelBtn:eui.Button;
	public roleSlot:gameviews.HeroSlot;
	public addZdlTf:eui.Label;
	public subExpTf:eui.Label;
	public nameTf:eui.Label;
	public levelTf:eui.Label;
	public zdlTf:eui.Label;
	public juexingTf:eui.Label;
	public constructor() {
		super();
		this.roleSlot = new gameviews.HeroSlot();
		this.addEventListener(egret.Event.COMPLETE, this.onComplete,this);
	}

	protected onComplete():void{
		this.roleSlot.x = 5;
		this.roleSlot.y = 0;
		this.roleSlot.scale = 0.7;
		this.addChild(this.roleSlot);
		this.levelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onLevel,this);
	}

	protected onLevel():void{
		gameCore.levelHero(this.data);	
		this.updateView();
		gameviews.GoodsMessageItem.getInstance().show(this,60,75,'contract_level_png',0,gameviews.GoodsMessageItem.Tween_Fast);
	}

	protected dataChanged():void{
		super.dataChanged();
		this.updateView();
	}

	public updateView():void{
		var heroMo:gameCore.HeroMO = this.data;
		if(heroMo)
		{
			var roleVo:gamevo.RoleBaseVO = heroMo.roleVo
			this.roleSlot.roleId = heroMo.roleId;
			this.nameTf.text = roleVo.name;
			this.levelTf.text ='Lv.'+ heroMo.roleLevel;
			this.zdlTf.text = heroMo.zdl+'';
			this.juexingTf.text = heroMo.awakenLevel+'/'+roleVo.awakenTime;
			var exp:number = gameCore.calculHeroLevelUseExp(heroMo);
			this.levelBtn.enabled = gameCore.currentUserInfo.exp>=exp;
			this.subExpTf.text = 'exp -'+gameutils.zdlToString( exp);
			this.addZdlTf.text = '+'+gameutils.zdlToString(gameCore.calculHeroNextLevelOffZDL(heroMo));
		}
	}
}