module gameviews {
	export class GoodsMessage extends egret.Sprite{
		public constructor() {
			super();
		}

		private  cacheMes:{iconSource:string,num:number}[] = [];
		private _isRuning:boolean = false;
		public showGoodsMes(iconSource:string,num:number){
			this.cacheMes.push({iconSource:iconSource,num:num});
			if(this.isRuning === false)
			{
				this.onTick();
				this.isRuning = true;
			}
		}

		public set isRuning(value:boolean){
			if(this._isRuning === value) return;
			this._isRuning = value;
			if(this._isRuning){
				gameutils.asynMnger.addCB(500,this.onTick,this);
			}
			else{
				gameutils.asynMnger.removeCB(this.onTick,this);
			}
		}

		public get isRuning():boolean{
			return this._isRuning;
		}

		private onTick():void{
			if(this.cacheMes.length>0){
				var obj = this.cacheMes.pop();
				GoodsMessageItem.getInstance().show(this,this.stage.stageWidth*0.5 ,this.stage.stageHeight*0.5 -100,obj.iconSource, obj.num);
			}
			else{
				this.isRuning = false;
			}
		}
	}

	export class GoodsMessageItem extends egret.Sprite{
		public static Tween_Auto:string = 'auto';
		public static Tween_Fast:string = 'fast';

		private static caches:GoodsMessageItem[] = [];
		public static getInstance():GoodsMessageItem{
			if(GoodsMessageItem.caches.length>0){
				return GoodsMessageItem.caches.pop();
			}
			else{
				return new GoodsMessageItem();
			}
		}

		public icon:eui.Image;
		public numTf:egret.TextField;
		public constructor(){
			super();
			this.icon = new eui.Image();
			this.icon.x = -40;
			this.icon.y = - 16;
			this.addChild(this.icon);

			this.numTf =  new egret.TextField();
			this.numTf.x = 0;
			this.numTf.y = -10;
			this.numTf.size = 24;
			this.numTf.bold = true;
			this.numTf.restrict = null;
			this.numTf.fontFamily = '黑体';
			this.addChild(this.numTf); 
		}



		public show(container:egret.DisplayObjectContainer,x:number,y:number, iconSource:string,num:number,tweenType:string ='auto'){
			this.x = x;
			this.y = y;
			container.addChild(this);
			this.icon.source = RES.getRes(iconSource);
			this.numTf.visible = true;
			this.icon.x = -40;
			if(num === 0)
			{
				this.icon.x = -16;
				this.numTf.visible = false;
			}
			else if(num>0){
				this.numTf.textColor = 0x44cc44;
				this.numTf.text = '+ '+gameutils.zdlToString(num);
			}
			else{
				this.numTf.textColor = 0xcc4444;
				this.numTf.text = '- '+gameutils.zdlToString(Math.abs(num));
			}
			if(tweenType ===GoodsMessageItem.Tween_Auto)
			{
				this.startTween();
			}
			else{
				this.startTween2();
			}
		}

		private startTween():void{
				this.scaleX = 1.5;
			this.scaleY = 1.2;
			this.alpha = 0.5;
			egret.Tween.get(this).to({scaleX:1,scaleY:1,alpha:1},200).
			to({y:this.y-100},800).
			to({y:this.y-150,alpha:0},500).call(this.onComplete,this);
		}

		private startTween2():void{
			this.alpha = 0.5;
			egret.Tween.get(this).to({y:this.y-25,alpha:1},100).
			to({y:this.y-50},100).
			to({y:this.y-75,alpha:0},50).call(this.onComplete,this);
		}

		private onComplete():void{
			this.parent.removeChild(this);
			GoodsMessageItem.caches.push(this);
		}

	} 


	export var goodsMessage:GoodsMessage = new GoodsMessage;
}