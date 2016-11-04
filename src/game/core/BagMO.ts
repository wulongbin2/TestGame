module gameCore {


	/**背包槽位数据对象 */
	export class BagItemMO{
		public bagName:string='';
		public pos:number= -1;
	}
	/**背包槽位数据代理对象 */
	export class BagItemProxy<T> extends BagItemMO{
		public data:T;
	}
	/**背包槽位对象 */
	export class BagGridMO<T extends BagItemMO>{
		public item:T;
		public bag:BagMO<T>;
		public pos:number;
		public init(bag:BagMO<T>,pos:number){
			this.bag = bag;
			this.pos = pos;
		}
		public get isUsed():boolean
		{
			return this.item?true:false;
		} 
	}

	/**背包数据模型 */
	export class BagMO<T extends BagItemMO>{
		public grids:BagGridMO<T>[] = [];
		protected _availgridsNum:number = 0;
		protected _usedgridNum:number = 0;
		public name:string;
		public initBag(name:string,availgridsNum:number,totalgridsNum:number,mnger:BagManager)
		{
			this.availgridsNum = availgridsNum;
			this.totalgridsNum = totalgridsNum;
			this.name = name;
			mnger.registerBag(this);
		}

		/**创建槽位 */
		protected createBagGrid():BagGridMO<T>{
			return new BagGridMO<T>();
		}

		public set availgridsNum(value:number)
		{
			 this._availgridsNum = value;
		}
		/**可用的槽位 */
		public get availgridsNum():number
		{
			return this._availgridsNum;
		}

		public set totalgridsNum(value:number)
		{
			var oldlenth:number = this.totalgridsNum;
			if(value <oldlenth)
			{
				this.grids.length = value;
			}
			else
			{
				for(var i:number = oldlenth ; i < value ; i++){
					var grid:BagGridMO<T> = this.createBagGrid();
					grid.init(this,i);
					this.grids.push(grid);
				}
			}
		}

		/**所有的槽位数量 */
		public get totalgridsNum():number{
			return this.grids.length;
		}

		/**已经使用的槽位数量 */
		public get usedgridNum():number{
			return this._usedgridNum;
		}

		/**未使用的槽位数量 */
		public get notusedGridNum():number{
			return this.availgridsNum - this.usedgridNum;
		}

		/**是否还有可以使用的槽位 */
		public get hasUsedGrid():boolean
		{
			return this.notusedGridNum>0;
		}



		/**添加新物品至空位 */
		public pushItem(item:T){
			if(this.hasUsedGrid)
			{
				var len:number = this.availgridsNum;
				for(var i:number = 0;i < len;i++){
					if(!this.grids[i].isUsed)
					{
						this.addItemAt(item,i);
						break;
					}
				}
			}
		}
		/**添加物品至指定位置 */
		public addItemAt(item:T, pos:number){
			if(pos <this.availgridsNum && !this.grids[pos].isUsed)
			{
				this._addItemAt(item, pos);
			}
		}


		protected _addItemAt(item:T, pos:number){
			this.grids[pos].item = item;
				item.pos = pos;
				item.bagName = this.name;
				this._usedgridNum++;
		}
		/**移除物品*/
		public removeItem(item:T){
			if(item.bagName === this.name)
			{
				this._removeItem(item);
			}
		}

		public autoSort():void{
			var i:number = 0;
			this.grids.forEach(grid=>{
				if(grid.isUsed)
				{
					this.grids[i].item = grid.item;
					grid.item.pos = i;
					i++;
				}
			});
			for(;i < this.grids.length; i ++){
				this.grids[i].item = null;
			}
		}


		protected _removeItem(item:T){
			this.grids[item.pos].item = null;
			item.pos = -1;
			item.bagName = '';
			this._usedgridNum--;
		}

		public clearItem():void{
			this.grids.forEach(grid=>{
				if(grid.item)
				{
					grid.item.pos = -1;
					grid.item.bagName ='';
					grid.item = null;
				}
			})
			this._usedgridNum =0;
		}


		/**获取槽位 */
		public getGrid(pos:number):BagGridMO<T>
		{
			return this.grids[pos];
		}
	}


	/**背包 子项数据为代理对象BagItemProxy */
	export class BagProxyMO<G extends gamevo.WithConfigVO> extends BagMO<BagItemProxy<G>>{
		/**根据对象唯一id存放 */
		protected _lib:{[id:string]:BagItemProxy<G>}={};
		/**根据对象引用的配置id存放*/
		protected _libByConfigId:{[configId:string]:G[]}={};
		/**存放所有的对象 */
		protected _allItems:G[] = [];
		public pushItemByData(data:G):void{
			this.pushItem(this.createProxy(data));
		}

		/**移除对象 */
		public removeItemByData(data:G):void{
			if(this._lib[data.id])
			{
				this.removeItem(this._lib[data.id]);
			}
		}

		/**根据唯一id判定是否存在对象 */
		public hasItemById(id:string):boolean
		{
			return this._lib[id]?true:false;
		}

		/**根据唯一id判定获取对象 */
		public getItemById(id:string):G{
			return this._lib[id]?this._lib[id].data:null;
		}
		/**根据配置id判定获取对象组 */
		public getItemByConfigId(configId:string):G[]
		{
			if(this._libByConfigId[configId])
			{
				return this._libByConfigId[configId];
			}
			else{
				return [];
			}
		}
		/**根据配置id判定对象是否存在 */
		public hasItemByConfigId(configId:string):boolean
		{
			if(this._libByConfigId[configId])
			{
				return this._libByConfigId[configId].length>0;
			}
			else
			{
				return false;
			}
		}

		public createProxy(data:G):BagItemProxy<G>
		{
			var proxy:BagItemProxy<G> = new BagItemProxy<G>();
			proxy.data = data;
			return proxy;
		}

		protected _addItemAt(item:BagItemProxy<G>, pos:number){
			super._addItemAt(item,pos);
			this._lib[item.data.id] = item;

			if(this._libByConfigId[item.data.getConfigId()])
			{
				var arr:G[] = this._libByConfigId[item.data.getConfigId()];
				arr.push(item.data);
			}
			else
			{
				 this._libByConfigId[item.data.getConfigId()]= [item.data];
			}
			this._allItems.push(item.data);
		}

		public get allItems():G[]
		{
			return this._allItems;
		}

		protected _removeItem(item:BagItemProxy<G>){
			super._removeItem(item);
			this._lib[item.data.id] = null;
			var arr:any[] = this._libByConfigId[item.data.getConfigId()];
			arr.splice(arr.indexOf(item),1);
			this._allItems.splice(this._allItems.indexOf(item.data),1);
		}


		public clearItem():void{
			super.clearItem();
			this._lib = {};
			this._libByConfigId={};
			this._allItems = [];
		}
	}

	/**交换背包中的物品 */
	export function switchItemInGrid(grid1:BagGridMO<BagItemMO>,grid2:BagGridMO<BagItemMO>):void{
		var item1:BagItemMO = grid1.item;
		var item2:BagItemMO = grid2.item;
		if(item1)
		{
			grid1.bag.removeItem(item1);
		}

		if(item2)
		{
			grid2.bag.removeItem(item2);
		}

		if(item1)
		{
			grid2.bag.addItemAt(item1,grid2.pos);
		}

		if(item2)
		{
			grid1.bag.addItemAt(item2,grid1.pos);
		}
	}

	export class BagManager{
		public bagLib:{[name:string]:BagMO<BagItemMO>} = {};
		public registerBag(bag:BagMO<BagItemMO>):void{
			if(this.bagLib[bag.name])
			{
				throw `BagLib has name=[${bag.name}] bag!`;
			}
			this.bagLib[bag.name] = bag;
		}
		public getBag(name:string):BagMO<BagItemMO>
		{
			return this.bagLib[name];
		}
	}
}