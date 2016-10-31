module gamevo {
	/**地图配置 */
	export class MapVO extends BaseVO {
		/**地图名称 */
		public name:string;
		/**地图列表缩略图 */
		public listBg:string;
		/**地图挂机动画 */
		public guajiAnima:string;
		/**地图开启关卡 */
		public kaiqiZdl:number;
	}
}