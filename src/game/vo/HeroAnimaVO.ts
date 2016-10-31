module gamevo {
	export class HeroAnimaVO extends BaseVO{
		private _heroAnimas:gameAnima.AnimaInfo[] = [];
		public width:number;
		public height:number;
		public cellWidth:number;
		public cellHeight:number;
		public sourceUrl:string;
		public weaponUrl:string;
		private spritesheet:egret.SpriteSheet;
		private _isLoad:number = 0;
		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			this.id = xml.attributes.id;
			this.width = parseInt(xml.attributes.width);
			this.height = parseInt(xml.attributes.height);
			this.cellWidth = this.width/HeroAnimaVO.WN;
			this.cellHeight = this.height/HeroAnimaVO.HN;
			this.sourceUrl =gamesystem.Url_AnimaHero+this.id+'.png'
			this.weaponUrl = gamesystem.Url_WeaponIcon+this.id+'.png'
			this.createAnimaInfo(gamesystem.AnimaDownStand,1);
			this.createAnimaInfo(gamesystem.AnimaLeftStand,1);
			this.createAnimaInfo(gamesystem.AnimaRightStand,1);
			this.createAnimaInfo(gamesystem.AnimaUpStand,1);

			this.createAnimaInfo(gamesystem.AnimaDownWalk,2);
			this.createAnimaInfo(gamesystem.AnimaLeftWalk,2);
			this.createAnimaInfo(gamesystem.AnimaRightWalk,2);
			this.createAnimaInfo(gamesystem.AnimaUpWalk,2);
		}


		public get heroAnimas():gameAnima.AnimaInfo[]{
			if(this._isLoad ===0)
			{
				this.load();
			}
			return this._heroAnimas;
		}

		private load():void{
			this._isLoad =1;
			RES.getResByUrl(this.sourceUrl,this.onComplete,this);
		}

		public sourceBit:egret.Texture;
		public static  WN:number = 3;
		public static  HN:number = 4;
		private onComplete(bit:egret.Texture):void{
			this.sourceBit = bit;
			this.spritesheet = new egret.SpriteSheet(bit);
			var bits:egret.Texture [] = [];
			var w:number = bit.bitmapData.width;
			var h:number = bit.bitmapData.height;
			var wu:number = w/HeroAnimaVO.WN;
			var hu:number = h/HeroAnimaVO.HN;
			for(var i:number = 0;i < HeroAnimaVO.HN;i++)
			{
				for(var j:number = 0;j < HeroAnimaVO.WN;j++)
				{
					bits.push(this.spritesheet.createTexture(j+"_"+i,j*wu,i*hu,wu,hu,0,0));
				}
			}
			this.resetAnimaInfo(bits,0,1);
			this.resetAnimaInfo(bits,1,4);
			this.resetAnimaInfo(bits,2,7);
			this.resetAnimaInfo(bits,3,10);

			this.resetAnimaInfo(bits,4,0,true);
			this.resetAnimaInfo(bits,5,3,true);
			this.resetAnimaInfo(bits,6,6,true);
			this.resetAnimaInfo(bits,7,9,true);
		}

		private createAnimaInfo( name:string,length:number):void
		{
			var info:gameAnima.AnimaInfo = new gameAnima.AnimaInfo();
			info.frameRate = 2;
			info.totalFrame = length;
			info.id = name;
			var bits:egret.Texture[] = [];
			for(var i:number =0;i < length;i++)
			{
				bits.push(null);
			}
			info.bitmapDatas = bits;
			this.heroAnimas.push(info);
		}

		private resetAnimaInfo(sourceBits:egret.Texture[],index:number, fromIndex:number,isWalk:boolean = false):void
		{
			var info:gameAnima.AnimaInfo =this._heroAnimas[index];
			var bits:egret.Texture[] = info.bitmapDatas;
			var endIndex:number = fromIndex + info.totalFrame;
			bits[0] = sourceBits[fromIndex];
			if(isWalk)
			{
				bits[1] =sourceBits[fromIndex+2];
			}
		}
	}
}