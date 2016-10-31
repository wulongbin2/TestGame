module gamesystem {
	export class System {

		public constructor() {
		}
	}

	export var version:string = '0.1';

	export const Url_AnimaHero:string = 'resource/gameres/role/';
	export const Url_WeaponIcon:string = 'resource/gameres/artifact/';

	export const AnimaLeftWalk:string ='leftWalk';
	export const AnimaRightWalk:string ='rightWalk';
	export const AnimaUpWalk:string ='upWalk';
	export const AnimaDownWalk:string ='downWalk';

	export const AnimaLeftStand:string ='leftStand';
	export const AnimaRightStand:string ='rightStand';
	export const AnimaUpStand:string ='upStand';
	export const AnimaDownStand:string ='downStand';

	export const RoleQuality2Number:{[anme:string]:number} = {'white':1,'green':2,'blue':3,'zi':4,'yellow':5,'light':6};
}