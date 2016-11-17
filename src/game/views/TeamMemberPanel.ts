/**所有成员队伍面板*/
class TeamMemberPanel extends eui.Component implements  eui.UIComponent {
	private closeBtn:eui.Button;
	public roleList:eui.List;
	private roleListData:eui.ArrayCollection = new eui.ArrayCollection;
	public nameTf:eui.Label;
	public skillList:eui.List;
	public skillListData:eui.ArrayCollection
	public skillNameTf:eui.Label;
	public skillRolesTf:eui.Label;
	public skillPerTf:eui.Label;
	public skillEnabledTf:eui.Label;
	public attTf:eui.Label;
	public defTf:eui.Label;
	public avoidTf:eui.Label;
	public skillDesTf:eui.Label;
	public wangzheTf:eui.Label;
	public tuijianBtn:eui.Button;
	public diaozhengBtn:eui.Button;
	private _currentSkill:string;
	private  _currentRole:gameCore.HeroMO;
	public constructor() {
		super();
		 this.addEventListener( eui.UIEvent.COMPLETE, this.onComplete, this );

	}
	
	private onComplete():void{
		this.roleList.itemRenderer = TeamListItem;
		this.roleList.addEventListener(egret.Event.CHANGE,this.onSelectedRole,this);
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this)

		this.skillList.itemRenderer = SkillISlottem;
		this.skillListData = new eui.ArrayCollection;
		this.skillList.addEventListener(egret.Event.CHANGE,this.onSelectedSkill,this);
	}

	private onSelectedRole():void{
		this.currentRole = this.roleList.selectedItem;
	}

	private onSelectedSkill():void{
		this.currentSkill = this.skillList.selectedItem;
	}


	public set currentSkill(value:string){
		this._currentSkill = value;
		if(this._currentSkill)
		{
			var vo:gamevo.SkillBaseVO = gameMngers.skillInfoMnger.getVO(this._currentSkill);
			this.skillNameTf.text ='技能：'+ vo.name;
			this.skillDesTf.text = vo.des;
			this.skillRolesTf.visible = vo.isGroupSkill;
		}
		else{
			this.skillNameTf.text ='';
			this.skillDesTf.text = '';
			this.skillRolesTf.visible = false;
		}
		this.skillEnabledTf.visible = false;
	}

	public set currentRole(role:gameCore.HeroMO){
		this._currentRole = role;
		var skills:string[] = role.roleVo.skills.concat();
		skills.length = 4;
		this.skillListData.source = skills;
		this.skillList.dataProvider = this.skillListData;
		this.skillList.selectedIndex = 0;
		this.nameTf.text = role.roleVo.name;
		this.currentSkill = this.skillList.selectedItem;
	}


	public show():void{
		this.roleListData.source = gameCore.currentUserInfo.getAllHero();
		this.roleList.dataProvider = this.roleListData;
		this.roleList.selectedIndex = 0;
		this.onSelectedRole();
	}

	private onClose():void{
		gameviews.viewManager.hideCurrentPanel();
	}
	
}