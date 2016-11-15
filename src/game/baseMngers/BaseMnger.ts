module gameMngers {

	/**
	 * 配置管理器基类
	 */
	export class BaseMnger<T extends gamevo.IbaseVO> {
		protected lib:{[name:string]:T} = {};
		public id:string;
		public all:T[] = [];
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
			this.all.push(vo);
		}

		/**获取资源 */
		public getVO(id:string):T{
			return this.lib[id];
		}
	}

	class StringConstMnger extends BaseMnger<gamevo.StringConstVO>{
		protected createVO():gamevo.StringConstVO
		{
			return new gamevo.StringConstVO;
		}

		public getConst(id:string):string{
			var vo = this.getVO(id);
			return vo?this.getVO(id).value:id;
		}
	}

	 
	class DialogMnger extends BaseMnger<gamevo.DialogVO>{
		protected createVO():gamevo.DialogVO
		{
			return new gamevo.DialogVO;
		}
	}
	 
	class RoleInfoMnger extends BaseMnger<gamevo.RoleBaseVO>{

		public libByQuality:{[index:number]:gamevo.RoleBaseVO[]}={};
		protected _tujians:gamevo.RoleBaseVO[];
		constructor(str:string){
			super(str);
			for(var i:number =0;i <7;i++){
				this.libByQuality[i] = [];
			}
		}
		protected createVO():gamevo.RoleBaseVO
		{
			return new gamevo.RoleBaseVO;
		}

		public registerVO(vo:gamevo.RoleBaseVO):void{
			super.registerVO(vo);
			this.libByQuality[vo.qualityNum].push(vo);

		}

		public get tujians():gamevo.RoleBaseVO[]{
			if(!this._tujians){
				this._tujians = [];
				for(var i:number =6;i >=1; i--){
					this.libByQuality[i].forEach(item=>{
						if(!item.noShow){
							this._tujians.push(item);
						}
					})
				}
			}
			return this._tujians;
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

	class PlayerInfoMnger extends BaseMnger<gameCore.PlayerMO>{
		protected createVO():gameCore.PlayerMO
		{
			return new gameCore.PlayerMO;
		}
	}

	class EffectAnimaMnger extends BaseMnger<gameAnima.EffectAnimaInfo>{
		protected createVO():gameAnima.EffectAnimaInfo
		{
			return new gameAnima.EffectAnimaInfo;
		}

		public getVO(id:string):gameAnima.EffectAnimaInfo{
			var vo:gameAnima.EffectAnimaInfo = super.getVO(id);
			if(vo){
				vo.checkload();
			}
			return vo;
		}
	}

	class HeroAnimaInfoMnger extends BaseMnger<gamevo.HeroAnimaVO>{
		protected createVO():gamevo.HeroAnimaVO
		{
			return new gamevo.HeroAnimaVO;
		}
	}


	class MapInfoMnger extends BaseMnger<gamevo.MapVO>{
		protected createVO():gamevo.MapVO
		{
			return new gamevo.MapVO;
		}
	}

	class MapGuajiAnimaMnger extends BaseMnger<gamevo.MapGuajiAnimaVO>{
		protected createVO():gamevo.MapGuajiAnimaVO
		{
			return new gamevo.MapGuajiAnimaVO;
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

	/**角色配置管理器 */
	export var stringConstMnger:StringConstMnger = new StringConstMnger('stringConst');
	/**角色配置管理器 */
	export var roleInfoMnger:RoleInfoMnger = new RoleInfoMnger('roleInfo');
	/**武器配置管理器 */
	export var weaponInfoMnger:WeaponInfoMnger = new WeaponInfoMnger('weaponInfo'); 
	/**技能配置管理器 */
	export var skillInfoMnger:SkillInfoMnger = new SkillInfoMnger('skillInfo');  
	/**物品配置管理器 */
	export var goodsInfoMnger:GoodsInfoMnger = new GoodsInfoMnger('goodsInfo');
	/**玩具信息管理器 */
	export var playerInfoMnger:PlayerInfoMnger = new PlayerInfoMnger('playerInfo');
	/**英雄动画管理器 */
	export var heroAnimaInfoMnger:HeroAnimaInfoMnger = new HeroAnimaInfoMnger('heroAnimaInfo');
	/**地图配置管理 */
	export var mapInfoMnger:MapInfoMnger = new MapInfoMnger('mapInfo');      
	/**地图背景动画配置管理 */
	export var mapGuajiAnimaMnger:MapGuajiAnimaMnger = new MapGuajiAnimaMnger('mapGuajiAnima');
	/**特性资源配置 */
	export var effectAnimaMnger:EffectAnimaMnger = new EffectAnimaMnger('effectAnima');
	/**对话配置 */
	export var dialogMnger:DialogMnger = new DialogMnger('dialogInfo');          


	/**根据xml批量解析管理器配置*/
	export function analysisByxml(xml:egret.XML):void{
		xml.children.forEach((item:egret.XML)=>{
			getMnger(item.attributes.mngerType).analysis(RES.getRes(item.attributes.id));
		})
	}
}