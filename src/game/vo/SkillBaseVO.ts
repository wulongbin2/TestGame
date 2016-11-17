module gamevo {
	export class SkillBaseVO extends BaseVO{
		/**名称 */
		public name:string;
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
		// public desDetail:string;
		/**图标 */
		public icon:string;

		public oneTime:boolean = false;

			/**是否是主动型技能 */
		public isActivie:Boolean;
		/**技能类型，attack，shanbi,huixue, */
		public skillType:string;
		public buff:BuffVO = new BuffVO;

		public triggers:SkillTriggerVO[] = [];
		public effects:SkillEffectVO[] = [];
		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			this.id = xml.attributes.id;
			this.icon = xml.attributes.icon;
			this.name = xml.attributes.name;
			this.buff.analysis(xml.attributes.buff);
			this.oneTime = xml.attributes.oneTime ==='true';
			this.isGroupSkill = xml.attributes.isGroupSkill==='true';
			this.rate =	parseFloat(xml.attributes.rate);
			this.timeLimit =parseFloat(xml.attributes.timeLimit);
			this.canAvoid = xml.attributes.canAvoid==='true';
			this.groupRoles = gameutils.XMLUtil.toStringArray(xml,'groupRoles')
			this.tag =  (<string>xml.attributes.tag).split(',');
			this.des = xml.attributes.des;
			if(this.des)
			{
				this.des +='!';
			}
			var tempArr:string[] = [];
			if(this.isGroupSkill){
				this.des += '【组合技】';
			}
			this.des += this.buff.des;
			this.des += this.rate+'%触发!';
			if(!this.canAvoid){
				this.des += '该技能不可回避!';
			}
			tempArr.length = 0;
			gameutils.XMLUtil.foreachChild(xml, 'trigger',(item)=>{
						var trigVO:SkillTriggerVO = new SkillTriggerVO;
						trigVO.analysis(item);
						this.triggers.push(trigVO);
						tempArr.push(trigVO.des);
					});
			if(tempArr.length>0)
			{
				this.des+='当'+tempArr.join(',且')+'时触发，';
			}

			tempArr.length = 0;
			gameutils.XMLUtil.foreachChild(xml, 'effect',(item)=>{
					var effectVo:SkillEffectVO = new SkillEffectVO;
						effectVo.analysis(item);
						this.effects.push(effectVo);
						tempArr.push(effectVo.des);
					});
			if(tempArr.length>0)
			{
				this.des+=tempArr.join(',')+'。';
			}

		}

		private numToStr(num:number):string{
			if(num>=0)
			{
				return '+'+num;
			}
			else{
				return num+'';
			}
		}


	}

	/**技能触发条件配置 */
	export class SkillTriggerVO{
		/** 比较值1 值可以是数值，也可以是简单的表达式[+-x/]，属性对象[self表示己方对象，enemy表示敌方对象][对象支持属性:curZDL,totalZDL] */
		public compareValue1:string[];
		/**比较方式[less,greater] */
		public compareType:string;
		/**比较值2 */
		public compareValue2:string[];
		public des:string;
		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			var str:string = '';
			this.compareValue1 = gameutils.XMLUtil.toStringArray(xml,'compareValue1');
			this.compareType = xml.attributes.compareType;
			this.compareValue2 =gameutils.XMLUtil.toStringArray(xml,'compareValue2');
			this.des = gameutils.toStringConst(xml.attributes.des);
			this.des = gameutils.replaceStringConst(this.des,[this.compareValue1[0],this.compareType,this.compareValue2[0]]);
		}
	}

	/**技能触发效果配置 */
	export class SkillEffectVO{
		public type:string;
		public param:string[];
		public des:string;
		public time:number;
		public skillAnima:string;
		public buff:BuffVO = new BuffVO;
		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			this.type = xml.attributes.type;
			this.skillAnima = xml.attributes.skillAnima;
			this.buff.analysis(xml.attributes.buff);
			this.time = xml.attributes.time?Math.max(1,parseInt(xml.attributes.time)):1;
			this.param = gameutils.XMLUtil.toStringArray(xml,'param');
			this.des = gameutils.toStringConst(xml.attributes.des);
			this.des = gameutils.replaceStringConst(this.des,this.param);
			if(this.time>1){
				this.des+=this.time+'次。';
			}
			var tempArr:string;
			if(this.buff.des)
			{
				this.des='命中后'+this.des+this.buff.des+'。'
			}
		}
	}
}