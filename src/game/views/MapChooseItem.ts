/**关卡选择面板子项 */
class MapChooseItem extends eui.ItemRenderer implements  eui.UIComponent {
	private bg:eui.Image;
	private numTf:eui.Label;
	private nameTf:eui.Label;
	private zdlTf:eui.Label;
	private zdlContainer:eui.Group;
	private lock:eui.Image;
	public constructor() {
		super();
	}

	public invalidateState():void
	{
		super.invalidateState();
		this.updateFilter();
	}

	protected dataChanged():void{
		super.dataChanged();
		var mapVo:gamevo.MapVO = this.data;
		if(mapVo)
		{
			this.bg.source = mapVo.listBg;
			this.nameTf.text = mapVo.name;
			this.numTf.text = (mapVo.mapId+1)+'';
			this.zdlTf.text = gameutils.zdlToString(mapVo.kaiqiZdl);
			this.enabled = gameCore.currentUserInfo.totalZDL>=mapVo.kaiqiZdl && gameCore.currentUserInfo.maxMapId>= mapVo.mapId;
			this.lock.visible = !this.enabled;
			this.updateFilter();
		}
	}

	protected updateFilter():void{
		if(this.enabled)
		{
			if(this.selected){
				this.filters = null;
			}
			else{
				this.filters = gameutils.FilterUtls.Dark_Fiter;
			}
		}
		else{
			this.filters = gameutils.FilterUtls.BW_Fiter;
		}
	}
}