module gameCore {
	export class BattleTeam{
		public id:number;
		private _curZDL:number;//当前HP
		private _fightZDL:number;//战斗力攻击力
		private _totalZDL:number;//总的HP
		private _buff:gamevo.BuffVO;
		public allSkills:gamevo.SkillBaseVO[] = [];
		public teams:HeroMO[];
		public lastdodgeRound:number;

		public initTeam(id:number,info:gameCore.BattleTeamInfo):void{
			this.lastdodgeRound = 0;
			this.id = id;
			this.teams  = info.heros;
			this._totalZDL = info.totalZdl;
			this._curZDL = this._totalZDL;
			this._fightZDL = this._curZDL *0.3;
			this._buff = info.buff;
			this.teams.forEach(role=>{
				role.roleVo.skills.forEach(skillId=>{
					this.allSkills.push(gameMngers.skillInfoMnger.getVO(skillId));
				})
			})
		}

		public get buff():gamevo.BuffVO{
			return this._buff;
		}

		public get curZDL():number{
			return this._curZDL;
		}

		public set curZDL(value:number){
			this._curZDL = Math.max(0,value);
			this._totalZDL = Math.max(this._curZDL,this._totalZDL);
		}

		public get fightZDL():number{
			return this._fightZDL;
		}

		public get totalZDL():number{
			return this._totalZDL;
		}

		public createBattleInfo():BattleTeamRecord{
			var info:BattleTeamRecord = new BattleTeamRecord();
			info.curZDL = this.curZDL;
			info.totalZD = this.totalZDL;
			info.buff = this.buff.clone();
			return info;
		}
	}

	export class BattleSceneInfo{
		public self:BattleTeam;
		public enemy:BattleTeam;
		public round:number = 0;
		private hurtNum:number;
		public fight(pushOperator:(b:BatteOperator)=>void){
			var operator:BatteOperator = new BatteOperator();
			var selfSkill:gamevo.SkillBaseVO;
			var  selfTeamLength:number = this.self.teams.length;
			for(var i:number=0;i < selfTeamLength; i ++){
				var role:HeroMO = this.self.teams[i];
				var roleSkillLength:number = role.roleVo.skills.length; 
				for(var j:number = 0;j < roleSkillLength; j++)
				{
					var skillVo:gamevo.SkillBaseVO = gameMngers.skillInfoMnger.getVO(role.roleVo.skills[j]);
					var triggerLen:number = skillVo.triggers.length;
					if(triggerLen>0){
						var conditionTag:boolean = true;
						for(var k:number = 0;k <triggerLen;k++){
							var trigger = skillVo.triggers[k];
							var value1:number = this.simpleCalcul(trigger.compareValue1);
							var value2:number = this.simpleCalcul(trigger.compareValue2);
							if(trigger.compareType === 'less'){
								if(value1 >=value2)
								{
									conditionTag = false;
									break;
								}
							}
							else{
								if(value1 <=value2)
								{
									conditionTag = false;
									break;
								}
							}
						}
						if(!conditionTag){
							continue;
						}
					}
					if(Math.random() < skillVo.rate*0.01){
						selfSkill = skillVo;
						break;
					}
				};
				if(selfSkill){
					break;
				}
			};
			if(!selfSkill){
				selfSkill = gameMngers.skillInfoMnger.getVO('auto');
			};
			var effectLength:number = selfSkill.effects.length;
			pushOperator(BatteOperator.op_action(gamesystem.OPType_Forward,this.self.id));
			this.hurtNum= 0;
			var hasPlaySkill:boolean = false;
			for(i=0; i < effectLength; i++){
				var effect:gamevo.SkillEffectVO = selfSkill.effects[i];
				if(effect.type ==gamesystem.SkillEffectType_Attack){
					//是否闪避
					var offRound:number = this.round -this.enemy.lastdodgeRound;
					var shanbiPer:number = Math.sin(this.enemy.buff.dodge/100*Math.PI/2);
					shanbiPer = shanbiPer*(shanbiPer+(1-shanbiPer)*(offRound/5 ));
					if(Math.random()<shanbiPer){
						this.enemy.lastdodgeRound = this.round;
						pushOperator(BatteOperator.op_action(gamesystem.OPType_BackOut,this.enemy.id));
						pushOperator(BatteOperator.op_playSkill(this.enemy.id, selfSkill.id));
						pushOperator(BatteOperator.op_action(gamesystem.OPType_BackIn,this.enemy.id));
					}
					else{
						var offZDL:number = Math.max(this.self.fightZDL*0.1,(this.self.fightZDL - this.enemy.fightZDL*0.3));
						offZDL*=(1+Math.random()*0.1);//增加10%的偏差
						var offDef:number = this.self.buff.attckSpeed - this.enemy.buff.defend;
						offZDL*=(1+offDef*0.01);
						offZDL*= parseFloat(effect.param[0]);//暴击倍率
						offZDL = Math.round(offZDL);
						this.enemy.curZDL-=offZDL;
						this.hurtNum+=offZDL;
						pushOperator(BatteOperator.op_playSkill(this.enemy.id, selfSkill.id));
						pushOperator(BatteOperator.op_showHurt(this.enemy.id,  -offZDL));
						hasPlaySkill = true;
					}
				}
				else if(effect.type == gamesystem.SkillEffectType_Recovery){
					var baseNum:number = this.getValue(effect.param[1])
					offZDL= Math.round(baseNum*parseFloat(effect.param[0]));
					this.self.curZDL+=offZDL;
					if(!hasPlaySkill){
						hasPlaySkill = true;
						pushOperator(BatteOperator.op_playSkill(this.enemy.id, selfSkill.id));
					}
					pushOperator(BatteOperator.op_showHurt(this.self.id,  offZDL));
				}
			}

		}

		public simpleCalcul(value:string[]):number{
			var value1:number = this.getValue(value[0]);
			var index:number = 2;
			var len:number = value.length;
			while(index<len)
			{
				var value2:number = this.getValue(value[index]);
				switch(value[index-1]){
					case '+':
					value1+=value2;
					break;
					case '-':
					value1-=value2;
					break;
					case '/':
					value1/=value2;
					break;
					case '*':
					value1*=value2;
					break;
				}
				index+=2;
			}

			return value1;
		}

		public getValue(type:string):number{
			switch(type){
				case gamesystem.SkillRecovery_Self_CurZDL:
				return this.self.curZDL;
				case gamesystem.SkillRecovery_Self_TotalZDL:
				return this.self.totalZDL;
				case gamesystem.SkillRecovery_Self_LoseZDL:
				return this.self.totalZDL - this.self.curZDL;
				case gamesystem.SkillRecovery_Enemy_CurZDL:
				return this.enemy.curZDL;
				case gamesystem.SkillRecovery_Enemy_TotalZDL:
				return this.enemy.totalZDL;
				case gamesystem.SkillRecovery_Enemy_LoseZDL:
				return this.enemy.totalZDL - this.enemy.curZDL;
				case gamesystem.SkillRecovery_HurtZDL:
				return this.hurtNum;
			}
			return parseFloat(type);
		}
	}

	export class BattleTeamInfo{
		public teamname:string;
		public heros:HeroMO[];
		public totalZdl:number;
		public buff:gamevo.BuffVO;
		public init(teamname:string,heros:HeroMO[],totalZdl:number,buff:gamevo.BuffVO):void{
			this.teamname = teamname;
			this.heros = heros;
			this.totalZdl = totalZdl;
			this.buff = buff;
		}
	}


	export class BattleTeamRecord{
		public curZDL:number;
		public totalZD:number;
		public buff:gamevo.BuffVO = new gamevo.BuffVO;
	}

	export class BatteOperator{
		public type:string='';
		public round:number;
		public teamInfo1:BattleTeamRecord;
		public teamInfo2:BattleTeamRecord;
		public targetteam:number;
		public skillId:string;
		public result:number;
		public static op_initInfo(round:number):BatteOperator{
			var o:BatteOperator = new BatteOperator();
			o.type =gamesystem.OPType_InitRound;
			o.round = round;
			return o;
		}

		public static  op_playSkill(targetTeam:number,skillId:string):BatteOperator{
			var o:BatteOperator = new BatteOperator();
			o.type = gamesystem.OPType_PlaySkill;
			o.targetteam = targetTeam;
			o.skillId = skillId;
			return o;
		}

		public static  op_action(type:string,targetTeam?:number):BatteOperator{
			var o:BatteOperator = new BatteOperator();
			o.type = type;
			o.targetteam = targetTeam;
			return o;
		}


		public static  op_showHurt(targetTeam:number,result:number):BatteOperator{
			var o:BatteOperator = new BatteOperator();
			o.type = gamesystem.OPType_ShowHurt;
			o.targetteam = targetTeam;
			o.result = result;
			return o;
		}


		public static  op_end(targetTeam:number):BatteOperator{
			var o:BatteOperator = new BatteOperator();
			o.type =  gamesystem.OPType_End;
			o.targetteam = targetTeam;
			return o;
		}
	}


	export class BattleCore {
		public team1:BattleTeam = new BattleTeam;
		public team2:BattleTeam = new BattleTeam;
		public teams:BattleTeam[] = [];
		public scene:BattleSceneInfo = new BattleSceneInfo;
		public fightIndex:number = 0;
		public constructor() {
			this.teams.push(this.team1);
			this.teams.push(this.team2);
		}

		public calculBattle(team1:BattleTeamInfo, team2:BattleTeamInfo):BatteOperator []{
			this.team1.initTeam(0,team1);
			this.team2.initTeam(1,team2);
			if(this.team1.buff.attckSpeed>this.team2.buff.attckSpeed){
				this.fightIndex = 0;
			}
			else if(this.team1.buff.attckSpeed==this.team2.buff.attckSpeed){
				if(this.team1.totalZDL>=this.team2.totalZDL){
					this.fightIndex = 0;
				}
				else{
					this.fightIndex = 1;
				}
			}
			else{
				this.fightIndex = 1;
			}
			return this.fight();
		}

		private operators:BatteOperator []  = [];
		private pushOpeartor(op:BatteOperator):void{
			op.teamInfo1 = this.team1.createBattleInfo();
			op.teamInfo2 = this.team2.createBattleInfo();
			this.operators.push(op);
		}
		public fight():BatteOperator []{
			this.operators.length = 0;
			this.scene.round = 1;
			var first:boolean = true;
			while(true){
				this.pushOpeartor(BatteOperator.op_initInfo(this.scene.round));
				if(first){
					first =false;
					this.pushOpeartor(BatteOperator.op_action(gamesystem.OPType_MaskHide));
				}
				this.scene.self = this.teams[this.fightIndex%2];
				this.scene.enemy = this.teams[(this.fightIndex+1)%2];
				this.scene.fight(this.pushOpeartor.bind(this));
				this.fightIndex++;
				if(this.team1.curZDL <=0 || this.team2.curZDL <=0){
					if(this.team1.curZDL<=0)
					{
						this.pushOpeartor(BatteOperator.op_end(this.team2.id));
					}
					else{
						this.pushOpeartor(BatteOperator.op_end(this.team1.id));
					}
					break;
				}
				this.scene.round++;
			}
			return this.operators;
		}
	}
}