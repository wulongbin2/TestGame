module gameutils {
	export class XMLUtil {
		/**
		 * 将xml指定属性转化成字符串数组
		 */
		public static toStringArray(xml:egret.XML,attributeName:string):string[]
		{
			 return (<string>xml.attributes[attributeName]).split(',');
		}

			/**
		 * 将xml指定属性转化成数字数组
		 */
		public static toNumberArray(xml:egret.XML,attributeName:string):number[]
		{
			 var strs:string[]= (<string>xml.attributes[attributeName]).split(',');
			 var results:number [] = [];
			 strs.forEach(str=>{
				 results.push(parseFloat(str));
			 })
			 return results;
		}

		/**
		 * 将xml指定名称的字节点遍历一遍
		 */
		public static foreachChild(xml:egret.XML,childName:string,cb:(item:egret.XML)=>void):void
		{
				xml.children.forEach((item:egret.XML)=>{
					if(item.name ===childName)
					{
						item.children.forEach(cb);
					}
				});
		}

		/**
		 * 将xml指定名称的字节点遍历一遍
		 */
		public static childXML(xml:egret.XML,childName:string):egret.XML
		{
			var result:egret.XML;
			xml.children.forEach((item:egret.XML)=>{
				if(item.name ===childName)
				{
					result = item;
				}
			});
			return result;
		}
	}
}