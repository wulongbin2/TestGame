module gameviews {
	export class DragTeam extends egret.Sprite{
		private itemBgsGroup:eui.Group;
		private itemBgs:TeamListItem[] = [];
		private items:DragRoleSlot[] = [];
		public totalItem:number  = 20;
		public columnNum:number =5;
		public itemWidth:number = 122;
		public itemHeight:number = 122;
		public maxDragX:number;
		public maxDragY:number;
		private _selectedItem:DragRoleSlot;
		public constructor() {
			super();

			this.itemBgsGroup = new eui.Group();
			this.addChild(this.itemBgsGroup);
			for(var i:number=0;i <this.totalItem;i++){
				var itembg:TeamListItem = new TeamListItem;
				itembg.anchorOffsetX = 50;
				itembg.anchorOffsetY = 50;
				itembg.touchChildren = false;
				itembg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectedByBg, this)
				this.itemBgs.push(itembg);
				var item:DragRoleSlot = new DragRoleSlot();
				item.anchorOffsetX = 50;
				item.anchorOffsetY = 50;
				item.touchChildren = false;
				var c:number = i%this.columnNum;
				var r:number = Math.floor(i/this.columnNum);
				itembg.x = item.x = c*this.itemWidth;
				itembg.y = item.y = r*this.itemHeight;
				item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelected, this)
				this.items.push(item);
				this.addChild(item);
				this.itemBgsGroup.addChild(itembg);
			}
			this.maxDragX = (this.columnNum -1)*this.itemWidth;
			this.maxDragY = Math.ceil(this.totalItem/this.columnNum )*this.itemHeight;

			this.addEventListener(egret.Event.ADDED_TO_STAGE,		this.onAddtoStage,this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE,	this.onRemoveStage,this);

		}

		private onAddtoStage():void{
			this.isUpdatePos = true;
		}

		private onRemoveStage():void{
			this.isUpdatePos = false;
		}

		private onSelectedByBg(e:egret.TouchEvent):void{
			this.selectedItem = this.items[this.itemBgs.indexOf(e.currentTarget)]
		}

		private onSelected(e:egret.TouchEvent):void{
			this.selectedItem = e.currentTarget;
		}

		public set selectedItem(value:DragRoleSlot){
			if(this._selectedItem){
				this._selectedItem.selected = false;
			}
			this._selectedItem = value;
			if(this._selectedItem){
				this._selectedItem.selected = true;
				this.addChild(this._selectedItem);
			}
			this.dispatchEventWith(egret.Event.CHANGE)
		}

		public replaceSelectedItem(data:gameCore.HeroMO):void{
			this.selectedItem.data = data;
			this.dispatchEventWith(egret.Event.CHANGE)
		}

		private _isDraing:boolean = false;
		private onDragStart(e:egret.TouchEvent):void{
			if(! e.currentTarget.data) return;
			this.selectedItem = e.currentTarget;
			this._isDraing = true;
			this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onDragMove,this)
		}

		private onDragEnd(e:egret.TouchEvent):void{
			if(! e.currentTarget.data) return;
			this._isDraing = false;
			this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onDragMove,this);
			this.sort();
		}

		private tempP:egret.Point = new egret.Point();
		private onDragMove(e:egret.TouchEvent):void{
			this.globalToLocal(e.stageX , e.stageY,this.tempP);
			var tempX:number =Math.min(this.maxDragX, Math.max(0,this.tempP.x)) ;
			var tempY:number =Math.min(this.maxDragY, Math.max(0, this.tempP.y ));
			this._selectedItem.x =tempX;
			this._selectedItem.y = tempY;
			tempX+=50;
			tempY+=50;
			var oldIndex:number = this.items.indexOf(this._selectedItem);
			var newindex:number = Math.floor(tempX/this.itemWidth)+Math.floor(tempY/this.itemHeight)*this.columnNum;
			newindex = Math.min(this.totalItem -1,newindex);
			if(oldIndex <newindex){
				for(var i:number = oldIndex;i < newindex;i++)
				{
					this.items[i] = this.items[i+1];
				}
			}
			else{
				for(var i:number = oldIndex;i >newindex;i--)
				{
					this.items[i] = this.items[i-1];
				}
			}
			this.items[newindex] = this._selectedItem;
		}

		public get selectedItem():DragRoleSlot{
			return this._selectedItem;
		}

		private set isUpdatePos(value:boolean){
			if(value){
				this.time = 0;
				gameutils.asynMnger.addCB(33,this.updatePos,this);
			}
			else{
				gameutils.asynMnger.removeCB(this.updatePos,this);
			}
		}

		private time:number = 0;
		private r:number = 0;
		private ro:number = 1;
		private updatePos():void{
			this.time++;
			if(this.ro >0&&this.r >=4)
			{
				this.ro = -2;
			}
			else if(this.ro <0&&this.r <=-4)
			{
				this.ro = 2;
			}
			this.r +=this.ro;
			for(var i:number=0;i <this.totalItem;i++){
				var item:DragRoleSlot = this.items[i];
				if(this._isDraing && item.selected) continue;
				if(this._dragEnabled && item.data){
					item.rotation = this.r;
				}
				else{
					item.rotation = 0;
				}
				var c:number = i%this.columnNum;
				var r:number = Math.floor(i/this.columnNum);
				item.x = (c*this.itemWidth - item.x)*0.2+item.x;
				item.y = (r*this.itemHeight - item.y)*0.2 + item.y;
			}
		}

		public sort():void{
			var newItems:DragRoleSlot[] = [];
			for(var i:number=0;i <this.totalItem;i++){
				if(this.items[i].data){
					newItems.push(this.items[i])
				}
			}
			for(i=0; i <this.totalItem;i++){
				if(!this.items[i].data){
					newItems.push(this.items[i])
				}
			}
			this.items = newItems;
		}


		public set data(value:gameCore.HeroMO[]){
			var len:number = value.length;
			for(var i:number = 0;i < this.totalItem; i++){
				if(i <len){
					this.items[i].data = value[i];
				}
				else{
					this.items[i].data = null;
				}
			}
			this.selectedItem = this.items[0];
		}

		public get dataLength():number{
			var num:number = 0;
			for(var i:number = 0;i < this.totalItem; i++){
				if(this.items[i].data)
				{
					num++;
				}
			}
			return num;
		}

		public getDataAfterSort():gameCore.HeroMO[]{
			var arr:gameCore.HeroMO[] = [];
			for(var i:number = 0;i < this.totalItem; i++){
				if(this.items[i].data)
				{
					arr.push(this.items[i].data);
				}
			}
			return arr;
		}

		private _dragEnabled:boolean = false;
		public set dragEnabled(value:boolean){
			if(this._dragEnabled == value) return;
			this._dragEnabled = value;
			for(var i:number = 0;i < this.totalItem; i++){
				if(this._dragEnabled)
				{
					this.items[i].addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onDragStart,this)
					this.items[i].addEventListener(egret.TouchEvent.TOUCH_END, this.onDragEnd,this)
				}
				else{
					this.items[i].removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onDragStart,this)
					this.items[i].removeEventListener(egret.TouchEvent.TOUCH_END, this.onDragEnd,this)
				}
			}
		}

		public get dragEnabled():boolean{
			return this._dragEnabled;
		}

		public removeCurrent():void{
			if(this.selectedItem){
				var num:number = this.dataLength;
				if(num===1){
					gameviews.viewManager.showAlertMes('队伍至少需要一人！');
					return;
				}
				var oldIndex:number = this.items.indexOf(this.selectedItem);
				this.selectedItem.data = null;
				this.sort();
				num--;
				this.selectedItem = this.items[Math.min(num-1,oldIndex)];
			}
		}
	}
}