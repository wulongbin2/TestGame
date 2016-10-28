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
	}
}