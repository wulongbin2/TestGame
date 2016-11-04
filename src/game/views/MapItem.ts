/**小关卡显示对象 */
class MapItem extends eui.RadioButton implements  eui.UIComponent {
	public mapChildId:number;
	public cityIcon:eui.Image;
	public starIcon:gameviews.StarIcon;
	public canChoose:boolean;
	public constructor() {
		super();
		this.addEventListener( eui.UIEvent.COMPLETE, this.oncomplete, this );
	}

	protected oncomplete():void{
		this.starIcon = new gameviews.StarIcon();
		this.starIcon.verticalCenter = 0;
		this.starIcon.horizontalCenter = 0;
		this.addChild(this.starIcon);
	}

	public setMapChildVo(mapVo:gamevo.MapVO,mapChildVo:gamevo.MapChildVO){
		this.cityIcon.source = mapVo.cityIcon;
		this.label = (mapVo.mapId+1)+'-'+(mapChildVo.mapChildId+1);
		var mapMo:gameCore.MapMO = gameCore.currentUserInfo.getMapMO(mapVo.mapId);
		if(gameCore.currentUserInfo.curMapLevel<mapMo.maxMapLevel||mapChildVo.mapChildId<mapMo.maxMapChild)
		{
			this.starIcon.isLight = true;
			this.canChoose = true;
		}
		else if(mapChildVo.mapChildId==mapMo.maxMapChild){
			this.starIcon.isLight = false;
			this.canChoose = true;
		}
		else{
			this.starIcon.isLight = false;
			this.canChoose  = false;
		}
		if( mapChildVo.mapChildId === gameCore.currentUserInfo.curMapChild)
		{
			this.filters = null;
		}
		else{
			this.filters = gameutils.FilterUtls.Dark_Fiter;
		}
		if(mapChildVo.daojus.length>0)
		{
			this.icon = gamesystem.Icon_Drop;
		}
		else if(mapChildVo.money>0)
		{
			this.icon = gamesystem.Icon_Money;
		}
		else if(mapChildVo.exp>0){
			this.icon = gamesystem.Icon_Exp;
		}
		else if(mapChildVo.gold>0){
			this.icon = gamesystem.Icon_Gold;
		}
		else{
			this.icon = gamesystem.Icon_Other;
		}
	}
}