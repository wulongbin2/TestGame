/**所有成员队伍面板*/
class TeamMemberPanel extends eui.Component implements  eui.UIComponent {
	private closeBtn:eui.Button;
	public roleList:eui.List;
	private roleListData:eui.ArrayCollection = new eui.ArrayCollection;
	public constructor() {
		super();
		 this.addEventListener( eui.UIEvent.COMPLETE, this.onComplete, this );

	}
	
	private onComplete():void{
		this.roleList.itemRenderer = TeamListItem;
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this)
	}


	public show():void{
		this.roleListData.source = gameCore.currentUserInfo.getAllHero();
		this.roleList.dataProvider = this.roleListData;
	}

	private onClose():void{
		gameviews.viewManager.hideCurrentPanel();
	}
	
}