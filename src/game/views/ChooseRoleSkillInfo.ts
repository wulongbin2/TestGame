class ChooseRoleSkillInfo extends eui.Component implements  eui.UIComponent {
	private cancleBtn:eui.Button;
	private okBtn:eui.Button;
	public nameTf:eui.Label;
	public skillList:eui.List;
	public skillListData:eui.ArrayCollection
	public skillNameTf:eui.Label;
	public skillEnabledTf:eui.Label;
	public skillDesTf:eui.Label;
	private _currentSkill:string;
	private  _currentRole:gameCore.HeroMO;

	public constructor() {
		super();
		 this.addEventListener( eui.UIEvent.COMPLETE, this.onComplete, this );

	}

	private onComplete():void{
		this.skillList.itemRenderer = SkillISlottem;
		this.skillListData = new eui.ArrayCollection;
		this.skillList.addEventListener(egret.Event.CHANGE,this.onSelectedSkill,this);
		this.okBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOk,this);
		this.cancleBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.hide,this);
	}	

	private onOk(){
		this.hide();
		this.cb();
	}

	public hide():void{
		if(this.parent)
		{
			this.parent.removeChild(this);
		}
	}

	private onSelectedSkill():void{
		this.currentSkill = this.skillList.selectedItem;
	}	

	public set currentRole(role:gameCore.HeroMO){
		this._currentRole = role
		var skills:string[] = role.roleVo.skills.concat();
		skills.length = 4;
		this.skillListData.source = skills;
		this.skillList.dataProvider = this.skillListData;
		this.skillList.selectedIndex = 0;
		this.nameTf.text = role.roleVo.name;
		this.currentSkill = this.skillList.selectedItem;
	}

	public set currentSkill(value:string){
		this._currentSkill = value;
		if(this._currentSkill)
		{
			var vo:gamevo.SkillBaseVO = gameMngers.skillInfoMnger.getVO(this._currentSkill);
			this.skillNameTf.text ='技能：'+ vo.name;
			this.skillDesTf.text = vo.des;
		}
		else{
			this.skillNameTf.text ='';
			this.skillDesTf.text = '';
		}
		this.skillEnabledTf.visible = false;
	}

	private cb:()=>void;
	public show(container:egret.DisplayObjectContainer, role:gameCore.HeroMO,cb:()=>void){
		this.cb = cb;
		container.addChild(this);
		this.currentRole = role;
	}
	
}