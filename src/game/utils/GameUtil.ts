module gameutils {
	var zdlLevel:string[]=['','K','M','G','T'];
	var zdlNumLevel:number[]=[1,1000,1000000,1000000000,1000000000000];
	export function zdlToString(zdl:number):string{
		var zdlStr:string = zdl.toString();
		var level:number = Math.floor((zdlStr.length-1)/3);
		zdl = zdl/zdlNumLevel[level];
		zdlStr = zdl.toFixed(1);
		if(zdlStr.charAt(zdlStr.length-1) ==='0')
		{
			zdlStr =  zdlStr.substr(0,zdlStr.length-2);
		}
		return zdlStr+ zdlLevel[level];
	}

	export function getTimer():number{
		return (new Date()).getTime();
	}

	/**时间格式化 */
	export function formatTime(time:number,format:string='hh:mm:ss'):string{
		var  s:number = Math.floor(time/1000);
		var m:number = Math.floor(s/60);
		var h:number = Math.floor(m/60);

		var ss:string = timeToString(s%60);
		var mm:string = timeToString(m%60);
		var hh:string = timeToString(h);
		format = format.replace('ss',ss);
		format = format.replace('mm',mm);
		format = format.replace('hh',hh);
		return format
	}

	export function timeToString(s:number):string{
		if(s<10)
		{
			return '0'+s;
		}
		else{
			return s+'';
		}
	}
}