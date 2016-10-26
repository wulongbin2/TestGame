class FightPanel extends eui.Component implements  eui.UIComponent {
	public bagBtn:eui.Button;
	public teamBtn:eui.Button;
	public mapIndexBtn:eui.Button;
	public constructor() {
		super();
		this.addEventListener( eui.UIEvent.COMPLETE, this.oncomplate, this );
	}

	private oncomplate():void{

		this.teamBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShowQianghua,this)
		this.bagBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShowBag,this)
		this.mapIndexBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShowMapChoose,this)
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