/**开始战斗按钮 */
class FightBtn extends eui.Button implements  eui.UIComponent {
	public fightBg:eui.Image;
	public waitBg:eui.Image;
	public fightIcon:eui.Image;
	public labelIcon:eui.Image;
	public zhen:eui.Group;
	public constructor() {
		super();
		this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClick,this)
	}

	private onClick():void{
		if(gameCore.currentUserInfo.curMapStatus === gamesystem.MapStatus_FightEnd)
		{
			gameCore.nextMapChild();
		}
	}

	private time:number = 0;
	private centerR:number = -60;
	private centerMaxOffR:number = 30;
	private centerMinOffR:number = 15;
	private centerCircleTime:number = 120;//抖动角度周期
	private doudongCircleTime:number = 15;//抖动周期
	public render():void{
		this.time++;
		switch(gameCore.currentUserInfo.curMapStatus)
		{
			case gamesystem.MapStatus_Guaji:
				this.labelIcon.visible = this.fightIcon.visible  = this.fightBg.visible = false;
				this.zhen.visible = this.waitBg.visible  = true;
				var temp:number = (this.time%this.centerCircleTime)/this.centerCircleTime*Math.PI;
				var maxR:number = this.centerMinOffR+(this.centerMaxOffR - this.centerMinOffR)*Math.sin(temp);
				temp =(this.time%this.doudongCircleTime)/this.doudongCircleTime*Math.PI*2;
				this.zhen.rotation = Math.sin(temp)*maxR+this.centerR;
			break;
			case gamesystem.MapStatus_ReadyFight:
				this.labelIcon.visible = this.fightIcon.visible  = this.fightBg.visible = true;
				this.zhen.visible = this.waitBg.visible  = false;
				this.fightIcon.source = 'maze_eventbtn_fight_d_png';
				this.labelIcon.source = 'maze_eventbtntxt_fight_png';
				break;
			case gamesystem.MapStatus_FightEnd:
				this.labelIcon.visible = this.fightIcon.visible  = this.fightBg.visible = true;
				this.zhen.visible = this.waitBg.visible  = false;
				this.fightIcon.source = 'maze_eventbtn_passbg_d_png';
				if(gameCore.currentUserInfo.curMapChild === gamesystem.MaxMapChild -1)
				{
					this.labelIcon.source = 'maze_eventbtntxt_land_png';
				}
				else{
					this.labelIcon.source = 'maze_eventbtntxt_mission_png';
				}
				break;

		}
	}
}