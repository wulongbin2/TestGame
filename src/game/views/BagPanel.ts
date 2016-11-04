/**背包面板 */
class BagPanel extends eui.Component implements  eui.UIComponent {

	public tab1:eui.RadioButton;
	public tab2:eui.RadioButton;
	public closeBtn:eui.Button;
	public nameTf:eui.Label;
	public desTf:eui.Label;
	public bagList:eui.List;
	public icon:eui.Image;
	public useBtn:eui.Button;
	private bagData:eui.ArrayCollection;
	public constructor() {
		super();
		this.addEventListener( eui.UIEvent.COMPLETE, this.onCompelate, this );
		this.addEventListener(eui.UIEvent.ADDED_TO_STAGE, this.addedToStage,this);
		this.addEventListener(eui.UIEvent.REMOVED_FROM_STAGE, this.removeFromStage,this);
	}

	protected addedToStage():void{
		gameCore.eventDispatch.addEventListener(gameCore.Event_BagChange,this.updateView,this);
	}

	protected removeFromStage():void{
		gameCore.eventDispatch.removeEventListener(gameCore.Event_BagChange,this.updateView,this);
	}

	private onCompelate():void{
		this.bagList.itemRenderer = BagItemRenderer;
		this.bagData = new eui.ArrayCollection();
		this.bagList.dataProvider = this.bagData;
		this.bagList.addEventListener(egret.Event.CHANGE,this.updateGoodsInfo,this);
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeHd,this)
		this.tab1.group.addEventListener( egret.Event.CHANGE,this.onTabChange,this);
		this.tab1.selected = true;
		this.useBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUseItem,this);
		this.onTabChange();
	}

	private onUseItem():void{
		var data:gameCore.BagGridMO<gameCore.BagItemProxy<gameCore.GoodsItemMO>> = this.bagList.selectedItem;
		if(data && data.isUsed){
			gameCore.useGoodsItem(data.item.data);
		}
	}

	private onTabChange():void{
		this.bagList.selectedIndex = 0;
		this.updateView();
	}

	private closeHd():void{
		gameviews.viewManager.hideBagPanel();
	}

	private updateView():void{
		var bag:gameCore.GoodsBag;
		if(this.tab1.selected)
		{
			this.addChildAt(this.tab1,3);
			bag = gameCore.currentUserInfo.playerBagMnger.getBagByTag(gamevo.GoodsItemVO.Tag_DAOJU);
		}
		else if(this.tab2.selected)
		{
			this.addChildAt(this.tab2,3);
			bag = gameCore.currentUserInfo.playerBagMnger.getBagByTag(gamevo.GoodsItemVO.Tag_ZIYUAN);
		}
		bag.autoSort();
		var oldSelected:number = this.bagList.selectedIndex;
		var datas:any[] = [];
		var len:number = bag.availgridsNum;
		for(var i:number = 0;i < len;i++)
		{
			datas.push(bag.grids[i]);
		}
		this.bagData.source = datas;
		this.bagList.dataProvider = this.bagData;
		this.bagList.selectedIndex = oldSelected;
		this.updateGoodsInfo();
	}

	private updateGoodsInfo():void{
		var data:gameCore.BagGridMO<gameCore.BagItemProxy<gameCore.GoodsItemMO>> = this.bagList.selectedItem;
		if(data && data.isUsed){
			var goodsItemVo:gamevo.GoodsItemVO = gameMngers.goodsInfoMnger.getVO(data.item.data.goodsId);
			this.icon.source =goodsItemVo.source;
			this.nameTf.text = goodsItemVo.name;
			this.desTf.text = goodsItemVo.des;
			this.useBtn.enabled = goodsItemVo.canUse;
		}
		else{
			this.icon.source = '';
			this.nameTf.text = '';
			this.desTf.text = '';
			this.useBtn.enabled = false;
		}

	}
	
}