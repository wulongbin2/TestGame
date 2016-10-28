/**关卡难度列表子项 */
class MapLevelItem extends eui.ItemRenderer implements  eui.UIComponent {
	public labelTf:eui.Label;
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
	protected dataChanged():void{
		this.labelTf.text = ['简单','适中','困难'][this.data];
	}
	
}