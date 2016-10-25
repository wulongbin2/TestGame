module gameutils {
	/**xml解析器 */
	export class XMLAnalyzer extends RES.BinAnalyzer{
		public  constructor(){
			super();
			this._dataFormat = egret.HttpResponseType.TEXT;
		}

		public analyzeData(resItem:RES.ResourceItem,data)
		{
			super.analyzeData(resItem,egret.XML.parse(data))
		}
	}
}