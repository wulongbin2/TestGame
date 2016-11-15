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

	export class StringConstVO extends BaseVO{
		public value:string;
		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			this.id = xml.attributes.id;
			this.value = xml.attributes.value;
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
		public attckSpeed:number =0 ;
		/**防御值 */
		public defend:number = 0;
		/**闪避值 */
		public dodge:number =0;
		/*王者值 */
		public king:number = 0;
		public des:string = '';
		public analysis(config:any):void{
			if(config){
				var arr:string[] = (<string>config).split(',');
				this.attckSpeed = parseFloat(arr[0]);
				this.defend = parseFloat(arr[1]);
				this.dodge = parseFloat(arr[2]);
				this.king = parseFloat(arr[3]);
			}

			var  tempArr:string[] = [];
			if(this.attckSpeed!=0)
			{
				tempArr.push('先攻'+this.numToStr( this.attckSpeed));
			}
			if(this.defend!=0)
			{
				tempArr.push('防御'+this.numToStr( this.defend));
			}
			if(this.dodge!=0)
			{
				tempArr.push('闪避'+this.numToStr( this.dodge));
			}
			if(this.king!=0)
			{
				tempArr.push('王者'+this.numToStr( this.king));
			}
			if(tempArr.length>0)
			{
				this.des += tempArr.join(',')+'。';
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

		public addBuff(vo:BuffVO){
			this.attckSpeed+=vo.attckSpeed;
			this.defend+=vo.defend;
			this.dodge+=vo.dodge;
			this.king+=vo.king;
		}

		public sub(value:number){
			this.attckSpeed*=value;
			this.defend*=value;
			this.dodge*=value;
			this.king*=value;
		}

		public clear():void{
			this.attckSpeed = 0;
			this.defend =0 ;
			this.dodge = 0;
			this.king = 0;
		}

		public clone():BuffVO{
			var info:BuffVO = new BuffVO();
			info.attckSpeed = this.attckSpeed;
			info.defend = this.defend;
			info.dodge = this.dodge;
			info.king= this.king;
			return info;
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
		/**标签[物种，性别，职业] */
		public tag:string[];
		/**是否在图鉴栏中显示 */
		public noShow:boolean = false;
		/**描述 */
		public des:string;

		public analysis(config:any):void{
			var xml:egret.XML = config as egret.XML;
			this.id = xml.attributes.id;
			this.name = xml.attributes.name;
			this.noShow = xml.attributes.noShow==='true';
			this.initZDL = parseFloat(xml.attributes.initZDL);
			this.potential =  parseFloat(xml.attributes.potential);
			this.awakenTime =  parseFloat(xml.attributes.awakenTime);
			this.quality =  xml.attributes.quality;
			this.animaSource = xml.attributes.animaSource;
			this.skills =gameutils.XMLUtil.toStringArray(xml,'skills');
			this.weapon = xml.attributes.weapon;
			this.tag = gameutils.XMLUtil.toStringArray(xml,'tag');
			this.des = xml.attributes.des;

			if(this.name=='懒得写'){
				this.name = RoleBaseVO.getRandName()+'.'+RoleBaseVO.getRandName();
				this.des ='作者很懒，他什么也没留下！'
			}
		}

		private static getRandName():string{
			if(!RoleBaseVO.nameArr){
				RoleBaseVO.nameArr = RoleBaseVO.nameStr.split(',');
			}
			var i:number = Math.ceil(Math.random()*RoleBaseVO.nameArr.length);
			return RoleBaseVO.nameArr[i];
		}

		private static nameArr:string[];
		private static nameStr:string= '赵,钱,孙,李,周,吴,郑,王,冯,陈,楮,卫,蒋,沈,韩,杨,朱,秦,尤,许,何,吕,施,张,孔,曹,严,华,金,魏,陶,姜,戚,谢,邹,喻,柏,水,窦,章,云,苏,潘,葛,奚,范,彭,郎,鲁,韦,昌,马,苗,凤,花,方,俞,任,袁,柳,酆,鲍,史,唐,费,廉,岑,薛,雷,贺,倪,汤,滕,殷,罗,毕,郝,邬,安,常,乐,于,时,傅,皮,卞,齐,康,伍,余,元,卜,顾,孟,平,黄,和,穆,萧,尹,姚,邵,湛,汪,祁,毛,禹,狄,米,贝,明,臧,计,伏,成,戴,谈,宋,茅,庞,熊,纪,舒,屈,项,祝,董,梁,杜,阮,蓝,闽,席,季,麻,强,贾,路,娄,危,江,童,颜,郭,梅,盛,林,刁,锺,徐,丘,骆,高,夏,蔡,田,樊,胡,凌,霍,虞,万,支,柯,昝,管,卢,莫,经,房,裘,缪,干,解,应,宗,丁,宣,贲,邓,郁,单,杭,洪,包,诸,左,石,崔,吉,钮,龚,程,嵇,邢,滑,裴,陆,荣,荀羊,於,惠,甄,麹,家,封,芮,羿,储,靳,汲,邴,糜,松,井,段,富,巫,乌,焦,巴,弓,牧,隗,山,谷,车,侯,宓,蓬,全,郗,班,仰,秋,仲,伊,宫,宁,仇,栾,暴,甘,斜,厉,戎,祖,武,符,刘,景,詹,束,龙,叶,幸,司,韶,郜,黎,蓟,薄,印,宿,白,怀,蒲,邰,从,鄂,索,咸,籍,赖,卓,蔺,屠,蒙,池,乔,阴,郁,胥,能,苍,双,闻,莘,党,翟,谭,贡,劳,逄,姬,申,扶,堵,冉,宰,郦,雍,郤,璩,桑桂,濮,牛,寿,通,边,扈,燕,冀,郏,浦,尚,农,温,别,庄,晏,柴,瞿,阎,充,慕,连,茹,习,宦,艾,鱼,容,向,古,易,慎,戈,廖,庾,终,暨,居,衡,步,都,耿,满,弘,匡,国,文,寇,广,禄,阙,东,欧,殳,沃,利,蔚,越,夔,隆,师,巩,厍,聂,晁,勾,敖,融,冷,訾,辛,阚,那,简,饶,空,曾,毋,沙,乜,养,鞠,须,丰,巢,关,蒯,相,查,后,荆,红,游,竺,权,逑,盖,益,桓,公,万俟,司马,上官,欧阳,夏侯,诸葛,闻人,东方,赫连,皇甫,尉迟,公羊,澹台,公冶,宗政,濮阳,淳于,单于,太叔,申屠,公孙,仲孙,轩辕,令狐,锺离,宇文,长孙,慕容,鲜于,闾丘,司徒,司空,丌官,司寇,仉,督,子车,颛孙,端木,巫马,公西,漆雕,乐正,壤驷,公良,拓拔,夹谷,宰父,谷梁,晋,楚,阎,法,汝,鄢,涂,钦,段干,百里,东郭,南门,呼延,归,海,羊舌,微生,岳,帅,缑,亢,况,后,有,琴,梁丘,丘,东门,西门,商,牟,佘,佴,伯,赏,南宫,墨,哈,谯,笪,年,爱,阳,佟';

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
}