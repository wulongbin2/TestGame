class AlertPanel extends eui.Component implements  eui.UIComponent {
	public closeBtn:eui.Button;
	public okBtn:eui.Button;
	public titleTf:eui.Label;
	public desTf:eui.Label;
	public constructor() {
		super();
		this.addEventListener(egret.Event.COMPLETE,this.onComplete,this);
		this.skinName ='AlertPanelSkin';
	}

	private onComplete():void{
		this.okBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose,this);
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose,this);
	}

	private onClose():void{
		this.parent.removeChild(this);
	}

	public show(mes:string,title:string='注意前方！'):void{
		this.titleTf.text = title;
		this.desTf.text = mes;
	}
	
}