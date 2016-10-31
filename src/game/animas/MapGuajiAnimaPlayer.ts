module gameAnima 
 {
	 /**挂机背景动画播放器 */
	export class MapGuajiAnimaPlayer extends egret.Sprite{
		public static BG_MOVE:string='moveBg';
		public static BG_Static:string='staticBg';
		public static BG_Role:string='roleBg';
		public static MAXHEIGHT:number = 140;
		public bgContainer:egret.Sprite;
		private bgImages:GuajiBg[] = [];
		private roleContainer:egret.Sprite;
		private _id:string= '';
		private _runing:boolean = false;
		public constructor() {
			super();
			this.bgContainer = new egret.Sprite();
			this.addChild(this.bgContainer);
			this.roleContainer = new egret.Sprite();
			this.bgContainer.mask = new egret.Rectangle(0,0,256,MapGuajiAnimaPlayer.MAXHEIGHT);
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		}

		private onAddToStage():void{
			this.running = true;
		}

		private onRemoveFromStage():void{
			this.running = false;
		}

		public clear():void{
			if(this.roleContainer.parent){
				this.bgContainer.removeChild(this.roleContainer);
			}

			this.bgImages.forEach((item:GuajiBg)=>{
				this.bgContainer.removeChild(item);
			});
			this.bgImages.length = 0;
		}

		public resetGuajiAnima(id:string):void{
			if(this._id == id){
				return;
			}
			this._id = id;
			var guajiAnimaVo:gamevo.MapGuajiAnimaVO = gameMngers.mapGuajiAnimaMnger.getVO(id);
			guajiAnimaVo.bgs.forEach((info:gamevo.MapGuajiBgVO)=>{
				if(info.type ===MapGuajiAnimaPlayer.BG_Role)
				{
					this.bgContainer.addChild(this.roleContainer);
				}
				else{
					var bg:GuajiBg = new GuajiBg();
					bg.init(info);
					this.bgImages.push(bg);
					this.bgContainer.addChild(bg);
				}
			});
			if(!this.roleContainer.parent)
			{
				this.bgContainer.addChild(this.roleContainer);
			}
		}

		public get running():boolean{
			return this._runing;
		}
		
		public set running(value:boolean){
			if(this._runing == value) return;
			this._runing = value;
			if(this._runing)
			{
				gameutils.asynMnger.addCB(33,this.onTick,this);
			}
			else{
				gameutils.asynMnger.removeCB(this.onTick,this);
			}
		}

		private onTick():void{
			this.bgImages.forEach((item:GuajiBg)=>{
				item.move();
			});
		}
	}

	class GuajiBg extends eui.Image{
		public info:gamevo.MapGuajiBgVO;
		private moveX:number ;
		public init(info:gamevo.MapGuajiBgVO):void{
			this.moveX = 0;
			this.info = info;
			var texture:egret.Texture = RES.getRes(info.bg);
			if(this.info.type ===MapGuajiAnimaPlayer.BG_MOVE)
			{
				this.fillMode = egret.BitmapFillMode.REPEAT;
				this.width = 256*2;
				this.y = MapGuajiAnimaPlayer.MAXHEIGHT-texture.bitmapData.height;
			}
			else{
				this.fillMode = egret.BitmapFillMode.SCALE;
				this.width = 256;
				this.y = 0;
			}
			this.source = texture;
		}


		public move():void{
			if(this.info.type ===MapGuajiAnimaPlayer.BG_MOVE)
			{
				this.moveX+=1;
				this.x = -((this.moveX)%256);
			}
		}
	}
}