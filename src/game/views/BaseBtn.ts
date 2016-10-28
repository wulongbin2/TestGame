/**某个按钮 */
class BaseBtn extends eui.Button implements  eui.UIComponent {
	public constructor() {
		super();
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
		this.filters =value?null:gameutils.FilterUtls.BW_Fiter;
		return b;
	}
	
}