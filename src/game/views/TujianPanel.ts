/**图鉴面板 */
class TujianPanel extends eui.Component implements  eui.UIComponent {
	private closeBtn:eui.Button;
	public roleList:eui.List;
	public jinduTf:eui.Label;
	public roleListData:eui.ArrayCollection = new eui.ArrayCollection;
	public constructor() {
		super();
		 this.addEventListener( eui.UIEvent.COMPLETE, this.onComplete, this );
	}

	private onComplete():void{
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this)
		this.roleList.itemRenderer = TujianListItem;
	}

	public show():void{
		this.roleListData.source = gameMngers.roleInfoMnger.tujians;
		this.roleList.dataProvider = this.roleListData;
		var tag:any = {};
		var num:number = 0;
		gameCore.currentUserInfo.getAllTeamHero(false).forEach(item=>{
			if(!tag[item.roleId])
			{
				tag[item.roleId] = true;
				num++;
			}
		})
		this.jinduTf.text = num+'/'+this.roleListData.source.length;
	}


	private onClose():void{
		gameviews.viewManager.hideCurrentPanel();
	}
	
}