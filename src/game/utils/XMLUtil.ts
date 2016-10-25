module gameutils {
	export class XMLUtil {
		public static toStringArray(xml:egret.XML,attributeName:string):string[]
		{
			 return (<string>xml.attributes[attributeName]).split(',');
		}

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