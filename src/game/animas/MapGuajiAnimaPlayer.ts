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
		private _heroPlayers:SelfRole[] = [];
		private _enemlyPlayers:EnemyRole[] = [];
		private _enemlyPlayersInStage:EnemyRole[] = [];
		private selfHeroMO:gameCore.HeroMO[];
		private enemyHeroIds:string[];
		private showSelfNum:number;
		private selfShowHeroMO:gameCore.HeroMO[] = [];
		private time:number = 0;
		private effectPlayer:gameAnima.EffectAnimaPlayer;
		public constructor() {
			super();
			this.bgContainer = new egret.Sprite();
			this.addChild(this.bgContainer);
			this.roleContainer = new egret.Sprite();
			this.bgContainer.mask = new egret.Rectangle(0,0,256,MapGuajiAnimaPlayer.MAXHEIGHT);
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
			this.effectPlayer = new gameAnima.EffectAnimaPlayer();
			this.effectPlayer.alpha = 0.5;
			this.effectPlayer.x = 128;
			this.effectPlayer.y = 70;
			this.effectPlayer.blendMode = egret.BlendMode.ADD;
			this.effectPlayer.addEventListener(egret.Event.COMPLETE,this.effectComplete,this)
			this.addChild(this.effectPlayer);
			for(var i:number = 0;i <5;i++){
				var player:SelfRole = new SelfRole();
				player.x = 15+i*26;
				player.y  = 105;
				this._heroPlayers.push(player);
			}

			for(i = 0;i <8;i++){
				this._enemlyPlayers.push( new EnemyRole());
			}
		}

		private effectComplete():void{
			this.effectPlayer.visible = false;
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
			//更换挂机动画背景
			if(this._id !== id){
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
			this._id = id;
			//重置角色
			this.resetRoles();
			this.time = 0;
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

		private resetRoles():void{
			this._heroPlayers.forEach(item=>{
				if(item.parent)
				{
					item.parent.removeChild(item);
				}
			});

			this._enemlyPlayersInStage.forEach(item=>{
				if(item.parent)
				{
					item.parent.removeChild(item);
				}
				this._enemlyPlayers.push(item);
			});
			this.effectPlayer.visible = false;
			var mapVo:gamevo.MapVO = gameMngers.mapInfoMnger.getVO(gameCore.currentUserInfo.curMap+'');
			this.enemyHeroIds = mapVo.useRoleIds
			this._enemlyPlayersInStage.length = 0;
			this.selfShowHeroMO.length = 0;
			this.selfHeroMO = gameCore.currentUserInfo.getAllTeamHero();
			this.showSelfNum = Math.min(this._heroPlayers.length,this.selfHeroMO.length);
			for(var i:number = 0;i <this.showSelfNum ;i++)
			{
				this.addSelfRole(this._heroPlayers.length -i -1);
			}
		}

		private addSelfRole(index:number,isReplace:boolean = false):void{
			var r:number = Math.floor(Math.random()*this.selfHeroMO.length);
			var mo:gameCore.HeroMO = this.selfHeroMO[r];
			this.selfHeroMO.splice(r,1);
			if(isReplace)
			{
				this._heroPlayers[index].resetHero(mo);
			}
			else{
				this._heroPlayers[index].initHero(mo);
				this.roleContainer.addChild(this._heroPlayers[index]);

			}
		}

		private seltChangeRoleTime:number = 60;
		private enemyCreateRoleTime:number = 15;
		private onTick():void{
			this.time++;
			this.bgImages.forEach((item:GuajiBg)=>{
				item.move();
			});
			for(var i:number = this._enemlyPlayersInStage.length-1;i >=0;i--)
			{
				var enemy:EnemyRole = this._enemlyPlayersInStage[i];
				enemy.tick();
				if(enemy.needRemove){
					this.roleContainer.removeChild(enemy);
					this._enemlyPlayersInStage.splice(this._enemlyPlayersInStage.indexOf(enemy),1);
					this._enemlyPlayers.push(enemy);
				}
				if(enemy.isChange && this.effectPlayer.visible === false){
					this.effectPlayer.visible = true;
					this.effectPlayer.playAnimaByEffectId('daoguang002',false);
				}
			}

			if(this.time%this.seltChangeRoleTime ===0)
			{
				if(Math.random()>0.5)
				{
					this.changeSelfRole();
				}
			}

			if(this.time%this.enemyCreateRoleTime ===0)
			{
				if(Math.random()>0.5)
				{
					this.createEnemeyRole();
				}
			}
		}

		private changeSelfRole():void{
			var index:number =this._heroPlayers.length -  Math.floor(this.showSelfNum*Math.random()) -1;
			var player:SelfRole = this._heroPlayers[index];
			this.selfHeroMO.push(player.mo);
			this.addSelfRole(index,true);
		}

		private createEnemeyRole():void{
			if(this._enemlyPlayers.length>0){
				var player:EnemyRole = this._enemlyPlayers.pop();
				var r:number = Math.floor(Math.random()*this.enemyHeroIds.length);
				player.initHero(this.enemyHeroIds[r]);
				this.roleContainer.addChild(player);
				this._enemlyPlayersInStage.push(player);
			}
		}
	}



	class SelfRole extends gameAnima.HeroAnimaPlayer{
		public mo:gameCore.HeroMO
		public initHero(mo:gameCore.HeroMO){
			this.mo = mo;
			this.resetAnimaSource(mo.roleVo.animaSource);
			this.playAnimaById(gamesystem.AnimaRightWalk);
			this.scale = 1;
			this.isShowShadow = true;
		}

		private isReadyChange:boolean = false;
		public resetHero(mo:gameCore.HeroMO){
			this.isReadyChange = true;
			this.mo = mo;
			this.playAnimaById(gamesystem.AnimaLeftTurn,false);
		}

		protected onTick():void{
			super.onTick();
			if(this.isReadyChange && this.isRun === false){
				this.isReadyChange = false;
				this.initHero(this.mo);
			}
		}
	}

	class EnemyRole extends gameAnima.HeroAnimaPlayer{
		public isLeave:boolean = false;
		public leaveTime:number;
		public needRemove:boolean = false; 
		public speed:number;
		public initHero(roleId:string){
			this.isLeave = false;
			this.needRemove = false;
			this.resetAnimaSource(gameMngers.roleInfoMnger.getVO(roleId).animaSource);
			this.playAnimaById(gamesystem.AnimaLeftWalk);
			this.scale = 1;
			this.x = 270;
			this.y = 105;
			this.yy = 0;
			this.speed  =1 + Math.floor(3*Math.random());
			this.isChange = false;
			this.isShowShadow = true;
		}

		public isChange:boolean;
		public tick():void{
			if(this.isLeave){
				this.isChange = false;
				this.x +=1;
				this.yy =  - 40*Math.sin((this.leaveTime%60)/60*Math.PI);
				this.leaveTime++;
				if(this.x>270)
				{
					this.needRemove = true;
				}
			}
			else{
				this.x -=this.speed;
				if(this.x <= 138){
					this.isChange = true;
					this.leaveTime = 0;
					this.isLeave = true;
					this.playAnimaById(gamesystem.AnimaRightTurn);
				}
			}
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
				this.y = MapGuajiAnimaPlayer.MAXHEIGHT-texture._bitmapHeight;
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