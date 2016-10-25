class MainPanel extends eui.Component implements  eui.UIComponent {
	public tabContainer:eui.Group;
	public startGame:StartGame;
	public fightPanel:FightPanel;
	public yongbinPanel:YongbinPanel;
	public mainMenu1:eui.RadioButton;
	public mainMenu2:eui.RadioButton;
	public mainMenu3:eui.RadioButton;
	public mainMenu4:eui.RadioButton;
	public mainMenu5:eui.RadioButton;
	public mainMenu6:eui.RadioButton;
	public constructor() {
		super();
		this.addEventListener( eui.UIEvent.COMPLETE, this.oncomplate, this );

	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
	}

	private oncomplate():void{
		this.startGame = new StartGame();
		this.fightPanel = new FightPanel();
		this.yongbinPanel = new YongbinPanel();
		this.mainMenu1.selected = true;
		this.mainMenu1.group.addEventListener( egret.Event.CHANGE,this.updateView,this);

		this.startGame.addEventListener(egret.TouchEvent.TOUCH_TAP,this.startGameHd,this);
		this.updateView();
	}

	private startGameHd():void{
		this.mainMenu2.selected = true;
		this.updateView();
	}

	private _currentTab:egret.DisplayObject;
	public set currentTab(value:egret.DisplayObject){
		if(this._currentTab ===value) return;
		if(this._currentTab)
		{
			this.tabContainer.removeChild(this._currentTab);
		}
		this._currentTab = value;
		if(this._currentTab)
		{
			this.tabContainer.addChild(this._currentTab);
		}
	}

	private updateView():void{
		this.updateTabSelected();

	}

	public updateTabSelected():void{
		if(this.mainMenu1.selected)
		{
			this.currentTab = this.startGame;
		}
		if(this.mainMenu2.selected)
		{
			this.currentTab = this.fightPanel;
		}

		if(this.mainMenu6.selected)
		{
			this.currentTab = this.yongbinPanel;
		}
	}
	
}