module baseMngers {

	export class BaseMnger<T extends gamevo.BaseVO> {
		protected lib:{[name:string]:T} = {};
		public id:string;
		public constructor(id?:string) {
			this.id =id;
			registerMnger(this);
		}

		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			xml.children.forEach(item=>{
				var vo:T = this.createVO();
				vo.analysis(item);
				this.registerVO(vo);
			})
		}

		protected createVO():T
		{
			throw 'override this';
		}

		public registerVO(vo:T):void{
			this.lib[vo.id] = vo;
		}

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

	var lib:{[name:string]:BaseMnger<any>} = {};
	export function registerMnger(vo:BaseMnger<any>):void{
		lib[vo.id] = vo;
	}

	export function getMnger(id:string):BaseMnger<any>{
		return lib[id];
	}

	export function analysisByxml(xml:egret.XML):void{
		xml.children.forEach((item:egret.XML)=>{
			getMnger(item.attributes.mngerType).analysis(RES.getRes(item.attributes.id));
		})
	}


	export var roleInfoMnger:RoleInfoMnger = new RoleInfoMnger('roleInfo');
	export var weaponInfoMnger:WeaponInfoMnger = new WeaponInfoMnger('weaponInfo'); 
	export var skillInfoMnger:SkillInfoMnger = new SkillInfoMnger('skilInfo');  
}