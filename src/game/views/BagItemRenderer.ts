/**背包列表子项 */
class BagItemRenderer extends eui.ItemRenderer implements  eui.UIComponent {
	public iconDisplay:eui.Image;
	public selectedIcon:eui.Image;
	public numTf:eui.Label;
	public constructor() {
		super();
		this.addEventListener( eui.UIEvent.COMPLETE, this.onCompelate, this );
	}


	public invalidateState():void
	{
		super.invalidateState();
		this.selectedIcon.visible = this.selected;
	}

	private onCompelate():void{
		this.selectedIcon.visible = this.selected;
	}

	protected dataChanged():void{
		super.dataChanged();
		var data:gameCore.BagGridMO<gameCore.BagItemProxy<gameCore.GoodsItemMO>> = this.data;
		if(data.isUsed)
		{
			this.iconDisplay.visible = true;
			var goodsItemVo:gamevo.GoodsItemVO = gameMngers.goodsInfoMnger.getVO(data.item.data.goodsId);
			var num:number = data.item.data.goodsNum;
			this.numTf.text = num>1?'X'+num:'';
			this.iconDisplay.source =goodsItemVo.source;
		}
		else{
			this.numTf.text = '';
			this.iconDisplay.source = '';
			this.iconDisplay.visible = false;
		}
	}

	

	
}