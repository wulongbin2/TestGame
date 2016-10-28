/**图鉴面板 */
class TujianPanel extends eui.Component implements  eui.UIComponent {
	private closeBtn:eui.Button;
	public constructor() {
		super();
		 this.addEventListener( eui.UIEvent.COMPLETE, this.onComplete, this );
	}

	private onComplete():void{
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this)
	}

	private onClose():void{
		gameviews.viewManager.hideCurrentPanel();
	}
	
}