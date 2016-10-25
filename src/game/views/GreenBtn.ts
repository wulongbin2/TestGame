class GreenBtn extends eui.Button implements  eui.UIComponent {
	private bg:eui.Image;
	private _bgSource:string;
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

	public set bgSource(value:string){
		this._bgSource = value;
		this.updateView();
	}

	public get bgSource():string{
		return this._bgSource;
	}

	private updateView():void{
		if(this.bg)
		{
			this.bg.source = this._bgSource;
		}
	}
	
}