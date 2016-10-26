class YongbinPanel extends eui.Component implements  eui.UIComponent {

	private teamBtn:eui.Button;
	private tujianBtn:eui.Button;
	private allMemberBtn:eui.Button;
	public constructor() {
		super();
	    this.addEventListener( eui.UIEvent.COMPLETE, this.onComplete, this );

	}

	private onComplete():void{
		this.teamBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.OpenTeamPanel,this);
		this.tujianBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.OpenTujianPanel,this);
		this.allMemberBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.OpenMemberPanel,this);
	}

	private OpenTeamPanel():void{
		gameviews.viewManager.showTeamPanel();
	}

	private OpenTujianPanel():void{
		gameviews.viewManager.showTujianPanel();
	}

	private OpenMemberPanel():void{
		gameviews.viewManager.showMemberPanel();
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
	}
	
}