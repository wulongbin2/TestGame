class DialogBG extends eui.Component implements  eui.UIComponent {
	public labelTf:egret.TextField = new egret.TextField();
	public leftBg:eui.Image;
	public rightBg:eui.Image;
	public heroPlayer:gameAnima.HeroAnimaPlayer = new gameAnima.HeroAnimaPlayer();
	public constructor() {
		super();
		this.addEventListener(egret.Event.COMPLETE, this.onComplete,this);

	}

	private onComplete():void{
		this.touchChildren = this.touchEnabled = false;
		this.labelTf.x =70;
		this.labelTf.y = 45;
		this.labelTf.size = 30;
		this.labelTf.textColor = 0;
		this.labelTf.bold = true;
		this.labelTf.fontFamily = '黑体';
		this.addChild(this.labelTf);
		this.heroPlayer.scale = 2;
		this.heroPlayer.x = 35;
		this.heroPlayer.y = 90;
		this.addChild(this.heroPlayer);

	}

	public showText(container:egret.DisplayObjectContainer,x:number,y:number,roleId:string,text:string,isLeft:boolean = true){
		container.addChild(this);
		this.labelTf.width = 500;
		this.labelTf.text = text;
		this.width = this.labelTf.textWidth +80;
		if(this.labelTf.numLines>1)
		{
			this.height = 180;
		}
		else{
			this.height = 130;

		}
		this.heroPlayer.resetAnimaSource(gameMngers.roleInfoMnger.getVO(roleId).animaSource);
		this.leftBg.visible = isLeft;
		this.rightBg.visible =!isLeft;
		x = isLeft?x-73:x-(this.width-73);
		this.x = Math.max(0,Math.min(gamesystem.stageWidth- this.width,x));
		this.y = Math.max(0,Math.min(gamesystem.stageHeight- this.height,y))-this.height;
	}
}