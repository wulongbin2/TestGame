module gameviews {
	export class GameOverScene extends BattleScene{
		public dialogVO:gamevo.DialogVO;
		constructor(){
		super();	
		this.dialogVO = gameMngers.dialogMnger.getVO('gameOver');
		this.skinName ='BattleSceneSkin';
		}


		public gameOver():void{
			var team1:gameCore.BattleTeamInfo = new gameCore.BattleTeamInfo();
			var tempHero:gameCore.HeroMO = new gameCore.HeroMO();
			tempHero.id='1';
			tempHero.initHero('1001');
			team1.heros=[tempHero];
			team1.totalZdl = 100000;
			var tempbuff:gamevo.BuffVO = new gamevo.BuffVO();
			gameCore.calculAllHeroBuff(team1.heros,tempbuff);
			team1.buff = tempbuff;
			team1.teamname = gameMngers.roleInfoMnger.getVO('1001').name;

			var team2:gameCore.BattleTeamInfo = new gameCore.BattleTeamInfo();
			tempHero = new gameCore.HeroMO();
			tempHero.id='2';
			tempHero.initHero('1002');
			team2.heros=[tempHero];
			team2.totalZdl = 99999;
			var tempbuff:gamevo.BuffVO = new gamevo.BuffVO();
			gameCore.calculAllHeroBuff(team2.heros,tempbuff);
			team2.buff = tempbuff;
			team2.teamname = gameMngers.roleInfoMnger.getVO('1002').name;
			this.start(team1,team2,'iceberg')
		}

		private dialogIndex:number = 0;
		protected test():boolean{
			if(this.dialogIndex>=this.dialogVO.actions.length){
				return true;
			}
			var worldInfo:gamevo.DialogActionVO = this.dialogVO.actions[this.dialogIndex];
			this.dialogIndex++;
			this.currentOp = gameCore.BatteOperator.op_dialog(worldInfo.teamId,worldInfo.roleId,worldInfo.word);
			this.action_dialog(()=>{
				this.currentOp = gameCore.BatteOperator.op_dialog(0,'','');
				this.action_dialog(this.nextOP.bind(this));
			});
			return false;
		}
		protected onExit():void{
		}
	}

}

