module gameviews {
	/**视图管理 */
	class ViewManager {
		private mainPanel:MainPanel;
		private bagPanel:BagPanel;
		private qianghuaPanel:QianghuaPanel;
		private teamPanel:TeamPanel;
		private tujianPanel:TujianPanel;
		private teamMemberPanel:TeamMemberPanel;
		private heroPanel:HeroPanel;
		public mapChoosePanel:MapChoosePanel;
		private viewContain:egret.DisplayObjectContainer;
		public constructor() {
		}

		public init(viewContain:egret.DisplayObjectContainer):void{
			this.viewContain = viewContain;
			this.mainPanel = new MainPanel();
			this.bagPanel = new BagPanel();
			this.teamPanel = new TeamPanel();
			this.tujianPanel = new TujianPanel();
			this.qianghuaPanel = new QianghuaPanel();
			this.mapChoosePanel = new MapChoosePanel();
			this.teamMemberPanel = new TeamMemberPanel();
			this.heroPanel = new HeroPanel();
		}
		

		public showMainPanel():void{
			this.viewContain.addChild(this.mainPanel);
		}

		public hideMainPanel():void{
			this.viewContain.removeChild(this.mainPanel);
		}

		public showBagPanel():void{
			this.viewContain.addChild(this.bagPanel);
		}

		public showHeroPanel():void{
			this.mainPanel.currentTab = this.heroPanel;
		}

		public hideBagPanel():void{
			this.viewContain.removeChild(this.bagPanel);
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

	}

	export var viewManager:ViewManager = new ViewManager;
}