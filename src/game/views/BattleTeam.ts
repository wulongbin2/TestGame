module gameviews {
	export class BattleTeam extends egret.Sprite {
		public heroPlayers:gameAnima.HeroAnimaPlayer[] = [];
		public resetHeros(heros:gameCore.HeroMO[]):void{
			var oldLen:number =this.heroPlayers.length; 
			var i:number ;
			var len:number = heros.length;
			for(i = oldLen;i <len;i++){
				var obj = gamesystem.indexToZhen[i];
				var player:gameAnima.HeroAnimaPlayer = new gameAnima.HeroAnimaPlayer();
				player.isShowShadow = true;
				player.scale = 2;
				player.frameCoe = 0.75;
				player.x = obj.mapX*70;
				player.y = obj.mapY*70;
				this.heroPlayers.push(player);
				this.addChild(player);
			}
			for(i = len;i <oldLen; i ++){
				player = this.heroPlayers[i];
				this.removeChild(player);
			}
			this.heroPlayers.length = len;
			for(i = 0;i <len;i++){
				player = this.heroPlayers[i];
				player.resetAnimaSource(heros[i].roleVo.animaSource);
				player.playAnimaById(gamesystem.AnimaRightWalk);
			}
			this.yy = 0;
			this.updateSort();
		}

		public playAnimaById(id:string){
			this.heroPlayers.forEach(item=>{
				item.playAnimaById(id);
			})
		}

		private _yy:number = 0;
		public get yy():number{
			return this._yy;
		}

		public set yy(value:number){
			this._yy = value;
			var i:number = 0;
			var len:number = this.heroPlayers.length;
			for(i = 0;i <len;i++){
				var player:gameAnima.HeroAnimaPlayer = this.heroPlayers[i];
				player.yy = value;
			}
		}

		public  updateSort():void
		{
			var len:number=this.numChildren;
			var i:number=1;
			var j:number;
			var nowDisplsy:egret.DisplayObject;
			for(;i<len;i++)
			{
				nowDisplsy=this.getChildAt(i);
				for(j=i-1;j>-1;j--)
				{
					if(nowDisplsy.y<this.getChildAt(j).y)
					{
						this.swapChildrenAt(j,j+1);
					}
					else break;
				}
			}
		}
	}
}