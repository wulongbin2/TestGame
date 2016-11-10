module gameutils {
	export class Shock {
		private oldX:number;
		private oldY:number;
		private offX:number;
		private time:number;
		private totalTime:number;
		private target:egret.DisplayObject;
		private timeSpace:number = 50;
		public start(target:egret.DisplayObject,offX:number,time:number,timeSpace:number = 50):void{
			this.timeSpace = timeSpace;
			this.target = target;
			this.oldX = target.x;
			this.oldY = target.y;
			this.offX = offX;
			this.totalTime = Math.round(time/this.timeSpace);
			this.time =0;
			gameutils.asynMnger.addCB(this.timeSpace,this.onTick,this);
		}	

		private onTick():void{
			if(this.time<this.totalTime)
			{
				this.time++;
				if(this.time%8<4)
				{
					this.target.y = this.oldY;
					if(this.time%2 ==0)
					{
						this.target.x = this.oldX + this.offX;
					}
					else{
						this.target.x = this.oldX -this.offX;
					}
				}
				else{
					this.target.x = this.oldX;
					if(this.time%2 ==0)
					{
						this.target.y = this.oldY + this.offX;
					}
					else{
						this.target.y = this.oldY -this.offX;
					}
				}
			}
			else
			{
				this.target.x = this.oldX;
				this.target.y = this.oldY;
				gameutils.asynMnger.removeCB(this.onTick,this);
			}
		}

	
	}
}