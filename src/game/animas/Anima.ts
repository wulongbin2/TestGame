module gameAnima {
	/**动画信息 */
	export class AnimaInfo extends gamevo.BaseVO{
		/**动画帧图片 */
		public bitmapDatas:egret.Texture[];
		/**动画帧长度 */
		public totalFrame:number;
		/**动画帧频 */
		public frameRate:number;
		/**是否循环播放 */
		public isLoop:boolean;

		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			this.id = xml.attributes.id;
			this.totalFrame = parseFloat(xml.attributes.totalFrame);
			this.frameRate = parseFloat(xml.attributes.frameRate);
			this.isLoop = xml.attributes.isLoop;
			this.bitmapDatas = [];
			for(var i:number=0;i < this.totalFrame;i++)
			{
				this.bitmapDatas.push(null);
			}
		}
	}

	/**特性配置 */
	export class EffectAnimaInfo extends AnimaInfo{
		/**位图宽度 */
		public frameWidth:number;
		/**位图高度 */
		public frameHeight:number;
		/**位图资源路径 */
		public source:string;
		public analysis(config:any):void{
			super.analysis(config);
			var xml:egret.XML = config as egret.XML;
			this.frameRate = xml.attributes.frameRate?parseFloat(xml.attributes.frameRate):gamesystem.Auto_EffectFrameRate;
			this.isLoop = xml.attributes.isLoop?xml.attributes.isLoop==='true':gamesystem.Auto_IsLoop;
			this.frameWidth = xml.attributes.frameWidth?parseFloat(xml.attributes.frameWidth):gamesystem.Auto_FrameWidth;
			this.frameHeight = xml.attributes.frameHeight?parseFloat(xml.attributes.frameHeight):gamesystem.Auto_FrameHeight;
			this.source =gamesystem.Url_AnimaEffect+this.id+'.png';
		}

		private _isLoad:number = 0;
		public checkload():void{
			if(this._isLoad === 0)
			{
				this._isLoad =1;
				RES.getResByUrl(this.source,this.onComplete,this);
			}
		}

		private spritesheet:egret.SpriteSheet;
		private onComplete(sourceBit:egret.Texture):void{
			this.spritesheet = new egret.SpriteSheet(sourceBit);
			var w:number = sourceBit._bitmapWidth
			var h:number = sourceBit._bitmapHeight;
			var wn:number = w/this.frameWidth;
			var hn:number = h/this.frameHeight;
			var num:number = 0;
			for(var i:number = 0;i < hn;i++)
			{
				for(var j:number = 0;j <wn;j++)
				{
					if(num<this.totalFrame)
					{
						this.bitmapDatas[num] = (this.spritesheet.createTexture(j+"_"+i,j*this.frameWidth,i*this.frameHeight,this.frameWidth,this.frameHeight,0,0));
						num++;
					}	
					else{
						break;
					}
				}
			}
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
		private _isLoop:boolean = false;
		public frameCoe:number = 1;
		public constructor(){
			super();
			this.bitmap = new eui.Image();
			this.addChild(this.bitmap);
		}


		public play(info:AnimaInfo,isLoop?:boolean):void{
			this._animaInfo = info;
			this._isLoop = isLoop ===void 0?this._animaInfo.isLoop:isLoop;
			this._totalFrame = info.totalFrame;
			this._tickTime = 1000/info.frameRate*this.frameCoe;
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

		private _oldTickTime:number = 0;
		public set isRun(value:boolean){
			if(this._isRun === value && this._oldTickTime == this._tickTime)  return;
			this._isRun = value;
			if(this._isRun)
			{
				this._oldTickTime = this._tickTime;
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

		protected onTick():void{
			this.currentFrame ++;
			/**资源已经加载好，且不循环则停止 */
			if(this.bitmap.source &&this.currentFrame==0&& !this._isLoop)
			{
				this.isRun = false;
				this.dispatchEventWith(egret.Event.COMPLETE);
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
		private _otherScale:number = 1;
		public set otherScale(value:number){
			this._otherScale = value;
			this.scale = this.scale;
		}

		public get otherScale():number{
			return this._otherScale;
		}
		public enabledOtherScale:boolean = false;

		private _scale:number = 1;
		public set scale(value:number){
			this._scale = value;
			if(this.enabledOtherScale)
			{
				this.scaleX = this.scaleY = value*this.otherScale;
			}
			else{
				this.scaleX = this.scaleY = value;
			}
		}

		public get scale():number{
			return this._scale;
		}
	}

	/**特性播放器 */
	export class EffectAnimaPlayer extends AnimaPlayer{
		public playAnimaByEffectId(id:string,isLoop?:boolean):void{
			var vo:EffectAnimaInfo = gameMngers.effectAnimaMnger.getVO(id); 
			this.bitmap.x = -vo.frameWidth*0.5;
			this.bitmap.y = -vo.frameHeight*0.5;
			this.play(vo,isLoop);
		}
	}

	/**游戏英雄专用播放器 */
	export class HeroAnimaPlayer extends AnimaPlayer
	{
		private _shadow:eui.Image = new eui.Image;
		private _animaInfos:{[name:string]:AnimaInfo};
		private _heroAnimaInfo:gamevo.HeroAnimaVO;

		public constructor(){
			super();
			this.scale = 2.2;
			this.bitmap.smoothing = false;
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemoveFromStage,this);
			this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddStage,this)
			this.addChildAt(this._shadow,0);
			this._shadow.visible =false;
			this._shadow.scaleY = 0.25;
			this._shadow.scaleX = 0.5;
			this._shadow.x = -12;
			this._shadow.y = -6;
			this._shadow.alpha = 0.5;
			this._shadow.source = RES.getRes('round_bg_png');

		}

		public set isShowShadow(value:boolean){
			this._shadow.visible = value;
		}


		private onRemoveFromStage():void{
			this.isRun = false;
		}

		private onAddStage():void{
			this.isRun = true;
		}

		public addAnimaInfo(info:AnimaInfo):void{
			this._animaInfos[info.id] = info;
		}

		public resetAnimaSource(value:string){
			this._animaInfos={};
			this._heroAnimaInfo = gameMngers.heroAnimaInfoMnger.getVO(value);
			if(this._heroAnimaInfo)
			{
				this.bitmap.x = -this._heroAnimaInfo.cellWidth*0.5;
				this.updateBitmapY();
				this.otherScale = 32/this._heroAnimaInfo.cellHeight;
				this._heroAnimaInfo.heroAnimas.forEach(item=>this.addAnimaInfo(item));
				this.playAnimaById(gamesystem.AnimaDownStand);
			}
			else{
				this.clear();
			}
		}

		public playAnimaById(id:string,isLoop?:boolean):void{
			this.play(this._animaInfos[id],isLoop);
		}

		private _yy:number = 0;
		public set yy(value:number){
			this._yy = value;
			this.updateBitmapY();
		}

		private updateBitmapY():void{
			if(this._heroAnimaInfo)
			{
				this.bitmap.y = -this._heroAnimaInfo.cellHeight+this._yy;
			}
		}

		public get yy():number{
			return this._yy;
		}
	}
}