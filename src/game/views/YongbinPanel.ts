class YongbinPanel extends eui.Component implements  eui.UIComponent {
	public constructor() {
		super();
	    this.addEventListener( eui.UIEvent.COMPLETE, this.onComplete, this );

	}

	private onComplete():void{
		
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