class SkillBG extends eui.Component implements  eui.UIComponent {
	public labelTf:egret.TextField = new egret.TextField();

	public constructor() {
		super();
		this.addEventListener(egret.Event.COMPLETE, this.onComplete,this);
		this.addEventListener(egret.Event.ADDED_TO_STAGE,this.addToStage,this);
	}

	private addToStage():void{
		gameutils.asynMnger.addOnceCB(30,()=>{
			gamesystem.stage.addEventListener(egret.TouchEvent.TOUCH_TAP,this.removeThis,this,true);
		},this);
	}

	private removeThis():void{
		if(this.parent)
		{
			this.parent.removeChild(this);
		}
		gamesystem.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.removeThis,this,true);

	}

	private onComplete():void{
		this.touchChildren = this.touchEnabled = false;
		this.labelTf.x = this.labelTf.y = 2;
		this.labelTf.size = 22;
		this.labelTf.bold = true;
		this.labelTf.fontFamily = '黑体';
		this.addChild(this.labelTf);
	}

	public showText(container:egret.DisplayObjectContainer,x:number,y:number,text:string){
		container.addChild(this);
		this.labelTf.width = 300;
		this.labelTf.text = text;
		this.width = this.labelTf.textWidth +4;
		this.height = this.labelTf.textHeight +4
		this.x = Math.max(0,Math.min(gamesystem.stageWidth- this.width,x));
		this.y = Math.max(0,Math.min(gamesystem.stageHeight- this.height,y))-this.height;
	}
	
}