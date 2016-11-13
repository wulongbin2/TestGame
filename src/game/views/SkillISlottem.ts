/**技能列表子项 */
class SkillISlottem extends eui.ItemRenderer implements  eui.UIComponent {
	public slot:gameviews.SkillSlot;
	public selectedIcon:eui.Image;
	public constructor() {
		super();
		this.slot = new gameviews.SkillSlot();
		this.addEventListener( eui.UIEvent.COMPLETE, this.onCompelate, this );

	}

	public invalidateState():void
	{
		super.invalidateState();
		this.selectedIcon.visible = this.selected;
	}

	private onCompelate():void{
		this.selectedIcon.touchEnabled = false;
		this.addChildAt(this.slot,1);
		this.selectedIcon.visible = this.selected;
	}

	protected dataChanged():void{
		super.dataChanged();
		if(this.data)
		{
			this.slot.visible = true;
			this.slot.setSkillId(this.data);
		}
		else{
			this.slot.visible = false;
		}
	}
	
}