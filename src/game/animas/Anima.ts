module gameAnima {
	/**动画信息 */
	export class AnimaInfo {
		/**动画名称 */
		public id:string;
		/**动画帧图片 */
		public bitmapDatas:egret.Texture[];
		/**动画帧长度 */
		public totalFrame:number;
		/**动画帧频 */
		public frameRate:number;
		public constructor() {
		}

		/**是否循环播放 */
		public get isLoop():boolean{
			return this.bitmapDatas.length>0;
		}
	}

	/**动画播放器 */
	export class AnimaPlayer extends egret.Sprite
	{
		protected bitmap:eui.Image;
		private _animaInfo:AnimaInfo;
		private _currentFrame:number =0 ;
		private _totalFrame:number =0;
		private _tickTime:number;
		private _isRun:boolean = false;
		public constructor(){
			super();
			this.bitmap = new eui.Image();
			this.addChild(this.bitmap);
		}

		public play(info:AnimaInfo):void{
			this._animaInfo = info;
			this._totalFrame = info.totalFrame;
			this._tickTime = 1000/info.frameRate;
			this.currentFrame = 0;
			this.isRun = true;
		}

		public clear():void{
			this.isRun = false;
			this._animaInfo = null;
			this.bitmap.source = null;
		}

		public get isRun():boolean
		{
			return this._isRun;
		}

		public set isRun(value:boolean){
			if(this._isRun === value)  return;
			this._isRun = value;
			if(this._isRun)
			{
				gameutils.asynMnger.addCB(this._tickTime,this.onTick,this);
			}
			else{
				gameutils.asynMnger.removeCB(this.onTick,this);
			}
		}

		public get currentFrame():number{
			return this._currentFrame;
		}

		public set currentFrame(value:number){
			this._currentFrame = value%this._totalFrame;
			this.render();
		}

		private onTick():void{
			this.currentFrame ++;
			/**资源已经加载好，且不循环则停止 */
			if(this.bitmap.source && !this._animaInfo.isLoop)
			{
				this.isRun = false;
			}
		}

		public render():void{
			if(this._animaInfo)
			{
				this.bitmap.source = this._animaInfo.bitmapDatas[this._currentFrame];
			}
			else{
				this.bitmap.source = null;
			}
		}

		public stop():void{
			this.isRun = false;
		}
	}

	/**游戏英雄专用播放器 */
	export class HeroAnimaPlayer extends AnimaPlayer
	{
		private _animaInfos:{[name:string]:AnimaInfo};
		private _heroAnimaInfo:gamevo.HeroAnimaVO;

		public constructor(){
			super();
			this.scale = 2.2;
			this.bitmap.smoothing = false;
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemoveFromStage,this)
		}

		private onRemoveFromStage():void{
			this.isRun = false;
		}

		public addAnimaInfo(info:AnimaInfo):void{
			this._animaInfos[info.id] = info;
		}

		public setHeroId(value:string){
			this._animaInfos={};
			this._heroAnimaInfo = gameMngers.heroAnimaInfoMnger.getVO(value);
			if(this._heroAnimaInfo)
			{
				this.bitmap.x = -this._heroAnimaInfo.cellWidth*0.5;
				this.bitmap.y = -this._heroAnimaInfo.cellHeight;
				this._heroAnimaInfo.heroAnimas.forEach(item=>this.addAnimaInfo(item));
				this.playAnimaById(gamesystem.AnimaDownStand);
			}
			else{
				this.clear();
			}
		}

		public playAnimaById(id:string):void{
			this.play(this._animaInfos[id]);
		}

		public set scale(value:number){
			this.scaleX = this.scaleY = value;
		}
	}
}