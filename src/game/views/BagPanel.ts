class BagPanel extends eui.Component implements  eui.UIComponent {

	public tab1:eui.RadioButton;
	public tab2:eui.RadioButton;
	public closeBtn:eui.Button;
	public desTf:eui.Label;
	public bagList:eui.List;
	public constructor() {
		super();
		this.addEventListener( eui.UIEvent.COMPLETE, this.onCompelate, this );

	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}

	protected childrenCreated():void
	{
		super.childrenCreated();
	}

	private onCompelate():void{
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeHd,this)
		this.tab1.group.addEventListener( egret.Event.CHANGE,this.updateView,this);
		this.tab1.selected = true;
		this.updateView();
	}

	private closeHd():void{
		gameviews.viewManager.hideBagPanel();
	}

	private updateView():void{
		if(this.tab1.selected)
		{
			this.addChild(this.tab1);
			this.desTf.text = '道具背包是空的！'
		}
		else if(this.tab2.selected)
		{
			this.addChild(this.tab2);
			this.desTf.text = '资源背包是空的！'
		}
	}
	
}