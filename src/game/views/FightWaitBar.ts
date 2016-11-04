/**冒险进度条 */
class FightWaitBar extends eui.ProgressBar implements  eui.UIComponent {
	public mapIndexTf:eui.Label;
	public mapNameTf:eui.Label;
	public mapTimeTf:eui.Label;
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
	
}