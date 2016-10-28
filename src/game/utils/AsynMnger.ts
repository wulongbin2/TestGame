module gameutils {
	/**异步管理 */
	export class AsynMnger {
		private _runing:boolean = false;
		private _cbs:CallBackInfo[] =[];
		private _time:number = 0;
		private _lastTime:number = 0;
		public constructor() {
		}

		public set running(value:boolean){
			this._runing = value;
			if(this._runing)
			{
				this._lastTime = egret.getTimer(); 
				egret.startTick(this.onTick,this);
			}
			else{
				egret.stopTick(this.onTick,this);
			}
		}

		private onTick(time:number):boolean{
			var nowTime:number = egret.getTimer();
			var offTime:number  = nowTime - this._lastTime;
			this._time+=offTime;
			this._lastTime = nowTime;
			var i:number = 0;
			//cbs长度在循环中可能增长或建少
			for(;i < this._cbs.length;i++)
			{
				var cbInfo:CallBackInfo = this._cbs[i];
				if(cbInfo.dispose)
				{
					this._cbs.splice(i,1);
					i--;
				}
				else{
					if(this._time>=cbInfo.nextTime)
					{
						cbInfo.nextTime+=cbInfo.tickTime;
						cbInfo.cb.apply(cbInfo.thisObj);
					}
				}
			}
			return false;
		}

		public get running():boolean
		{
			return this._runing;
		}

		public addCB(tickTime:number,cb:()=>void,thisObj:any):void{
			var oldInfo:CallBackInfo;
			this._cbs.forEach(item=>{
				if(item.cb === cb &&item.thisObj===thisObj)
				{
					oldInfo = item;
				}
			});
			if(!oldInfo)
			{
				oldInfo = new CallBackInfo;
				oldInfo.init(tickTime,cb,thisObj);
				this._cbs.push(oldInfo);
			}
			oldInfo.dispose = false;
			oldInfo.nextTime = this._time+oldInfo.tickTime;
		}

		public removeCB(cb:()=>void,thisObj:any){
			var i:number = 0;
			var len:number = this._cbs.length;
			for(; i < len;i++)
			{
				var cbInfo:CallBackInfo = this._cbs[i];
				if(cbInfo.cb === cb && cbInfo.thisObj === thisObj)
				{
					cbInfo.dispose = true;
					break;
				}
			}
		}
	}

	class CallBackInfo{
		public cb:()=>void;
		public thisObj:any;
		public tickTime:number;
		public nextTime:number;
		public dispose:boolean = false;
		public init(tickTime:number,cb:()=>void,thisObj:any):void{
			this.cb = cb;
			this.thisObj = thisObj;
			this.tickTime = tickTime;
		}
	}

	export var asynMnger:AsynMnger = new AsynMnger;
}