/**关卡选择面板 */
class MapChoosePanel extends eui.Component implements  eui.UIComponent {
	private closeBtn:eui.Button;
	private mapList:eui.List;
	private mapData:eui.ArrayCollection = new eui.ArrayCollection;
	private mapNameTf:eui.Label;
	public constructor() {
		super();
		this.addEventListener( eui.UIEvent.COMPLETE, this.onComplete, this );

	}

	private onComplete():void{
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this)
		this.mapList.itemRenderer = MapChooseItem;
		this.mapList.addEventListener(egret.Event.CHANGE, this.onChange, this);
		this.mapData.source = gameMngers.mapInfoMnger.all;
	}

	private onChange():void{
		gameCore.changeMap(this.mapList.selectedItem.mapId);
		this.onClose();
	}

	private onClose():void{
		gameviews.viewManager.hideCurrentPanel();
	}

	public show():void{
		this.mapList.dataProvider = this.mapData;
		this.mapList.selectedIndex = gameCore.currentUserInfo.curMap;
		this.mapNameTf.text = this.mapList.selectedItem.name;
	}
	
}