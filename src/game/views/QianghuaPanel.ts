/**强化升级面板 */
class QianghuaPanel extends eui.Component implements  eui.UIComponent {
	public tab1:eui.RadioButton;
	private closeBtn:eui.Button;
	public zdlTf:eui.Label;
	public memberlist:eui.List;
	public memberlistData:eui.ArrayCollection = new eui.ArrayCollection;
	public constructor() {
		super();
		this.addEventListener( eui.UIEvent.COMPLETE, this.oncomplete, this );
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemoveFromStage,this);
	}

	protected oncomplete():void{
		this.tab1.selected = true;
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
		this.memberlist.itemRenderer = QianghuaListItem;
	}

	public show():void{
		gameutils.asynMnger.addCB(500,this.onTick,this);
		this.memberlistData.source = gameCore.currentUserInfo.getAllHero();
		this.memberlist.dataProvider = this.memberlistData;
	}


	private onRemoveFromStage():void{
		gameutils.asynMnger.removeCB(this.onTick,this);
	}

	private onTick():void{
		this.zdlTf.text = gameutils.zdlToString(gameCore.currentUserInfo.totalZDL);
		this.memberlist.$indexToRenderer.forEach((item:QianghuaListItem)=>{
			item.updateView();
		})
	}

	protected onClose():void{
		gameviews.viewManager.hideCurrentPanel();
	}
	
}