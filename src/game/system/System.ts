module gamesystem {

	export var version:string = '0.1';

	export const Auto_EffectFrameRate:number = 12;
	export const Auto_FrameWidth:number = 96;
	export const Auto_FrameHeight:number = 96;
	export const Auto_IsLoop:boolean = false;

	export const Url_AnimaHero:string = 'resource/gameres/role/';
	export const Url_AnimaEffect:string = 'resource/gameres/effect/';
	export const Url_WeaponIcon:string = 'resource/gameres/artifact/';

	export const AnimaLeftWalk:string ='leftWalk';
	export const AnimaRightWalk:string ='rightWalk';
	export const AnimaUpWalk:string ='upWalk';
	export const AnimaDownWalk:string ='downWalk';

	export const AnimaLeftStand:string ='leftStand';
	export const AnimaRightStand:string ='rightStand';
	export const AnimaUpStand:string ='upStand';
	export const AnimaDownStand:string ='downStand';

	export const AnimaLeftTurn:string ='leftTurn';
	export const AnimaRightTurn:string ='leftTurn';

	export const RoleQuality2Number:{[anme:string]:number} = {'white':1,'green':2,'blue':3,'zi':4,'yellow':5,'light':6};

	export const MaxMapLevel:number = 3;
	export const MaxMapChild:number = 5;

	export const MapStatus_Guaji:number = 0;
	export const MapStatus_ReadyFight:number = 1;
	export const MapStatus_FightEnd:number = 2;

	export const Icon_Gold:string ='mission_icon_gold_png';
	export const Icon_Exp:string ='mission_icon_exp_png';
	export const Icon_Money:string ='blood_diamond_header_png';
	export const Icon_Drop:string ='mission_icon_role_png';
	export const Icon_Other:string ='breaklimit_png';
	export const Icon_Star_Light:string ='breaklimit_png';
	export const Icon_Star_UnLight:string ='breaklimit_dark_png';

	export const MapLevelLabel:string[] =  ['简单','适中','困难'];

	export const AwakenLevel:number = 30;

}