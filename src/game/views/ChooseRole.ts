class ChooseRole extends eui.Component implements  eui.UIComponent {
	private closeBtn:eui.Button;
	private okBtn:eui.Button;
	public nullTf:eui.Label;
	public roleList:eui.List;
	public roleListData:eui.ArrayCollection = new eui.ArrayCollection;
	private chooseRoleInfo:ChooseRoleSkillInfo = new ChooseRoleSkillInfo;
	public constructor() {
		super();
		this.addEventListener(egret.Event.COMPLETE, this.onComplete, this)
	}

	private onComplete():void{
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.hide,this)
		this.roleList.itemRenderer = TeamListItem;
		this.roleList.addEventListener(egret.Event.CHANGE,this.onSelectedRole,this);
	}

	private cb:(result:gameCore.HeroMO)=>void;
	public showData(container:egret.DisplayObjectContainer,data:gameCore.HeroMO[],cb:(result:gameCore.HeroMO)=>void):void{
		container.addChild(this);
		this.cb  = cb;
		this.roleListData.source = data;
		this.nullTf.visible = data.length == 0;
		this.roleList.dataProvider = this.roleListData;
			this.roleList.selectedIndex = -1;
	}

	private onSelectedRole():void{
		if(this.roleList.selectedItem)
		{
			this.chooseRoleInfo.show(this,this.roleList.selectedItem,()=>{
				this.hide();
				this.cb(this.roleList.selectedItem);
			})
		}
	}


	public hide():void{
		if(this.parent){
			this.parent.removeChild(this);
		}
		this.chooseRoleInfo.hide();
	}
	
}