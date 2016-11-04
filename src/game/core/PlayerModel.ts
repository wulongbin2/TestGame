module gameCore {
	/**当前地图改变 */
	export const Event_MapChange:string = 'Event_MapChange';
	/**当前地图关卡状态改变 */
	export const Event_MapStatusChange:string = 'Event_MapStatusChange';
	/**获得英雄事件 */
	export const Event_GetHero:string = 'Event_GetHero';
	/**背包物品改变 */
	export const Event_BagChange:string = 'Event_BagChange';


	/**约定currentUserInfo内部属性只访问，不修改，若要修改请调用专用方法*/
	export var currentUserInfo:PlayerMO;
	export function resetUserInfo(mo:PlayerMO):void{
		currentUserInfo = mo;
		offlineAddExpAndGold();
		gameutils.asynMnger.addCB(1000,onlineAddExpAndGold,this);
	}
	/**事件派发 */
	export var eventDispatch:egret.EventDispatcher = new egret.EventDispatcher;

	export function changeMap(mapId:number):void{
		currentUserInfo.curMap = mapId;
		if(currentUserInfo.currentMO === null)
		{
			var newMo:MapMO = new MapMO();
			newMo.init(mapId);
			currentUserInfo.pushMapMo(newMo);
		}
		changeMapLevel(0);
	}

	export function changeMapLevel(level:number):void{
		currentUserInfo.curMapLevel = level
		changeMapChild(currentUserInfo.currentMO.maxMapLevel ===level?currentUserInfo.currentMO.maxMapChild:0);
	}

	export function changeMapChild(id:number):void{
		currentUserInfo.curMapChild = Math.min(id,gamesystem.MaxMapChild-1);
		var mo:MapMO = currentUserInfo.currentMO;
		if(currentUserInfo.curMapLevel<mo.maxMapLevel || currentUserInfo.curMapChild<mo.maxMapChild)
		{
			changeMapChildStatus(gamesystem.MapStatus_FightEnd);
		}
		else{
			changeMapChildStatus(gamesystem.MapStatus_Guaji);
		}
		eventDispatch.dispatchEventWith(Event_MapChange);
	}

	export function changeMapChildStatus(status:number):void{
		currentUserInfo.curMapStatus = status;
		if(status === gamesystem.MapStatus_FightEnd)
		{
			var mo:MapMO = currentUserInfo.getMapMO(currentUserInfo.curMap);
			mo.maxMapChild = Math.min(gamesystem.MaxMapChild,Math.max(currentUserInfo.curMapChild+1,mo.maxMapChild));
			if(mo.maxMapChild === gamesystem.MaxMapChild)
			{
				mo.maxMapLevel = Math.min(gamesystem.MaxMapLevel, Math.max(currentUserInfo.curMapLevel+1,mo.maxMapLevel));
			}
		}
		else if(status === gamesystem.MapStatus_Guaji)
		{
			currentUserInfo.curMapGuajiTime = gameutils.getTimer();
		}
		eventDispatch.dispatchEventWith(Event_MapStatusChange);
	}

	export function nextMapChild():void{
		if(currentUserInfo.curMapChild<gamesystem.MaxMapChild-1)
		{
			changeMapChild(currentUserInfo.curMapChild+1);
		}
		else{
			changeMap(currentUserInfo.curMap+1);
		}
	}

	export function levelHero(mo:HeroMO){
		var needExp:number = calculHeroLevelUseExp(mo);
		if(currentUserInfo.exp>=needExp){
			mo.roleLevel+=1;
			mo.zdlChange();
			currentUserInfo.exp -=needExp;
			currentUserInfo.zdlChange();
		}
	}

	export function randGetHero():void{
		var i:number = Math.floor(Math.random()*gameMngers.roleInfoMnger.all.length);
		var roleVo:gamevo.RoleBaseVO = gameMngers.roleInfoMnger.all[i];
		var heroMo:HeroMO = new HeroMO();
		var i:number =1;
		while(true){
			if(!currentUserInfo.playerBagMnger.heroBag.hasItemById(i+'')){
				break;
			}
			i++;
		}
		heroMo.id = i+'';
		heroMo.initHero(roleVo.id);
		currentUserInfo.addHero(heroMo);
		eventDispatch.dispatchEventWith(Event_GetHero,false,heroMo);
	}

	export function randGetGold():void{
		var mapVo:gamevo.MapVO =gameMngers.mapInfoMnger.getVO(currentUserInfo.currentMO.id);
		var addGold:number = Math.floor(mapVo.goldSpeed*3600*(1+Math.random()));
		currentUserInfo.gold+=addGold;
		gameviews.goodsMessage.showGoodsMes(gamesystem.Icon_Gold,addGold);
	}

	export function useGoodsItem(go:GoodsItemMO):void{
		var gvo:gamevo.GoodsItemVO = gameMngers.goodsInfoMnger.getVO(go.goodsId);
		gvo.useEffects.forEach(item=>{
			switch(item.type){
				case 'randHero':
				randGetHero();
				break;
				case 'randGold':
				randGetGold();
				break;
			}
		});
		currentUserInfo.playerBagMnger.removeGoods(go);
		eventDispatch.dispatchEventWith(Event_BagChange);
	}


}