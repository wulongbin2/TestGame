/**出场阵容面板 */
class TeamPanel extends eui.Component implements  eui.UIComponent {
	private closeBtn:eui.Button;
	public roleList:eui.List;
	public nameTf:eui.Label;
	public skillNameTf:eui.Label;
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
		this.roleListData.source = gameCore.currentUserInfo.getAllTeamHero();
		this.roleList.dataProvider = this.roleListData;
	}

	private onClose():void{
		gameviews.viewManager.hideCurrentPanel();
	}
	
}