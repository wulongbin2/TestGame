module gamesystem {

	export var version:string = '0.1';
	/**资源 */
	export const GoodsTag_ZIYUAN:string = 'ziyuan';
	/**道具 */
	export const GoodsTag_DAOJU:string = 'daoju';

	export var stageWidth:number;
	export var stageHeight:number;
	export var stage:egret.Stage;

	export const Auto_EffectFrameRate:number = 24;
	export const Auto_FrameWidth:number = 96;
	export const Auto_FrameHeight:number = 96;
	export const Auto_IsLoop:boolean = false;

	export const Url_AnimaHero:string = 'resource/gameres/role/';
	export const Url_AnimaEffect:string = 'resource/gameres/effect/';
	export const Url_WeaponIcon:string = 'resource/gameres/artifact/';
	export const Url_BattleBg:string = 'resource/gameres/battleBG/';
	export const Url_Font:string = 'resource/gameres/font/';

	export var Font_Red:egret.BitmapFont;
	export var Font_Green:egret.BitmapFont ;
	export var Font_Yellow:egret.BitmapFont;

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

	/**攻击性技能：伤害敌方的节能类型*/
	export const SkillEffectType_Attack:string = 'attack';
	export const SkillEffectType_Baoji:string = 'baoji';
	export const SkillEffectType_Recovery:string = 'recovery';
	export const SkillEffectType_Buff:string = 'buff';

	export const Skill_Self:string = 'self';
	export const Skill_Enemy:string = 'enemy';

	export const SkillRecovery_Self_TotalZDL:string = 'self.totalZDL';
	export const SkillRecovery_Self_CurZDL:string = 'self.curZDL';
	export const SkillRecovery_Self_LoseZDL:string = 'self.loseZDL';
	export const SkillRecovery_Self_LoseZDLPer:string = 'self.loseZDLPer';
	export const SkillRecovery_Self_CurZDLPer:string = 'self.curZDLPer';

	export const SkillRecovery_Enemy_TotalZDL:string = 'enemy.totalZDL';
	export const SkillRecovery_Enemy_CurZDL:string = 'enemy.curZDL';
	export const SkillRecovery_Enemy_LoseZDL:string = 'enemy.loseZDL';
	export const SkillRecovery_Enemy_LoseZDLPer:string = 'Enemy.loseZDLPer';
	export const SkillRecovery_Enemy_CurZDLPer:string = 'Enemy.curZDLPer'
	export const SkillRecovery_HurtZDL:string = 'hurtZDL';


	export const OPType_InitRound:string = 'initRound';
	export const OPType_MaskHide:string = 'maskHide';
	export const OPType_Dialog:string = 'dialog';
	export const OPType_PlayEffect:string = 'playEffect';
	export const OPType_PlaySkillName:string = 'playSkillName';
	export const OPType_Forward:string = 'forward';
	export const OPType_BackOut:string = 'backOut';
	export const OPType_BackIn:string = 'backIn';
	export const OPType_ShowHurt:string = 'showHurt';
	export const OPType_End:string = 'end';

	const zhens:number[][] = [
		[0,0,0,1,0,0,0],
		[0,5,3,2,4,6,0],
		[12,10,8,7,9,11,13],
		[19,17,15,14,16,18,20]
	]

	export var indexToZhen:{[id:number]:{mapX:number,mapY:number}} = {};
	export function initSystem(s:egret.Stage):void{
		stage = s;
		stageWidth =stage.stageWidth;
		stageHeight =stage.stageHeight;
		Font_Red = RES.getRes('number1_fnt');
		Font_Green = RES.getRes('number2_fnt');
		Font_Yellow = RES.getRes('number3_fnt');
		var i:number = 0;
		var len:number = zhens.length;
		for(;i <len;i++){
			var zhenArr:number[] = zhens[i];
			for(var j:number = 0; j <zhenArr.length; j++){
				var index:number = zhenArr[j];
				if(index>0)
				{
					indexToZhen[index-1] = {mapY:j-4,mapX:-i};
				}
			}
		}
		gameutils.asynMnger.running = true;
	}
}