/**出场阵容面板 */
class TeamPanel extends eui.Component implements  eui.UIComponent {
	private closeBtn:eui.Button;
	private removeBtn:eui.Button;
	private addBtn:eui.Button;
	public nameTf:eui.Label;
	public skillList:eui.List;
	public skillListData:eui.ArrayCollection
	public skillNameTf:eui.Label;
	public skillPerTf:eui.Label;
	public skillEnabledTf:eui.Label;
	public attTf:eui.Label;
	public defTf:eui.Label;
	public avoidTf:eui.Label;
	public skillDesTf:eui.Label;
	public wangzheTf:eui.Label;
	public tuijianBtn:eui.Button;
	public diaozhengBtn:eui.Button;
	public listGroup:eui.Group;
	private _currentSkill:string;
	private  _currentRole:gameCore.HeroMO;
	private _dragTeam:gameviews.DragTeam = new gameviews.DragTeam;
	private _dragEnabled:boolean = false;
	private _chooseRole:ChooseRole = new ChooseRole;
	public constructor() {
		super();
		 this.addEventListener( eui.UIEvent.COMPLETE, this.onComplete, this );
	}

	private onComplete():void{
		this._dragTeam.addEventListener(egret.Event.CHANGE,this.onSelectedRole,this);
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this)
		this.diaozhengBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTiaoZheng, this)
		this.skillList.itemRenderer = SkillISlottem;
		this.skillListData = new eui.ArrayCollection;
		this.skillList.addEventListener(egret.Event.CHANGE,this.onSelectedSkill,this);
		this.addBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAdd, this);
		this.removeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRemove, this);
		this._dragTeam.x = 69;
		this._dragTeam.y = 315;
		this.listGroup.addChild(this._dragTeam);
	}

	private onAdd():void{
		var nowTeams:gameCore.HeroMO[] = this._dragTeam.getDataAfterSort();
		var allTeams:gameCore.HeroMO[] = gameCore.currentUserInfo.getAllHero(true);
		nowTeams.forEach(item=>{
			allTeams.splice(allTeams.indexOf(item),1);
		});
		this._chooseRole.showData(this,allTeams,(result)=>{
				this._dragTeam.replaceSelectedItem(result);
				this.updateBuffInfo();
				this.updateToModel();
			}
		);
	}

	private onRemove():void{
		this._dragTeam.removeCurrent();
		this.updateBuffInfo();
		this.updateToModel();
	}

	private onTiaoZheng():void{
		this.dragEnabled  = !this.dragEnabled;
	}

	private onSelectedRole():void{
		this.currentRole = this._dragTeam.selectedItem.data;
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
		}
		else{
			this.skillNameTf.text ='';
			this.skillDesTf.text = '';
		}
		this.skillEnabledTf.visible = false;
	}

	public set currentRole(role:gameCore.HeroMO){
		this._currentRole = role;
		var skills:string[] 
		if(role)
		{
			 skills = role.roleVo.skills.concat();
			this.nameTf.text = role.roleVo.name;
		}
		else{
			skills = [];
			this.nameTf.text = '';
		}
		skills.length = 4;
		this.skillListData.source = skills;
		this.skillList.dataProvider = this.skillListData;
		this.skillList.selectedIndex = 0;
		this.currentSkill = this.skillList.selectedItem;
		this.updateAddAndRemoveBtn();
		if(!role){
			this.onAdd();
		}
	}

	private _tempBuff:gamevo.BuffVO = new gamevo.BuffVO;
	public updateBuffInfo(){
		var buff = gameCore.calculAllHeroBuff(this._dragTeam.getDataAfterSort(),this._tempBuff)
		this.attTf.text= this._tempBuff.attckSpeed+'';
		this.defTf.text= this._tempBuff.defend+'';
		this.avoidTf.text= this._tempBuff.dodge+'';
		this.wangzheTf.text= this._tempBuff.king+'';
	}

	private heros:gameCore.HeroMO[];
	public show():void{
		this.heros = gameCore.currentUserInfo.getAllTeamHero(true);
		this.heros.length = gameCore.currentUserInfo.playerBagMnger.teamHeroBag.availgridsNum;
		this._dragTeam.data = this.heros;
		this.currentRole = this._dragTeam.selectedItem.data;
		this.updateBuffInfo();
	}

	public hide():void{
		this._chooseRole.hide();
		this.dragEnabled = false;
		this.updateToModel();
	}

	private updateToModel():void{
		gameCore.changeTeam(this._dragTeam.getDataAfterSort());
	}

	private onClose():void{
		gameviews.viewManager.hideCurrentPanel();
	}

	public set dragEnabled(value:boolean){
		if(this._dragEnabled == value)  return;
		this._dragEnabled = value;
		this._dragTeam.dragEnabled = value;
		this.diaozhengBtn.label = value?'调整结束  ':'手动调整  ';
		egret.Tween.removeTweens(this.listGroup);
		if(!value){
			egret.Tween.get(this.listGroup).to({y:73},300);
		}
		else{
			egret.Tween.get(this.listGroup).to({y:-45},300);
		}
		this.updateAddAndRemoveBtn();
	}

	protected updateAddAndRemoveBtn():void{
		this.addBtn.visible = this.removeBtn.visible = this._currentRole && this._dragEnabled;
	}

	public get dragEnabled():boolean{
		return this._dragEnabled
	}
	
}