module gameviews {
	export class BattleSkillText extends egret.Sprite{
		public tf:egret.TextField;
		public constructor() {
			super();
			this.tf = new egret.TextField();
			this.tf.size=30;
			this.tf.textAlign = egret.HorizontalAlign.CENTER;
			this.tf.textColor = 0xff3333;
			this.tf.fontFamily = '黑体';
			this.tf.italic = true; 
			this.tf.bold = true;
			this.tf.width = 150;
			this.addChild(this.tf);
			this.scaleX = this.scaleY = 2;
		}

		public show(container:egret.DisplayObjectContainer,x:number,y:number,text:string):void{
			container.addChild(this);
			this.x =x;
			this.y = y;
			this.tf.text= text;
			this.tf.x = -this.tf.textWidth*0.5;
			this.tf.y = -this.tf.textHeight*0.5;

			this.scaleX = 2;
			this.scaleY = 10;
			this.alpha = 0;
			egret.Tween.removeTweens(this);
			egret.Tween.get(this).to({scaleY:1,alpha:1},100).
			call(()=>{
				this.scaleX = 4;
				this.scaleY = 0.75;
			}).
			to({scaleX:2,scaleY:2},150).
			wait(1000).
			to({scaleY:4,scaleX:4,alpha:0},300).call(()=>{
				if(this.parent){
					this.parent.removeChild(this);
				}
			});
		}
	}
}