/**开始冒险面板 */
class StartGame extends eui.Component implements  eui.UIComponent {
	public startgameBtn:eui.Button;
	public constructor() {
		super();
		this.addEventListener( eui.UIEvent.COMPLETE, this.oncomplate, this );
	}


	private oncomplate():void{
		this.startgameBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onStartGame,this);
		// var test:gameAnima.HeroAnimaPlayer = new gameAnima.HeroAnimaPlayer();
		// test.x = 100;
		// test.y = 400;
		// test.setHeroId('testHero');
		// test.playAnimaById(gamesystem.AnimaRightWalk);
		// this.addChild(test);
	}

	private onStartGame():void{
		this.dispatchEvent(new egret.Event('startGame'));
	}
}