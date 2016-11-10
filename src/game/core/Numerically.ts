module gameCore {
	/**计算角色战力公式 */
	export function calculHeroZDL(vo:HeroMO):number{
		return _calculHeroZDL(vo, vo.roleLevel);
	}
	/**计算角色下一级战力 */
	export function calculHeroNextLevelZDL(vo:HeroMO):number{
		var roleLevel:number = vo.roleLevel+1;
		return _calculHeroZDL(vo,roleLevel);
	}

	function _calculHeroZDL(vo:HeroMO, roleLevel:number):number{
		return Math.round((roleLevel*(vo.awakenLevel+1)+vo.awakenLevel*gamesystem.AwakenLevel)*100*vo.roleVo.potential*(1+0.01*roleLevel));
	}
	/**计算角色下一集战力增加 */
	export function calculHeroNextLevelOffZDL(vo:HeroMO):number{
		return calculHeroNextLevelZDL(vo) - calculHeroZDL(vo);
	}

	/**计算角色升级消耗经验 */
	export function calculHeroLevelUseExp(vo:HeroMO):number{
		return (vo.roleLevel*(vo.awakenLevel*vo.awakenLevel*10+1)+vo.awakenLevel*gamesystem.AwakenLevel)*10;
	}

	/**计算角色离线增加经验 */
	export function offlineAddExpAndGold():void{
		var time:number = gameutils.getTimer();
		var mo:gamevo.MapVO = gameMngers.mapInfoMnger.getVO(currentUserInfo.curMap+'');
		var offTime:number = time - currentUserInfo.offlineTime;
		currentUserInfo.offlineTime = time;
		offTime*=0.001;
		currentUserInfo.exp+=Math.round(mo.expSpeed * offTime*0.5);
		currentUserInfo.gold+=Math.round(mo.goldSpeed * offTime*0.5);
	}

	/**计算角色在线增加经验 */
	export function onlineAddExpAndGold():void{
		var time:number = gameutils.getTimer();
		var mo:gamevo.MapVO = gameMngers.mapInfoMnger.getVO(currentUserInfo.curMap+'');
		var offTime:number = time - currentUserInfo.offlineTime;
		currentUserInfo.offlineTime = time;
		offTime*=0.001;
		currentUserInfo.exp+=Math.round(mo.expSpeed * offTime);
		currentUserInfo.gold+=Math.round(mo.goldSpeed * offTime);

	}

	/**计算所有角色总战力*/
	export function calculAllHeroZDL(heros:HeroMO[]):number{
		var zdl:number =0 ;
		heros.forEach(item=>{
				zdl+=item.zdl;
		});
		return zdl;
	}

	/**计算所有角色Buff*/
	export function calculAllHeroBuff(heros:HeroMO[],buff:gamevo.BuffVO):void{
		buff.clear();
		heros.forEach(item=>{
				buff.addBuff(item.roleVo.buff);
		});
	}
}