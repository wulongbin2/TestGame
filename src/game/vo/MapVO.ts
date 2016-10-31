module gamevo {
	/**地图配置 */
	export class MapVO extends BaseVO {
		/**地图名称 */
		public name:string;
		/**地图列表缩略图 */
		public listBg:string;
		/**地图挂机动画 */
		public guajiAnima:string;
		/**地图开启关卡 */
		public kaiqiZdl:number;
		/**地图出现的人物列表 */
		public useRoleIds:string[];
		public mapChilds:MapChildVO[] = [];
		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			this.id = xml.attributes.id;
			this.name = xml.attributes.name;
			this.listBg = xml.attributes.listBg;
			this.guajiAnima = xml.attributes.guajiAnima;
			this.kaiqiZdl = parseInt(xml.attributes.kaiqiZdl);
			this.useRoleIds = gameutils.XMLUtil.toStringArray(xml,'useRoleIds');
			this.pushChildMap(gameutils.XMLUtil.childXML(xml,'map1'));
			this.pushChildMap(gameutils.XMLUtil.childXML(xml,'map2'));
			this.pushChildMap(gameutils.XMLUtil.childXML(xml,'map3'));
		}

		public pushChildMap(xml:egret.XML){
			var info:MapChildVO = new MapChildVO;
			info.analysis(xml);
			this.mapChilds.push(info);
		}
	}

	/**地图子关卡 */
	export class MapChildVO extends BaseVO{
		public heros:gameCore.HeroMO[] = [];
		public daojus:gameCore.GoodsItemMO[] = [];
		public gold:number = 0;
		public exp:number = 0;
		public money:number = 0;
		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			this.gold = parseFloat(xml.attributes.gold);
			this.exp = parseFloat(xml.attributes.exp);
			this.money = parseFloat(xml.attributes.money);
			gameutils.XMLUtil.foreachChild(xml,'heros',(item)=>{
				var heroMO:gameCore.HeroMO = new gameCore.HeroMO;
				heroMO.analysis(item);
				this.heros.push(heroMO);
			});

			gameutils.XMLUtil.foreachChild(xml,'daoju',(item)=>{
				var goodsItem:gameCore.GoodsItemMO = new gameCore.GoodsItemMO;
				goodsItem.analysis(item);
				this.daojus.push(goodsItem);
			});
		} 
	}
	/**地图挂机背景动画 */
	export class MapGuajiAnimaVO extends BaseVO{
		public bgs:MapGuajiBgVO[] = [];

		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			this.id = xml.attributes.id;
			xml.children.forEach((item:egret.XML)=>{
				this.bgs.push({bg:item.attributes.bg, type:item.attributes.type});
			});
		} 
	}
	/**地图挂机背景 */
	export interface MapGuajiBgVO{
		bg:string,
		type:string
	}
}