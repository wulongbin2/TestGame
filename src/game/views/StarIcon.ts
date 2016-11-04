module gameviews {
	export class StarIcon extends eui.Image{

		public set isLight(value:boolean){
			if(value){
				this.source = gamesystem.Icon_Star_Light;
			}
			else{
				this.source = gamesystem.Icon_Star_UnLight;
			}
		}
	}
}