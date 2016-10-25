module gameviews {
	class ViewManager {
		private mainPanel:MainPanel;
		private bagPanel:BagPanel;
		private qianghuaPanel:QianghuaPanel;
		private viewContain:egret.DisplayObjectContainer;
		public constructor() {
		}

		public init(viewContain:egret.DisplayObjectContainer):void{
			this.viewContain = viewContain;
			this.mainPanel = new MainPanel();
			this.bagPanel = new BagPanel();
			this.qianghuaPanel = new QianghuaPanel();
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

		public hideBagPanel():void{
			this.viewContain.removeChild(this.bagPanel);
		}

		public showQianghuaPanel():void{
			this.mainPanel.currentTab = this.qianghuaPanel;
		}

		public hideQianghuaPanel():void{
			this.mainPanel.updateTabSelected();
		}
	}

	export var viewManager:ViewManager = new ViewManager;
}