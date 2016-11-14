class BattleScene extends eui.Component implements  eui.UIComponent {
	public bg:eui.Image = new eui.Image;
	public maskBg:eui.Image;
	public maskRect:eui.Rect;
	public pro1:HPBar;
	public pro2:HPBar;
	public nameTf1:eui.Label;
	public nameTf2:eui.Label;
	public roundTf:eui.Label;
	public atkTf1:eui.Label;
	public defTf1:eui.Label;
	public avoidTf1:eui.Label;
	public kingTf1:eui.Label;
	public atkTf2:eui.Label;
	public defTf2:eui.Label;
	public avoidTf2:eui.Label;
	public kingTf2:eui.Label;
	public logGroup:eui.Group;
	public roleGroup:eui.Group;
	public logTf:eui.Label;
	public exitTf:eui.Label;
	public hpTf1:eui.Label;
	public hpTf2:eui.Label;
	public battleCore:gameCore.BattleCore = new gameCore.BattleCore;
	public battleteam1:gameviews.BattleTeam = new gameviews.BattleTeam();
	public battleteam2:gameviews.BattleTeam = new gameviews.BattleTeam();
	public battleSkillText:gameviews.BattleSkillText = new gameviews.BattleSkillText();
	public battleteams:gameviews.BattleTeam[] = [];
	public battleResult:gameviews.BattleResult = new gameviews.BattleResult;
	public battleteamPos:number[][] = [];
	private effectPlayer:gameAnima.EffectAnimaPlayer = new gameAnima.EffectAnimaPlayer;
	private names:string [] = [];
	public static HalfWidth:number = 320;
	public static BattleTeamY:number = 450;
	private taskPromise:gameutils.Promise = new gameutils.Promise();
	public constructor() {
		super();
		this.addEventListener(egret.Event.COMPLETE, this.onComplete,this);
	}

	private onComplete():void{
		this.addChildAt(this.bg,1);
		this.maskRect.visible =false;
		this.effectPlayer.y = BattleScene.BattleTeamY -100;
		this.effectPlayer.scaleY =3;
		this.effectPlayer.blendMode = egret.BlendMode.ADD;
		this.battleteam2.scaleX = -1;
		this.roleGroup.addChild(this.battleteam1);
		this.roleGroup.addChild(this.battleteam2);
		this.battleteams.push(this.battleteam1);
		this.battleteams.push(this.battleteam2);
		this.battleteamPos.push([BattleScene.HalfWidth-140,BattleScene.HalfWidth-100,BattleScene.HalfWidth-60,BattleScene.HalfWidth-40]);
		this.battleteamPos.push([BattleScene.HalfWidth+140,BattleScene.HalfWidth+100,BattleScene.HalfWidth+60,BattleScene.HalfWidth+40]);
		this.logGroup.visible = false;
		this.effectPlayer.addEventListener(egret.Event.COMPLETE, this.onEffectComplete,this)
	}


	private ops:gameCore.BatteOperator[];
	private opIndex:number = 0;
	/**战斗开始 */
	public start(team1:gameCore.BattleTeamInfo,team2:gameCore.BattleTeamInfo,bg:string,mapChild?:gamevo.MapChildVO):void{
		this.ops = this.battleCore.calculBattle(team1,team2,mapChild);
		this.battleteam1.resetHeros(team1.heros);
		this.battleteam2.resetHeros(team2.heros);
		this.battleteam1.x =this.battleteamPos[0][1];
		this.battleteam2.x =this.battleteamPos[1][1];
		this.battleteam2.y = this.battleteam1.y = BattleScene.BattleTeamY;
		this.battleteam1.alpha = this.battleteam2.alpha = 1;
		this.names[0] = this.nameTf1.text =team1.teamname;
		this.names[1] = this.nameTf2.text = team2.teamname;
		this.opIndex = 0;
		this.logTf.text = '';
		RES.getResByUrl(gamesystem.Url_BattleBg+bg+'.png',this.loadBg,this);
		this.isRunning = true;
		this.nextOP();
	}

	private loadBg(texture:egret.Texture):void{
		this.bg.source = texture;
		this.bg.width = 650;
		this.bg.x = -5;
		this.bg.y = -5;
		this.bg.height = 1146;
	}

	protected  currentOp:gameCore.BatteOperator;
	protected test():boolean{
		return true
	};
	protected nextOP():void{
		this.currentOp = this.ops[this.opIndex];
		var nextBool:boolean =false;
		this.taskPromise.clear();
		switch(this.currentOp.type){
			case gamesystem.OPType_InitRound:
				this.action_initInfo();
				nextBool = this.test();
			break;
			case gamesystem.OPType_Forward:
				this.action_forward(this.nextOP.bind(this),this.currentOp.targetteam);
				break;
			case gamesystem.OPType_BackIn:
				this.action_backIn(this.nextOP.bind(this),this.currentOp.targetteam);
				break;
			case gamesystem.OPType_BackOut:
				this.action_backOut(this.nextOP.bind(this),this.currentOp.targetteam);
				break;

			case gamesystem.OPType_ShowHurt:
				this.action_showHurt(this.nextOP.bind(this),this.currentOp.targetteam,this.currentOp.result);
				break;

			case gamesystem.OPType_PlaySkillName:
				this.action_playSkillName(this.nextOP.bind(this),this.currentOp.targetteam,this.currentOp.EffectId);
				break;

			case gamesystem.OPType_PlayEffect:
				this.action_playEffect(this.nextOP.bind(this),this.currentOp.targetteam,this.currentOp.EffectId);
				// this.taskPromise.call();
				// var skillVo:gamevo.SkillBaseVO = gameMngers.skillInfoMnger.getVO(this.currentOp.skillId);
				// this.logTf.appendText(`【${this.names[this.currentOp.attckteam]}】对【${this.names[this.currentOp.targetteam]}】'释放【${skillVo.name}】技能:【${this.names[this.currentOp.targetteam]}】 战力下降${this.currentOp.result}`);
				break;
			case gamesystem.OPType_MaskHide:
				this.action_maskHide(this.nextOP.bind(this))
				break;
			case gamesystem.OPType_Dialog:
				this.action_dialog(this.nextOP.bind(this));
				break;
			case gamesystem.OPType_End:
				this.action_maskShow(()=>{
					this.battleResult.show(this,320,400,this.currentOp.targetteam ===0,()=>{
						if(this.currentOp.targetteam ===0){
							this.action_shock();
							gameCore.finishMapChild();
						}
						this.isRunning = false;
					})
				});
				var win:gameviews.BattleTeam;
				var fail:gameviews.BattleTeam;
				if(this.currentOp.targetteam ===0){
					win = this.battleteams[0];
					fail = this.battleteams[1];
				}
				else{
					win = this.battleteams[1];
					fail = this.battleteams[0];
				}
				win.playAnimaById(gamesystem.AnimaDownStand);
				egret.Tween.get(win).
				to({yy:win.yy-50},300).
				to({yy:win.yy},300).
				to({yy:win.yy-50},300).
				to({yy:win.yy},300).call(()=>{
					win.playAnimaById(gamesystem.AnimaRightTurn);
				});

				fail.playAnimaById(gamesystem.AnimaDownStand);
				egret.Tween.get(fail).to({alpha:0,yy:fail.yy - 50},3000);
				// this.logTf.appendText(`战斗结束！【${this.names[this.currentOp.targetteam]}】获得胜利!`);
			break;
		}

		// this.logTf.appendText('\n');
		this.opIndex++;
		if(nextBool){
			this.nextOP();
		}
	}

	private set isRunning(value:boolean){
		this.exitTf.visible = !value;
		if(value){
			this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onExit,this);
		}
		else{
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onExit,this);
		}
	}

	protected onExit():void{
		if(this.battleResult.parent)
		{
			this.battleResult.parent.removeChild(this.battleResult);
		}
		gameviews.viewManager.hideBattleScene();
	}


	protected action_initInfo(success?:()=>void){
		this.atkTf1.text = this.currentOp.teamInfo1.buff.attckSpeed+'';
		this.defTf1.text = this.currentOp.teamInfo1.buff.defend+'';
		this.avoidTf1.text = this.currentOp.teamInfo1.buff.dodge+'';
		this.kingTf1.text = this.currentOp.teamInfo1.buff.king+'';
		this.pro1.maximum = this.currentOp.teamInfo1.totalZD;
		this.pro1.value= this.currentOp.teamInfo1.curZDL;
		this.hpTf1.text = this.currentOp.teamInfo1.curZDL+'';

		this.atkTf2.text = this.currentOp.teamInfo2.buff.attckSpeed+'';
		this.defTf2.text = this.currentOp.teamInfo2.buff.defend+'';
		this.avoidTf2.text = this.currentOp.teamInfo2.buff.dodge+'';
		this.kingTf2.text = this.currentOp.teamInfo2.buff.king+'';
		this.pro2.maximum = this.currentOp.teamInfo2.totalZD;
		this.pro2.value= this.currentOp.teamInfo2.curZDL;
		this.hpTf2.text = this.currentOp.teamInfo2.curZDL+'';
		this.roundTf.text = this.currentOp.round+'';
		if(success)
		{
			success();
		}
	}

	private action_forward(success:()=>void,teamId:number){
		var attackBattleTeam:gameviews.BattleTeam = this.battleteams[teamId];
		var pos:number[] = this.battleteamPos[teamId];
		egret.Tween.get(attackBattleTeam).
			to({x:pos[2]},200).
			wait(100).
			to({x:pos[3]},50).
			to({x:pos[2]},50).
			wait(100).
			to({x:pos[1]},200).call(success);
	}

	private action_showHurt(success:()=>void,teamId:number,num:number){
		this.action_initInfo();
		new gameviews.BattleHurtText().show(this.roleGroup,teamId===0?160:480,BattleScene.BattleTeamY-300,num);
		gameutils.asynMnger.addOnceCB(1000,success,this);
	}

	private action_sceneColor(color:number,success?:()=>void){
		this.maskRect.fillColor = color;
		this.maskRect.visible = true;
		this.maskRect.alpha = 0;
		egret.Tween.get(this.maskRect).to({alpha:0.5},700).
		to({alpha:0},700).
		call(()=>{
			this.maskRect.visible = false;
			if(success)
				success();
		});
	}

	private action_backOut(success:()=>void,teamId:number){
		var attackBattleTeam:gameviews.BattleTeam = this.battleteams[teamId];
		var pos:number[] = this.battleteamPos[teamId];
		egret.Tween.get(attackBattleTeam).
			to({x:pos[0]},100).call(success);
	}

	private action_backIn(success:()=>void,teamId:number){
		var attackBattleTeam:gameviews.BattleTeam = this.battleteams[teamId];
		var pos:number[] = this.battleteamPos[teamId];
		egret.Tween.get(attackBattleTeam).
			to({x:pos[1]},100).call(success);
	}

	private action_maskShow(success:()=>void):void{
		this.maskBg.visible = true;
		this.maskBg.alpha = 0;
		egret.Tween.get(this.maskBg).to({alpha:1},1000).call(success);
	}

	private action_maskHide(success:()=>void):void{
		this.maskBg.visible = true;
		this.maskBg.alpha = 1;
		egret.Tween.get(this.maskBg).to({alpha:0},1000).call(()=>{
			this.maskBg.visible = false;
			success();
		});
	}

	private action_shock():void{
		new gameutils.Shock().start(this.bg,5,600,60);
	}

	private action_playSkillName(success:()=>void,teamId:number,skillId:string):void{
		var pos:number[] = this.battleteamPos[teamId];
		this.battleSkillText.show(this,pos[1]-(teamId==0?100:0),BattleScene.BattleTeamY - 100,skillId);
		gameutils.asynMnger.addOnceCB(500,success,this);
	}

	protected action_dialog(success:()=>void):void{
		if(this.currentOp.mes)
		{
			var pos:number[] = this.battleteamPos[this.currentOp.targetteam];
			gameviews.viewManager.showDialogByXY(pos[1],BattleScene.BattleTeamY,this.currentOp.dialogRoleId,this.currentOp.mes,this.currentOp.targetteam === 0);
			gameutils.asynMnger.addOnceCB(2000,success,this);
		}
		else{
			gameviews.viewManager.hideDialog();
			gameutils.asynMnger.addOnceCB(30,success,this);

		}
	}

	private action_playEffect(success:()=>void,teamId:number,skillId:string):void{
		this.action_shock();
		this.action_sceneColor(0xff0000);
		this._playSkillCb = success;
		var pos:number[] = this.battleteamPos[teamId];
		if(teamId ===0)
		{
			this.effectPlayer.scaleX = 3;
			this.effectPlayer.x =pos[1] - 60;
		}
		else
		{
			this.effectPlayer.scaleX = -3;
			this.effectPlayer.x =pos[1] + 60;
		}
		this.effectPlayer.playAnimaByEffectId(skillId);
		this.roleGroup.addChild(this.effectPlayer);
	}
	private _playSkillCb:()=>void;
	private onEffectComplete():void{
		if(this.effectPlayer.parent){
			this.effectPlayer.parent.removeChild(this.effectPlayer);
		}
		this._playSkillCb();
	}
}