module gameCore {
	/**物品数据对象 */
	export class GoodsItemMO extends BagItemMO{
		public goodsId:string='';
		public goodsNum:number = 0;
	}

	/**英雄数据对象 */
	export class HeroMO  extends gamevo.BaseVO{
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
	}

	/**英雄列表 */
	export class HeroBag extends BagProxyMO<HeroMO>{
		public getHeroArr():HeroMO[]
		{
			var arr:HeroMO[] = [];
			for(var i:number =0;i < this._availgridsNum;i++)
			{
				var grid = this.grids[i];
				if(grid.isUsed)
				{
					arr.push(grid.item.data);
				}
			}
			return arr;
		}
	} 

	/**玩家背包管理中心 */
	export class PlayerBagMnger extends gameCore.BagManager{
		/**道具背包 */
		public daojuBag:BagMO<GoodsItemMO>;
		/**资源背包 */
		public ziyuanBag:BagMO<GoodsItemMO>;
		/**英雄列表 */
		public heroBag:HeroBag;
		/**出战列表 */
		public teamHeroBag:HeroBag;

		private allHeroBags:HeroBag[] = [];
		public constructor(){
			super();
			this.daojuBag = new BagMO<GoodsItemMO>();
			this.daojuBag.initBag('daojuBag',10,40,this)

			this.ziyuanBag = new BagMO<GoodsItemMO>();
			this.ziyuanBag.initBag('ziyuanBag',10,40,this)

			this.heroBag = new HeroBag();
			this.heroBag.initBag('heroBag',50,100,this);
			this.allHeroBags.push(this.heroBag);

			this.teamHeroBag = new HeroBag();
			this.teamHeroBag.initBag('heroBag',10,20,this);
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
	}

	/**玩家数据对象 */
	export class PlayerMO extends gamevo.BaseVO{
		public playerBagMnger:PlayerBagMnger = new PlayerBagMnger();
		public gold:number = 0;
		public exp:number = 0;
		public money:number = 0;
		public heros:HeroMO[] = [];
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
		}

		public addHero(mo:HeroMO){
			this.heros.push(mo);
			this.playerBagMnger.heroBag.pushItemByData(mo);
		}

		public removeHero(mo:HeroMO)
		{
			this.heros.splice(this.heros.indexOf(mo),1);
			this.playerBagMnger.removeHeroFromAllBag(mo);
		}
	}
}