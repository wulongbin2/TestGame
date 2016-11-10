module gameviews {
	export class BattleResult extends egret.Sprite{
		public numTf:egret.TextField;
		public constructor() {
			super();
			this.numTf =  new egret.TextField();
			this.numTf.x = 0;
			this.numTf.y = -10;
			this.numTf.size = 100;
			this.numTf.bold = true;
			this.numTf.fontFamily = '黑体';
			this.addChild(this.numTf); 
		}
		public show(container:egret.DisplayObjectContainer,x:number,y:number,isWin:boolean,cb:()=>void):void{
			container.addChild(this);
			this.numTf.text = isWin?'战斗胜利':'战斗失败';
			this.numTf.textColor= isWin?0xcc4444:0xaaaaaa;
			this.numTf.x = -this.numTf.textWidth*0.5;
			this.y = y;
			this.x = x;
			if(isWin){
				this.scaleX = this.scaleY = 2;
				this.alpha = 0;
				egret.Tween.get(this).to({scaleX:1,scaleY:1,alpha:1},300).call(cb);
			}
			else{
				this.scaleX = this.scaleY = 1;
				egret.Tween.get(this).to({alpha:1},2000).call(cb);
			}
		}
	}
}