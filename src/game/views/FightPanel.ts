/**冒险面板 */
class FightPanel extends eui.Component implements  eui.UIComponent {
	public bagBtn:eui.Button;
	public teamBtn:eui.Button;
	public mapIndexBtn:eui.Button;
	public mapLevelBtn:eui.Button;
	public mapLevelList:eui.List;
	public constructor() {
		super();
		this.addEventListener( eui.UIEvent.COMPLETE, this.oncomplate, this );
	}

	private oncomplate():void{
		this.mapLevelList = new eui.List();
		this.mapLevelList.itemRenderer = MapLevelItem;
		this.mapLevelList.dataProvider = new eui.ArrayCollection([0,1,2]);
		this.teamBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShowQianghua,this)
		this.bagBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShowBag,this)
		this.mapIndexBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShowMapChoose,this)
		this.mapLevelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShowMapLevel,this)
		this.mapLevelList.x = 5;
		this.mapLevelList.y = this.mapLevelBtn.y+this.mapLevelBtn.height;

		this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemoveFromStage, this);
	}

	private onRemoveFromStage():void{
		this.hideMapLevelList();
	}

	private onShowMapLevel():void{
		// gameviews.viewManager.showHeroPanel();
		
		this.addChild(this.mapLevelList);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.hideMapLevelList,this);
	}

	private hideMapLevelList(e?:egret.TouchEvent):void{
		if(e && e.target === this.mapLevelBtn) return;
		if(this.mapLevelList.parent)
		{
			this.removeChild(this.mapLevelList);
		}
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.hideMapLevelList,this);
	}

	private onShowMapChoose():void{
		gameviews.viewManager.showMapChoosePanel();
	}

	private onShowQianghua():void{
		gameviews.viewManager.showQianghuaPanel();
	}
	private onShowBag():void{
		gameviews.viewManager.showBagPanel();
	}
}