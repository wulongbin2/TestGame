/**佣兵菜单子项 */
class YongbinMenuItem extends eui.Button implements  eui.UIComponent {
	private lockIcon:eui.Image;
	public constructor() {
		super();
		this.addEventListener( eui.UIEvent.COMPLETE, this.updateView, this );
	}

	
	public $setEnabled(value:boolean):boolean
	{
		var b:boolean= super.$setEnabled(value);
		this.updateView();
		return b;
	}

	
	private updateView():void{
		if(this.lockIcon)
		{
			this.lockIcon.visible =!this.enabled;
		}
		if(!this.enabled)
		{
			this.filters =gameutils.FilterUtls.BW_Fiter;
		}
		else{
			this.filters = null;
		}
	}
}