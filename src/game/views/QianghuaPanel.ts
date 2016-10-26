class QianghuaPanel extends eui.Component implements  eui.UIComponent {
	public tab1:eui.RadioButton;
	private closeBtn:eui.Button;
	public constructor() {
		super();
		this.addEventListener( eui.UIEvent.COMPLETE, this.oncomplete, this );
	}

	protected oncomplete():void{
		this.tab1.selected = true;
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
	}

	protected onClose():void{
		gameviews.viewManager.hideCurrentPanel();
	}
	
}