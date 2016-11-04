module gamevo {
	/**配置信息基础接口 */
	export interface IbaseVO{
		analysis(config:any):void;
		id:string;
	}

	export class BaseVO implements IbaseVO{
		public id:string;
		public analysis(config:any):void{

		}
	}

	export class WithConfigVO extends BaseVO{
		public getConfigId():string{
			return '';
		}
	}

	/**物品使用效果配置 */
	export class GoodsUseEffect{
		public type:string;
		public param:string[];
		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			this.type = xml.attributes.type;
			this.param = gameutils.XMLUtil.toStringArray(xml,'param');
		}
	}

	/**物品配置 */
	export class GoodsItemVO extends BaseVO{
		/**资源 */
		public static Tag_ZIYUAN:string = 'ziyuan';
		/**道具 */
		public static Tag_DAOJU:string = 'daoju';
		/**物品名称 */
		public name:string;
		/**物品标签[ziyuan,daoju] */
		public tag:string;
		/**是否自动合并 */
		public merge:boolean;
		/**合并最大数量; */
		public mergeMax:number;
		/**描述 */
		public des:string;
		/**物品资源图标 */
		public source:string;
		/**使用效果 */
		public useEffects:GoodsUseEffect[] = [];
		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			this.id = xml.attributes.id;
			this.name = xml.attributes.name;
			this.source = xml.attributes.source;
			this.merge = xml.attributes.merge==='true';
			this.mergeMax =parseFloat(xml.attributes.mergeMax);

			this.tag = xml.attributes.tag;
			this.des = xml.attributes.des;

			gameutils.XMLUtil.foreachChild(xml, 'useEffect',(item)=>{
				var effectVo:GoodsUseEffect = new GoodsUseEffect;
					effectVo.analysis(item);
					this.useEffects.push(effectVo);
			});
		}

		public get canUse():boolean
		{
			return this.useEffects.length>0;
		}
	}

	/**加成属性 */
	export class BuffVO{
		/** 先攻值*/
		public attckSpeed:number;
		/**防御值 */
		public defend:number;
		/**闪避值 */
		public dodge:number;
		/*王者值 */
		public king:number;

		public analysis(config:any):void{
			var arr:string[] = (<string>config).split(',');
			this.attckSpeed = parseFloat(arr[0]);
			this.defend = parseFloat(arr[1]);
			this.dodge = parseFloat(arr[2]);
			this.king = parseFloat(arr[3]);
		}
	}

	/**角色信息 */
	export class RoleBaseVO  extends BaseVO{
		/**名称 */
		public name:string;
		/**初始战斗力 */
		public initZDL:number;
		/**成长系数 */
		public potential:number;
		/**品质[white,green,blue,zi,yellow,light][白，绿，蓝，紫,金，闪金] */
		public quality:string;
		/**行走图资源id */
		public animaSource:string;
		/**技能id */
		public skills:string[];
		/**最大觉醒次数 */
		public awakenTime:number;
		/** 宝具id*/
		public weapon:string;
		/**基础加成 */
		public buff:BuffVO = new BuffVO;
		/**标签[物种，性别，职业] */
		public tag:string[];
		/**描述 */
		public des:string;
		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			this.id = xml.attributes.id;
			this.name = xml.attributes.name;
			this.initZDL = parseFloat(xml.attributes.initZDL);
			this.potential =  parseFloat(xml.attributes.potential);
			this.awakenTime =  parseFloat(xml.attributes.awakenTime);
			this.quality =  xml.attributes.quality;
			this.animaSource = xml.attributes.animaSource;
			this.skills =gameutils.XMLUtil.toStringArray(xml,'skills');
			this.weapon = xml.attributes.weapon;
			this.buff.analysis(xml.attributes.buff);
			this.tag = gameutils.XMLUtil.toStringArray(xml,'tag');
			this.des = xml.attributes.des;
		}

		public get qualityNum():number{
			return gamesystem.RoleQuality2Number[this.quality];
		}
	}

	/**武器信息 */
	export class WeaponVO extends BaseVO{
		/**名称 */
		public name:string;
		/**武器加成 */
		public buff:BuffVO = new BuffVO;
		public des:string;
		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			this.id = xml.attributes.id;
			this.name = xml.attributes.name;
			this.des = xml.attributes.des;
			this.buff.analysis(xml.attributes.buff);
		}
	}

	export class SkillBaseVO extends BaseVO{
		/**名称 */
		public name:string;
		/**技能动画 */
		public skillAnima:string;
		/**是否是合体技能 */
		public isGroupSkill:boolean;
		/**合体技能需要的角色 */
		public groupRoles:string[];
		/**触发几率 */
		public rate:number;
		/**触发次数*/
		public timeLimit:number;
		/**是否可回避 */
		public canAvoid:boolean;
		/**技能标签，用于分组派系 */
		public tag:string[];
		/**技能描述 */
		public des:string;

		public triggers:SkillTriggerVO[] = [];
		public effects:SkillEffectVO[] = [];
		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			this.id = xml.attributes.id;
			this.name = xml.attributes.name;
			this.skillAnima = xml.attributes.skillAnima;
			this.isGroupSkill = xml.attributes.isGroupSkill==='true';
			this.rate =	parseFloat(xml.attributes.rate);
			this.timeLimit =parseFloat(xml.attributes.timeLimit);
			this.canAvoid = xml.attributes.canAvoid==='true';
			this.tag =  (<string>xml.attributes.tag).split(',');
			this.des = xml.attributes.des;
			gameutils.XMLUtil.foreachChild(xml, 'trigger',(item)=>{
						var trigVO:SkillTriggerVO = new SkillTriggerVO;
						trigVO.analysis(item);
						this.triggers.push(trigVO);
					});
			gameutils.XMLUtil.foreachChild(xml, 'effect',(item)=>{
					var effectVo:SkillEffectVO = new SkillEffectVO;
						effectVo.analysis(item);
						this.effects.push(effectVo);
					});
		}
	}

	/**技能触发条件配置 */
	export class SkillTriggerVO{
		/** 比较值1 值可以是数值，也可以是简单的表达式[+-x/]，属性对象[self表示己方对象，enemy表示敌方对象][对象支持属性:curZDL,totalZDL] */
		public compareValue1:string;
		/**比较方式[less,greater] */
		public compareType:string;
		/**比较值2 */
		public compareValue2:string;
		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			this.compareValue1 = xml.attributes.compareValue1;
			this.compareType = xml.attributes.compareType;
			this.compareValue2 = xml.attributes.compareValue2;
		}
	}

	/**技能触发效果配置 */
	export class SkillEffectVO{
		/**[attack,passive,other]; */
		public effectType:string;
		/**属性对象 */
		public targetPro:string;
		/**运算数值方式[add,sub] */
		public operatorType:string;
		/**运算数值 [值可以是数值，也可以是简单的表达式] */
		public operatorValue:string;
		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			this.effectType = xml.attributes.effectType;
			this.targetPro = xml.attributes.targetPro;
			this.operatorType = xml.attributes.operatorType;
			this.operatorValue = xml.attributes.operatorValue;
		}
	}
}