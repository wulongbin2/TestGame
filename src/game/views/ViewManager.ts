module gameviews {
	/**视图管理 */
	class ViewManager extends egret.Sprite{
		private mainPanel:MainPanel;//主界面
		private bagPanel:BagPanel;//背包界面
		private qianghuaPanel:QianghuaPanel;//升级界面
		private teamPanel:TeamPanel;//队伍布阵界面
		private tujianPanel:TujianPanel;//图鉴界面
		private teamMemberPanel:TeamMemberPanel;//佣兵界面
		private heroPanel:HeroPanel;//英雄展示界面
		public mapChoosePanel:MapChoosePanel;//地图选择界面
		private battleScene:BattleScene;//战斗场景界面
		private alertPanel:AlertPanel;//警告界面
		private tip:SkillBG;//提示框
		private dialog:DialogBG;//对话框
		private gameOverScene:GameOverScene;//游戏结束场景
		public init():void{
			this.mainPanel = new MainPanel();
			this.bagPanel = new BagPanel();
			this.teamPanel = new TeamPanel();
			this.tujianPanel = new TujianPanel();
			this.qianghuaPanel = new QianghuaPanel();
			this.mapChoosePanel = new MapChoosePanel();
			this.teamMemberPanel = new TeamMemberPanel();
			this.heroPanel = new HeroPanel();
			this.battleScene = new BattleScene();
			this.alertPanel = new AlertPanel();
			this.tip = new SkillBG();
			this.dialog = new DialogBG();
			this.gameOverScene = new GameOverScene();
			gameCore.eventDispatch.addEventListener(gameCore.Event_GetHero,this.onGetHero,this);
		}

		private onGetHero(e:egret.Event):void{
			this.showHeroPanel((e.data as gameCore.HeroMO).roleId,true);
		}
		

		public showMainPanel():void{
			this.addChild(this.mainPanel);
		}

		public hideMainPanel():void{
			this.removeChild(this.mainPanel);
		}

		public showBagPanel():void{
			this.addChild(this.bagPanel);
			this.bagPanel.show();
		}

		public showHeroPanel(roleId:string,checkNew:boolean = false):void{
			this.heroPanel.showHero(roleId,checkNew);
			this.addChild(this.heroPanel);
		}

		public hideHeroPanel():void{
			this.removeChild(this.heroPanel);
		}

		public hideBagPanel():void{
			this.removeChild(this.bagPanel);
		}

		public showQianghuaPanel():void{
			this.mainPanel.currentTab = this.qianghuaPanel;
		}

		public showTeamPanel():void{
			this.mainPanel.currentTab = this.teamPanel;
		}

		public showTujianPanel():void{
			this.mainPanel.currentTab = this.tujianPanel;
		}

		public showMemberPanel():void{
			this.mainPanel.currentTab = this.teamMemberPanel;
		}

		public showMapChoosePanel():void{
			this.mainPanel.currentTab = this.mapChoosePanel;
		}

		public hideCurrentPanel():void{
			this.mainPanel.updateTabSelected();
		}

		public showBattleScene(team1:gameCore.BattleTeamInfo,team2:gameCore.BattleTeamInfo,bg:string,mapChild?:gamevo.MapChildVO):void{
			this.mainPanel.visible =false;
			this.addChild(this.battleScene);
			this.battleScene.start(team1,team2,bg, mapChild);
		}

		public showAlertMes(mes:string,title?:string){
			this.addChild(this.alertPanel);
			this.alertPanel.show(mes,title);
		}

		public hideBattleScene():void{
			this.mainPanel.visible =true;
			this.removeChild(this.battleScene);
		}

		public showBottomMes(mes:string){
			this.mainPanel.startMessage(mes);
		}

		private tempP:egret.Point = new egret.Point();
		public showTip(dis:egret.DisplayObject,mes:string):void{
			dis.localToGlobal(0,0, this.tempP);
			this.tip.showText(this,this.tempP.x,this.tempP.y,mes);
		}

		// public showDialog(dis:egret.DisplayObject,mes:string,isLeftBg:boolean = true):void{
		// 	dis.localToGlobal(0,0, this.tempP);
		// 	this.dialog.showText(this,this.tempP.x,this.tempP.y,mes,isLeftBg);
		// }

		public showDialogByXY(x:number,y:number,roleId:string,mes:string,isLeftBg:boolean = true):void{
			this.dialog.showText(this,x,y,roleId,mes,isLeftBg);
		}

		public hideDialog():void{
			if(this.dialog.parent)
			{
				this.dialog.parent.removeChild(this.dialog);
			}
		}

		public gameOver():void{
			this.mainPanel.visible =false;
			this.addChild(this.gameOverScene);
			this.gameOverScene.gameOver();
		}

	}

	export var viewManager:ViewManager = new ViewManager;
}