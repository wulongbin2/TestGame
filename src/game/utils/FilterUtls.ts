module gameutils {
	export class FilterUtls {
		public static  Black_Filter:any[]=[new egret.GlowFilter(0x111111,1,4,4,6)];
		public static  Red_Filter:any[]=[new egret.ColorMatrixFilter([1,0,0,0,0,   0,0.3,0,0,0,   0,0,0.3,0,0,  0,0,0,1,0])];
		public static  BW_Fiter:any[]=[new egret.ColorMatrixFilter([0.3086,0.6094,0.082,0,0,0.3086,0.6094,0.082,0,0,0.3086,0.6094,0.082,0,0,0,0,0,1,0])];
		public static  Yellow_Filter:any[]=[new egret.GlowFilter(0xffff00,1)];
		public static  Blue_Filter:any[]=[new egret.GlowFilter(0x0000ff,1)];
		public static  Light_filter:any[]=[new egret.GlowFilter(0xffff00,1,10,10,2,1,true)];
	}
}