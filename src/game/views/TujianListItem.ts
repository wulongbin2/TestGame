class TujianListItem extends eui.ItemRenderer implements  eui.UIComponent {
	private slot:gameviews.HeroSlot;
	public constructor() {
		super();
		this.addEventListener( eui.UIEvent.COMPLETE, this.onComplete, this );
	}

	protected onComplete():void{
		this.slot = new gameviews.HeroSlot();
		this.addChild(this.slot);

	}

	protected dataChanged():void{
		super.dataChanged();
		if(this.data)
		{
				this.slot.roleId = this.data.id;
				this.filters = gameCore.currentUserInfo.playerBagMnger.heroBag.hasItemByConfigId(this.data.id)?null:gameutils.FilterUtls.Dark_Fiter;
		}
		else{
			this.slot.roleId = '';
		}
	}
}