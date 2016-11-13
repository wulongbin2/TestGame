class DialogBG extends eui.Component implements  eui.UIComponent {
	public labelTf:egret.TextField = new egret.TextField();
	public constructor() {
		super();
		this.addEventListener(egret.Event.COMPLETE, this.onComplete,this);

	}

	private onComplete():void{
		this.touchChildren = this.touchEnabled = false;
		this.labelTf.x = this.labelTf.y = 5;
		this.labelTf.size = 40;
		this.labelTf.textColor = 0;
		this.labelTf.bold = true;
		this.labelTf.fontFamily = '黑体';
		this.addChild(this.labelTf);
	}

	public showText(container:egret.DisplayObjectContainer,x:number,y:number,text:string){
		container.addChild(this);
		this.labelTf.width = 400;
		this.labelTf.text = text;
		this.width = this.labelTf.textWidth +10;
		this.height = this.labelTf.textHeight +20
		this.x = Math.max(0,Math.min(gamesystem.stageWidth- this.width,x));
		this.y = Math.max(0,Math.min(gamesystem.stageHeight- this.height,y))-this.height;
	}

}