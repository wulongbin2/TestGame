/**成员列表子项 */
class TeamListItem extends eui.ItemRenderer implements  eui.UIComponent {
	private slot:gameviews.HeroSlot =new gameviews.HeroSlot();
	public selectedIcon:eui.Image;
	public stateTf:eui.Label;
	public bg:eui.Image;
	public zdlTf:eui.Label;
	public constructor() {
		super();
		this.addEventListener( eui.UIEvent.COMPLETE, this.onComplete, this );
		this.skinName ='TeamListItemSkin';
	}

	protected onComplete():void{
		this.selectedIcon.visible = false;
		this.slot.enabledPopInfo = false;
		this.addChild(this.slot);
		this.addChild(this.zdlTf);
	}


	public invalidateState():void
	{
		super.invalidateState();
		this.selectedIcon.visible = this.selected;
	}

	private onCompelate():void{
		this.selectedIcon.visible = this.selected;
	}

	protected dataChanged():void{
		super.dataChanged();
		var mo:gameCore.HeroMO = this.data;
		if(mo)
		{
			this.zdlTf.visible = true;
			this.zdlTf.text = gameutils.zdlToString(mo.zdl);
			this.slot.roleId = mo.roleId;
			this.slot.visible = true;
		}
		else{
			this.zdlTf.visible = false;
			this.slot.visible = false;
			this.slot.roleId = '';
		}
	}
	
}