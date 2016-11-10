module gameCore {
	/**物品数据对象 */
	export class GoodsItemMO extends  gamevo.WithConfigVO{
		public goodsId:string='';
		public goodsNum:number = 0;

		public getConfigId():string{
			return this.goodsId;
		}

		public analysis(config:any):void{
				var xml:egret.XML = config as egret.XML;
			this.id = xml.attributes.id;
			this.goodsId = xml.attributes.goodsId;
			this.goodsNum = xml.attributes.goodsNum;
		}
		public clone():GoodsItemMO{
			var mo:GoodsItemMO = new GoodsItemMO;
			mo.goodsId = this.goodsId;
			mo.goodsNum = this.goodsNum;
			return mo;
		}
	}

	/**英雄数据对象 */
	export class HeroMO  extends gamevo.WithConfigVO{
		/**英雄配置 */
		public roleId:string;
		/**角色等级 */
		public roleLevel:number=1
		/**觉醒等级 */
		public awakenLevel:number =0;
		
		public roleVo:gamevo.RoleBaseVO
		
		private _zdlChagneTag:boolean = true;
		private _zdl:number;

		public initHero(roleId:string):void{
			this.roleId = roleId;
			this.roleLevel = 1;
			this.awakenLevel = 0;
			this._zdlChagneTag = true;
			this.roleVo = gameMngers.roleInfoMnger.getVO(this.roleId);
		}

		public get zdl():number
		{
			if(this._zdlChagneTag){
				this.resetZdl();
			}
			return this._zdl;
		} 

		public zdlChange():void{
			this._zdlChagneTag = true;
		}

		public resetZdl():void{
			this._zdlChagneTag = false;
			this._zdl = calculHeroZDL(this);
		}
		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			this.id = xml.attributes.id;
			this.roleId = xml.attributes.roleId;
			this.roleLevel = parseFloat(xml.attributes.roleLevel);
			this.awakenLevel = parseFloat(xml.attributes.awakenLevel);
			this.roleVo = gameMngers.roleInfoMnger.getVO(this.roleId);
		}

		public getConfigId():string{
			return this.roleId;
		}

	}

	/**英雄列表 */
	export class HeroBag extends BagProxyMO<HeroMO>{
	} 

	export class GoodsBag extends BagProxyMO<GoodsItemMO>{
		public constructor(){
			super();
		}
	}


	/**玩家背包管理中心 */
	export class PlayerBagMnger extends gameCore.BagManager{
		/**道具背包 */
		public daojuBag:GoodsBag;
		/**资源背包 */
		public ziyuanBag:GoodsBag;
		/**英雄列表 */
		public heroBag:HeroBag;
		/**出战列表 */
		public teamHeroBag:HeroBag;

		private allHeroBags:HeroBag[] = [];
		public constructor(){
			super();
			this.daojuBag = new GoodsBag();
			this.daojuBag.initBag('daojuBag',10,40,this)

			this.ziyuanBag = new GoodsBag();
			this.ziyuanBag.initBag('ziyuanBag',10,40,this)

			this.heroBag = new HeroBag();
			this.heroBag.initBag('heroBag',60,100,this);
			this.allHeroBags.push(this.heroBag);

			this.teamHeroBag = new HeroBag();
			this.teamHeroBag.initBag('teamHeroBag',20,20,this);
			this.allHeroBags.push(this.heroBag);
		}

		public get currentTeam():HeroBag
		{
			return this.teamHeroBag;
		}

		public removeHeroFromAllBag(mo:HeroMO){
			this.allHeroBags.forEach(bag=>{
				bag.removeItemByData(mo);
			})
		}

		public addGoods(item:GoodsItemMO):void{
			this.getBagByGoodsId(item.goodsId).pushItemByData(item);
		}

		public hasGoodsByGoodsId(GoodsId:string):boolean{
			return this.getBagByGoodsId(GoodsId).hasItemByConfigId(GoodsId);
		}

		public getGoodsByGoodsId(goodsId:string):GoodsItemMO[]
		{
			return this.getBagByGoodsId(goodsId).getItemByConfigId(goodsId);
		}

		public removeGoods(item:GoodsItemMO):void{
			this.getBagByGoodsId(item.goodsId).removeItemByData(item);
		}

		public getBagByGoodsId(goodsId:string):GoodsBag{
			var goodsInfo:gamevo.GoodsItemVO = gameMngers.goodsInfoMnger.getVO(goodsId);
			if(goodsInfo.tag === gamesystem.GoodsTag_DAOJU)
			{
				return this.daojuBag;
			}
			else{
				return this.ziyuanBag;
			}
		}

		public getBagByTag(bagTag:string):GoodsBag{
			if(bagTag ===gamesystem.GoodsTag_DAOJU)
			{
				return this.daojuBag;
			}
			else{
				return this.ziyuanBag;
			}
		}
	}

	export class MapMO extends gamevo.BaseVO{

		public mapId:number = 0;
		/**当前地图通关最大关卡 */
		public maxMapChild:number = 0;
		/**当前地图通关最大难度 */
		public maxMapLevel:number = 0;
		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			this.id = xml.attributes.id;
			this.mapId = parseFloat(this.id);
			this.maxMapChild = parseFloat(xml.attributes.maxMapChild);
			this.maxMapLevel = parseFloat(xml.attributes.maxMapLevel);

		}

		public init(mapId:number):void{
			this.id = mapId+'';
			this.mapId = mapId;
			this.maxMapChild = 0;
			this.maxMapLevel = 0;
		}

		public get mapVo():gamevo.MapVO{
			return gameMngers.mapInfoMnger.getVO(this.id);
		}
	}

	/**玩家数据对象 */
	export class PlayerMO  implements gamevo.IbaseVO{
		public playerBagMnger:PlayerBagMnger = new PlayerBagMnger();
		/**用户唯一id */
		public id:string='';
		/**用户名称 */
		public name:string = '';
		/**金币 */
		public gold:number = 0;
		/**经验 */
		public exp:number = 0;
		/**人民币 */
		public money:number = 0;
		/** 当前地图id*/
		public curMap:number = 1;
		/**当前地图难度 */
		public curMapLevel:number = 1;
		/**当前地图子关卡 */
		public curMapChild:number = 1;
		/**当前地图状态[0:1:挂机完成，准备战斗，2：战斗结束] */
		public curMapStatus:number = 0;
		/**挂机地图开始的时间戳 */
		public curMapGuajiTime:number = 0;
		/**下线的时间点//用于计算上线后经验值增长 */
		public offlineTime:number = 0;
		/**队伍列表 */
		public teamHeros:string[];
		private mapMOs:MapMO[] = [];
		private _zdlChagneTag:boolean = true;
		private _zdl:number = 0;
		private _buffChangeTag:boolean = true;
		private _buff:gamevo.BuffVO = new gamevo.BuffVO;
		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			this.id = xml.attributes.id;
			this.gold = parseFloat(xml.attributes.gold);
			this.name = xml.attributes.name;
			this.exp = parseFloat(xml.attributes.exp);
			this.money = parseFloat(xml.attributes.money);
			this.curMap = parseFloat(xml.attributes.curMap);
			this.curMapLevel = parseFloat(xml.attributes.curMapLevel);
			this.curMapChild = parseFloat(xml.attributes.curMapChild);
			this.curMapStatus = parseFloat(xml.attributes.curMapStatus);
			this.curMapGuajiTime = parseFloat(xml.attributes.curMapGuajiTime);
			this.offlineTime = parseFloat(xml.attributes.offlineTime);
			gameutils.XMLUtil.foreachChild(xml,'heros',(item)=>{
				var heroMO:HeroMO = new HeroMO;
				heroMO.analysis(item);
				this.addHero(heroMO);
			});

			gameutils.XMLUtil.foreachChild(xml,'daoju',(item)=>{
				var goodsItem:GoodsItemMO = new GoodsItemMO;
				goodsItem.analysis(item);
				this.playerBagMnger.addGoods(goodsItem);
			});

			gameutils.XMLUtil.foreachChild(xml,'ziyuan',(item)=>{
				var goodsItem:GoodsItemMO = new GoodsItemMO;
				goodsItem.analysis(item);
				this.playerBagMnger.addGoods(goodsItem);
			});

			gameutils.XMLUtil.foreachChild(xml,'map',(item)=>{
				var mapmo:MapMO = new MapMO;
				mapmo.analysis(item);
				this.mapMOs[mapmo.mapId] = mapmo;
			});

			this.resetTeamHeros( gameutils.XMLUtil.toStringArray(xml,'teamHeros'));
		}

		public resetTeamHeros(ids:string[]):void{
			this.teamHeros = ids;
			this.playerBagMnger.teamHeroBag.clearItem();
			this.teamHeros.forEach(id=>{
				this.playerBagMnger.teamHeroBag.pushItemByData(this.playerBagMnger.heroBag.getItemById(id));
			});
		}

		public getAllHero(isConcat:boolean = true):HeroMO[]{
			return isConcat?this.playerBagMnger.heroBag.allItems.concat():this.playerBagMnger.heroBag.allItems;
		}

		public getAllTeamHero(isConcat:boolean = true):HeroMO[]{
			return isConcat?this.playerBagMnger.teamHeroBag.allItems.concat():this.playerBagMnger.teamHeroBag.allItems;
		}


		/**添加英雄 */
		public addHero(mo:HeroMO){
			this.playerBagMnger.heroBag.pushItemByData(mo);
		}

		/**移除英雄 */
		public removeHero(mo:HeroMO)
		{
			this.playerBagMnger.removeHeroFromAllBag(mo);
		}

		public createHeroId():string{
			var i:number =1;
			while(true){
				if(!this.playerBagMnger.heroBag.hasItemById(i+'')){
					break;
				}
				i++;
			}
			return i+'';
		}

		public createGoodsId():string{
			var i:number =1;
			while(true){
				if(!this.playerBagMnger.daojuBag.hasItemById(i+'') && !this.playerBagMnger.ziyuanBag.hasItemById(i+'')){
					break;
				}
				i++;
			}
			return i+'';
		}


		/**总战力 */
		public get totalZDL():number{
			if(this._zdlChagneTag)
			{
				this._zdlChagneTag = false;
				this._zdl =calculAllHeroZDL(this.getAllTeamHero());
			}
			return this._zdl;
		}

		public get buff():gamevo.BuffVO{
			if(this._buffChangeTag){
				this._buffChangeTag = false;
				calculAllHeroBuff(this.getAllTeamHero(),this.buff)
			}
			return this._buff;
		}


		public zdlChange():void{
			this._zdlChagneTag = true;
		}

		public buffChange():void{
			this._buffChangeTag = true;
		}



		public getMapMO(id:number):MapMO{
			return this.mapMOs[id];
		}

		public pushMapMo(mo:MapMO):void{
			this.mapMOs[mo.mapId] = mo;
		}

		public get currentMO():MapMO{
			return this.getMapMO(this.curMap);
		}


		/**通关的至最大的地图 */
		public get maxMapId():number{
			var mapMo:MapMO = this.mapMOs[this.mapMOs.length -1];
			//如果通过难度大于0，表示该地图已经通关一遍了。
			return mapMo.maxMapLevel >0?mapMo.mapId+1:mapMo.mapId;
		}
	}
}