/**冒险面板 */
class FightPanel extends eui.Component implements  eui.UIComponent {
	public bagBtn:eui.Button;
	public teamBtn:eui.Button;
	public mapIndexBtn:eui.Button;
	public mapLevelBtn:eui.Button;
	public mapLevelList:eui.List;
	public mapLevelListData:eui.ArrayCollection = new eui.ArrayCollection();
	public mapGuajiAnimaPlayer:gameAnima.MapGuajiAnimaPlayer;
	public mapItem1:MapItem;
	public mapItem2:MapItem;
	public mapItem3:MapItem;
	public mapItem4:MapItem;
	public mapItem5:MapItem;
	public mapItems:MapItem[] = [];
	public goldSpeedTf:eui.Label;
	public expSpeedTf:eui.Label;
	public mapNameTf:eui.Label;
	public waitBar:FightWaitBar;
	public fightBtn:FightBtn;
	public constructor() {
		super();
		this.mapGuajiAnimaPlayer = new gameAnima.MapGuajiAnimaPlayer;
		this.addEventListener( eui.UIEvent.COMPLETE, this.oncomplate, this );
	}

	private oncomplate():void{
		this.pushMapItem(this.mapItem1);
		this.pushMapItem(this.mapItem2);
		this.pushMapItem(this.mapItem3);
		this.pushMapItem(this.mapItem4);
		this.pushMapItem(this.mapItem5);

		this.mapLevelList = new eui.List();
		this.mapLevelList.itemRenderer = MapLevelItem;
		this.mapLevelList.addEventListener(egret.Event.CHANGE, this.onMapLevelChange, this)
		this.mapLevelList.x = 5;
		this.mapLevelList.y = this.mapLevelBtn.y+this.mapLevelBtn.height;

		this.teamBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShowQianghua,this)
		this.bagBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShowBag,this)
		this.mapIndexBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShowMapChoose,this)
		this.mapLevelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShowMapLevel,this)

		this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemoveFromStage, this);
		this.mapGuajiAnimaPlayer.y = 550;
		this.mapGuajiAnimaPlayer.x = 13;
		this.mapGuajiAnimaPlayer.scaleY = this.mapGuajiAnimaPlayer.scaleX = 2.40;
		this.addChildAt(this.mapGuajiAnimaPlayer,1);
		
		this.waitBar.slideDuration = 0;
		this.waitBar.minimum = 0;
		this.waitBar.maximum = this.WaitBarMax;
	}

	private WaitBarMax:number = 1000;

	private pushMapItem(item:MapItem):void{
		item.mapChildId = this.mapItems.length;
		this.mapItems.push(item);
		item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChooseMapChild, this);
	}

	private onChooseMapChild(e:egret.TouchEvent):void{
		var item:MapItem = e.currentTarget;
		if(item.canChoose && item.mapChildId !== gameCore.currentUserInfo.curMapChild){
			gameCore.changeMapChild(item.mapChildId);
		}
	}

	private onMapLevelChange():void{
		if(this.mapLevelList.selectedItem === gameCore.currentUserInfo.curMapLevel){
			return;
		}
		gameCore.changeMapLevel(this.mapLevelList.selectedItem);
	}

	private onShowMapLevel():void{
		// gameviews.viewManager.showHeroPanel();
		var maxLevel:number = Math.min(gamesystem.MaxMapLevel,gameCore.currentUserInfo.currentMO.maxMapLevel+1);
		var data:number[] = [];
		for(var i:number = 0;i < maxLevel;i++)
		{
			data.push(i);
		}
		this.mapLevelListData.source = data;
		this.mapLevelList.dataProvider = this.mapLevelListData;
		this.addChild(this.mapLevelList);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.hideMapLevelList,this);
	}

	private hideMapLevelList(e?:egret.TouchEvent):void{
		if(e && e.target === this.mapLevelBtn) return;
		gameutils.asynMnger.addOnceCB(30,()=>{
			if(this.mapLevelList.parent)
			{
				this.removeChild(this.mapLevelList);
			}
		},this);
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.hideMapLevelList,this);
	}

	private onShowMapChoose():void{
		gameviews.viewManager.showMapChoosePanel();
	}

	private onShowQianghua():void{
		gameviews.viewManager.showQianghuaPanel();
	}
	private onShowBag():void{
		gameviews.viewManager.showBagPanel();
	}

	public show():void{
		this.oldMap = -1;
		gameCore.eventDispatch.addEventListener(gameCore.Event_MapChange, this.updateMap,this);

		this.updateMap();
		gameutils.asynMnger.addCB(40,this.onTick,this);
	}


	private onRemoveFromStage():void{
		this.hideMapLevelList();
		gameutils.asynMnger.removeCB(this.onTick,this);
		gameCore.eventDispatch.removeEventListener(gameCore.Event_MapChange, this.updateMap,this);

	}

	/**轮询更新挂机信息 */
	private onTick():void{
		this.updateMapStatus();
		this.fightBtn.render();
	}

	private oldMap:number;
	private oldMapLevel:number;
	private oldMapChild:number;
	/**更新地图相关信息 */
	public updateMap():void{
		var mapVo:gamevo.MapVO = gameMngers.mapInfoMnger.getVO(gameCore.currentUserInfo.curMap+'');
		var mapChild:gamevo.MapChildVO = mapVo.mapChilds[gameCore.currentUserInfo.curMapChild];
		if(this.oldMap !== gameCore.currentUserInfo.curMap || this.oldMapLevel !== gameCore.currentUserInfo.curMapLevel || this.oldMapChild !== gameCore.currentUserInfo.curMapChild)
		{
			this.mapGuajiAnimaPlayer.resetGuajiAnima(mapVo.guajiAnima);
			gameviews.viewManager.showBottomMes(mapChild.mes);
		}
		this.oldMap = gameCore.currentUserInfo.curMap;
		this.oldMapLevel = gameCore.currentUserInfo.curMapLevel;
		this.oldMapChild = gameCore.currentUserInfo.curMapChild;

		this.mapLevelBtn.label = gamesystem.MapLevelLabel[gameCore.currentUserInfo.curMapLevel];
		this.mapNameTf.text = mapVo.name;
		this.goldSpeedTf.text = mapVo.goldSpeed+'/s';
		this.expSpeedTf.text = mapVo.expSpeed+'/s';
		for(var i:number = 0;i < gamesystem.MaxMapChild;i++)
		{
			this.mapItems[i].setMapChildVo(mapVo,mapVo.mapChilds[i]);
		}
		this.waitBar.mapIndexTf.text = (gameCore.currentUserInfo.curMap+1)+'-'+(gameCore.currentUserInfo.curMapChild+1);
		this.updateMapStatus();
	}

	/**更新玩家当前关卡状态信息 */
	private updateMapStatus():void{
		var mapVo:gamevo.MapVO = gameMngers.mapInfoMnger.getVO(gameCore.currentUserInfo.curMap+'');
		switch(gameCore.currentUserInfo.curMapStatus){
			case gamesystem.MapStatus_Guaji:
				this.waitBar.mapNameTf.text = '准备饮料中';
				var guajiTime:number = gameutils.getTimer() - gameCore.currentUserInfo.curMapGuajiTime;
				var remainTime:number = Math.max(0,mapVo.waitTime - guajiTime);
				this.waitBar.mapTimeTf.text = gameutils.formatTime(remainTime,'mm:ss');
				var per:number = Math.min(1,guajiTime/mapVo.waitTime);
				this.waitBar.value =  per*this.WaitBarMax;
				if(per===1){
					gameCore.changeMapChildStatus(gamesystem.MapStatus_ReadyFight);
				}
			break;
			case gamesystem.MapStatus_ReadyFight:
				this.waitBar.mapTimeTf.text = '∞';
				this.waitBar.mapNameTf.text = '饮料准备好了';
				this.waitBar.value = this.WaitBarMax;
			break;
			case gamesystem.MapStatus_FightEnd:
				this.waitBar.mapTimeTf.text = '∞';
				this.waitBar.mapNameTf.text = '饮料喝完了';
				this.waitBar.value = this.WaitBarMax;
				break;
		}

	}
}