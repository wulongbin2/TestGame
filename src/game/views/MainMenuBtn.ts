/**主界面菜单按钮 */
class MainMenuBtn extends eui.RadioButton implements  eui.UIComponent {
	private lockIcon:eui.Image;
	public constructor() {
		super();
		 this.addEventListener( eui.UIEvent.COMPLETE, this.updateView, this );
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
	}

	public $setEnabled(value:boolean):boolean
	{
		var b:boolean= super.$setEnabled(value);
		this.updateView();
		return b;
	}

	public $setSelected(value:boolean):boolean
	{
		var b = super.$setSelected(value);
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
	}
}