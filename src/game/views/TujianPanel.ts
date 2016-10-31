/**图鉴面板 */
class TujianPanel extends eui.Component implements  eui.UIComponent {
	private closeBtn:eui.Button;
	public roleList:eui.List;
	public roleListData:eui.ArrayCollection = new eui.ArrayCollection;
	public constructor() {
		super();
		 this.addEventListener( eui.UIEvent.COMPLETE, this.onComplete, this );
	}

	private onComplete():void{
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this)
		this.roleList.itemRenderer = TujianListItem;
		this.roleListData.source = gameMngers.roleInfoMnger.all;
		this.roleList.dataProvider = this.roleListData;
		this.roleList.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTapList,this);
	}

	private onTapList():void{
		if(this.roleList.selectedIndex>=0)
		{
			var roleInfo:gamevo.RoleBaseVO = this.roleList.selectedItem;
			gameviews.viewManager.showHeroPanel(roleInfo.id,false);
		}
	}

	private onClose():void{
		gameviews.viewManager.hideCurrentPanel();
	}
	
}