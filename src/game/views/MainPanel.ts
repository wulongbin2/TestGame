/**主界面 */
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
	public zdlTf:eui.Label;
	public expTf:eui.Label;
	public goldTf:eui.Label;
	public moneyTf:eui.Label;
	public timeTf:eui.Label;
	public messageGroup:eui.Group;
	public messageTf:egret.TextField;
	public constructor() {
		super();
		this.addEventListener( eui.UIEvent.COMPLETE, this.oncomplate, this );
		this.addEventListener( egret.Event.ADDED_TO_STAGE, this.addToStage, this );
		this.addEventListener( egret.Event.REMOVED_FROM_STAGE, this.removeFromStage, this );

	}

	private addToStage():void{
		gameutils.asynMnger.addCB(33,this.onTick,this)
	}

	private onTick():void{
		this.expTf.text = gameutils.zdlToString(gameCore.currentUserInfo.exp);
		this.moneyTf.text = gameutils.zdlToString(gameCore.currentUserInfo.money);
		this.goldTf.text = gameutils.zdlToString(gameCore.currentUserInfo.gold);
		this.zdlTf.text = gameutils.zdlToString(gameCore.currentUserInfo.totalZDL);
		var d:Date = new Date();
		this.timeTf.text = (d.getMonth()+1)+'/'+d.getDate()+' '+gameutils.timeToString(d.getHours())+":"+gameutils.timeToString(d.getMinutes());
		if(this.isMoveMessage){
			this.messageTf.x -=2;
			if(this.messageTf.x <=-this.messageTf.width){
				this.endMessage();
			}
		}
	}

	private isMoveMessage:boolean = false;
	public startMessage(mes:string){
		this.isMoveMessage = true;
		this.messageTf.visible = true;
		this.messageTf.text = mes;
		this.messageTf.width = this.messageTf.textWidth;
		this.messageTf.x = 405;
	}

	public endMessage(){
		this.isMoveMessage  = false;
		this.messageTf.visible = false;
	}


	private removeFromStage():void{
		gameutils.asynMnger.removeCB(this.onTick,this)
	}

	private oncomplate():void{
		this.messageTf = new egret.TextField();
		this.messageTf.size = 20;
		this.messageTf.fontFamily ='黑体';
		this.messageGroup.addChild(this.messageTf);
		this.messageTf.visible  = false;
		this.messageGroup.mask = new egret.Rectangle(0,0,405,30);
		this.startGame = new StartGame();
		this.fightPanel = new FightPanel();
		this.yongbinPanel = new YongbinPanel();
		this.mainMenu1.selected = true;
		this.mainMenu1.group.addEventListener( egret.Event.CHANGE,this.updateView,this);

		this.startGame.addEventListener('startGame',this.startGameHd,this);
		this.updateView();

		this.startMessage('哈哈哈哈哈哈哈，欢迎来到山寨游戏世界！本山寨游戏乃大神（鬼月雨路）鬼斧神工之作，超强地展现了大神的奇怪思维能力，预知后事发展，请联系大神QQ：742057152 ╮(╯▽╰)╭ ')
	}

	private startGameHd():void{
		this.mainMenu2.group.selection = this.mainMenu2; 
		this.updateView();
	}

	private _currentTab:egret.DisplayObject;
	/**当前面板 */
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
			if(this._currentTab['show']){
				this._currentTab['show']();
			}
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
		else
		if(this.mainMenu2.selected)
		{
			this.currentTab = this.fightPanel;
		}
		else
		if(this.mainMenu6.selected)
		{
			this.currentTab = this.yongbinPanel;
		}
	}
	
}