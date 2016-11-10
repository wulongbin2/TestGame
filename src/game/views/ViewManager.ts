module gameviews {
	/**视图管理 */
	class ViewManager extends egret.Sprite{
		private mainPanel:MainPanel;
		private bagPanel:BagPanel;
		private qianghuaPanel:QianghuaPanel;
		private teamPanel:TeamPanel;
		private tujianPanel:TujianPanel;
		private teamMemberPanel:TeamMemberPanel;
		private heroPanel:HeroPanel;
		public mapChoosePanel:MapChoosePanel;
		private battleScene:BattleScene;
		private alertPanel:AlertPanel;
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

		public showBattleScene(team1:gameCore.BattleTeamInfo,team2:gameCore.BattleTeamInfo,bg:string):void{
			this.addChild(this.battleScene);
			this.battleScene.start(team1,team2,bg);
		}

		public showAlertMes(mes:string,title?:string){
			this.addChild(this.alertPanel);
			this.alertPanel.show(mes,title);
		}

		public hideBattleScene():void{
			this.removeChild(this.battleScene);
		}

		public showBottomMes(mes:string){
			this.mainPanel.startMessage(mes);
		}

	}

	export var viewManager:ViewManager = new ViewManager;
}