module gameviews {
	export class BattleHurtText extends egret.Sprite{
		public numTf:egret.TextField;
		public constructor(){
			super();
			this.numTf =  new egret.TextField();
			this.numTf.x = 0;
			this.numTf.y = -10;
			this.numTf.size = 60;
			this.numTf.bold = true;
			this.numTf.fontFamily = '黑体';
			this.addChild(this.numTf); 
		}

		public show(container:egret.DisplayObjectContainer,x:number,y:number,num:number):void{
			container.addChild(this);
			this.x =x;
			this.y = y;
			if(num>0){
				this.numTf.text = '+ '+num;
				this.numTf.textColor = 0x44cc44;
			}
			else{
				this.numTf.text ='- '+Math.abs(num);
				this.numTf.textColor = 0xcc4444;
			}

			this.numTf.x = -this.numTf.textWidth*0.5;
			this.numTf.y = -this.numTf.textHeight*0.5;

			this.scaleX = 1;
			this.scaleY = 10;
			egret.Tween.get(this).to({scaleY:1},100).
			call(()=>{
				this.scaleX = 2;
				this.scaleY = 0.75;
			}).
			to({scaleX:1,scaleY:1},150).
			wait(500).
			to({y:this.y-200,alpha:0},300).
			call(()=>{
				this.parent.removeChild(this);
			});
		}
	}
}