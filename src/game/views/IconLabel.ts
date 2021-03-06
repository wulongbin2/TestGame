/**显示icon与label的简单组件*/
class IconLabel extends eui.Component implements  eui.UIComponent {

	private iconDisplay:eui.Image;
	private labelTf:eui.Label;
	public constructor() {
		super();
		 this.addEventListener( eui.UIEvent.COMPLETE, this.updateView, this );
	}

	private _text:string = '';
	public set text(value:string){
		this._text = value;
		this.updateView();
	}

	public get text():string{
		return this._text;
	}

	private _textColor:number;
	public set textColor(value:number){
		this._textColor = value;
		this.updateView();
	}

	public get textColor():number{
		return this._textColor;
	}

	public get label():eui.Label
	{
		return this.labelTf;
	}

	private _icon:any;
	public set icon(value:any){
		this._icon = value;
		this.updateView();
	}

	public get icon():any{
		return 	this._icon ;
	}

	public updateView():void{
		if(this.labelTf)
		{
			this.labelTf.text =this._text;
		}

		if(this.iconDisplay)
		{
			this.iconDisplay.source =this._icon;
		} 
		
	}
	
}