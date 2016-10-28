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
	}

	/**英雄数据对象 */
	export class HeroMO  extends gamevo.WithConfigVO{
		/**英雄配置 */
		public roleId:string;
		/**角色等级 */
		public roleLevel:number=1
		/**觉醒等级 */
		public awakenLevel:number = 1;

		public get zdl():number
		{
			return 0;
		} 
		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			this.id = xml.attributes.id;
			this.roleId = xml.attributes.roleId;
			this.roleLevel = parseFloat(xml.attributes.roleLevel);
			this.awakenLevel = parseFloat(xml.attributes.awakenLevel);
		}

		public getConfigId():string{
			return this.roleId;
		}
	}

	/**英雄列表 */
	export class HeroBag extends BagProxyMO<HeroMO>{
	} 

	export class GoodsBag extends BagProxyMO<GoodsItemMO>{
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
			this.heroBag.initBag('heroBag',50,100,this);
			this.allHeroBags.push(this.heroBag);

			this.teamHeroBag = new HeroBag();
			this.teamHeroBag.initBag('teamHeroBag',10,20,this);
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
			if(goodsInfo.tag === gamevo.GoodsItemVO.Tag_DAOJU)
			{
				return this.daojuBag;
			}
			else{
				return this.ziyuanBag;
			}
		}

		public getBagByTag(bagTag:string):GoodsBag{
			if(bagTag === gamevo.GoodsItemVO.Tag_DAOJU)
			{
				return this.daojuBag;
			}
			else{
				return this.ziyuanBag;
			}
		}
	}

	/**玩家数据对象 */
	export class PlayerMO extends gamevo.BaseVO{
		public playerBagMnger:PlayerBagMnger = new PlayerBagMnger();
		public gold:number = 0;
		public exp:number = 0;
		public money:number = 0;
		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			this.id = xml.attributes.id;
			this.gold = parseFloat(xml.attributes.gold);
			this.exp = parseFloat(xml.attributes.exp);
			this.money = parseFloat(xml.attributes.money);
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

	}

	export var currentUserInfo:PlayerMO;
}