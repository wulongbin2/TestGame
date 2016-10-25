module gameMngers {

	/**
	 * 配置管理器基类
	 */
	export class BaseMnger<T extends gamevo.IbaseVO> {
		protected lib:{[name:string]:T} = {};
		public id:string;
		public constructor(id?:string) {
			this.id =id;
			registerMnger(this);
		}

		/**
		 * 解析配置
		 */
		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			xml.children.forEach(item=>{
				var vo:T = this.createVO();
				vo.analysis(item);
				this.registerVO(vo);
			})
		}

		/**
		 * 创建资源对象
		 */
		protected createVO():T
		{
			throw 'override this';
		}

		/**注册资源 */
		public registerVO(vo:T):void{
			this.lib[vo.id] = vo;
		}

		/**获取资源 */
		public getVO(id:string):T{
			return this.lib[id];
		}
	}
	 
	class RoleInfoMnger extends BaseMnger<gamevo.RoleBaseVO>{
		protected createVO():gamevo.RoleBaseVO
		{
			return new gamevo.RoleBaseVO;
		}
	}

	class WeaponInfoMnger extends BaseMnger<gamevo.WeaponVO>{
		protected createVO():gamevo.WeaponVO
		{
			return new gamevo.WeaponVO;
		}
	}

	class SkillInfoMnger extends BaseMnger<gamevo.SkillBaseVO>{
		protected createVO():gamevo.SkillBaseVO
		{
			return new gamevo.SkillBaseVO;
		}
	}

	class GoodsInfoMnger extends BaseMnger<gamevo.GoodsItemVO>{
		protected createVO():gamevo.GoodsItemVO
		{
			return new gamevo.GoodsItemVO;
		}
	}

	var lib:{[name:string]:BaseMnger<any>} = {};
	/**注册管理器 */
	export function registerMnger(vo:BaseMnger<any>):void{
		lib[vo.id] = vo;
	}

	/**获取管理器 */
	export function getMnger(id:string):BaseMnger<any>{
		return lib[id];
	}

	/**根据xml批量解析管理器配置*/
	export function analysisByxml(xml:egret.XML):void{
		xml.children.forEach((item:egret.XML)=>{
			getMnger(item.attributes.mngerType).analysis(RES.getRes(item.attributes.id));
		})
	}

	/**角色配置管理器 */
	export var roleInfoMnger:RoleInfoMnger = new RoleInfoMnger('roleInfo');
	/**武器配置管理器 */
	export var weaponInfoMnger:WeaponInfoMnger = new WeaponInfoMnger('weaponInfo'); 
	/**技能配置管理器 */
	export var skillInfoMnger:SkillInfoMnger = new SkillInfoMnger('skillInfo');  
	/**物品配置管理器 */
	export var goodsInfoMnger:GoodsInfoMnger = new GoodsInfoMnger('goodsInfo');  
}