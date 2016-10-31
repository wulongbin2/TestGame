
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/game/game.js",
	"libs/modules/game/game.native.js",
	"libs/modules/res/res.js",
	"libs/modules/eui/eui.js",
	"libs/modules/tween/tween.js",
	"bin-debug/AssetAdapter.js",
	"bin-debug/game/animas/Anima.js",
	"bin-debug/game/baseMngers/BaseMnger.js",
	"bin-debug/game/core/BagMO.js",
	"bin-debug/game/vo/gameVO.js",
	"bin-debug/game/core/PlayerMO.js",
	"bin-debug/game/system/System.js",
	"bin-debug/game/utils/AsynMnger.js",
	"bin-debug/game/utils/FilterUtls.js",
	"bin-debug/game/utils/GameLog.js",
	"bin-debug/game/utils/VersionCtrl.js",
	"bin-debug/game/utils/XMLAnalyszer.js",
	"bin-debug/game/utils/XMLUtil.js",
	"bin-debug/game/views/BagBtn.js",
	"bin-debug/game/views/BagItemRenderer.js",
	"bin-debug/game/views/BagPanel.js",
	"bin-debug/game/views/BaseBtn.js",
	"bin-debug/game/views/FightBtn.js",
	"bin-debug/game/views/FightPanel.js",
	"bin-debug/game/views/FightWaitBar.js",
	"bin-debug/game/views/GreenBtn.js",
	"bin-debug/game/views/HeroPanel.js",
	"bin-debug/game/views/HeroSlot.js",
	"bin-debug/game/views/IconLabel.js",
	"bin-debug/game/views/MainMenuBtn.js",
	"bin-debug/game/views/MainPanel.js",
	"bin-debug/game/views/MapChooseItem.js",
	"bin-debug/game/views/MapChoosePanel.js",
	"bin-debug/game/views/MapIndexBtn.js",
	"bin-debug/game/views/MapItem.js",
	"bin-debug/game/views/MapLevelBtn.js",
	"bin-debug/game/views/MapLevelItem.js",
	"bin-debug/game/views/QianghuaListItem.js",
	"bin-debug/game/views/QianghuaPanel.js",
	"bin-debug/game/views/SkillISlottem.js",
	"bin-debug/game/views/StartGame.js",
	"bin-debug/game/views/StartGameBtn.js",
	"bin-debug/game/views/TabBtn.js",
	"bin-debug/game/views/TabBtn2.js",
	"bin-debug/game/views/TeamBtn.js",
	"bin-debug/game/views/TeamListItem.js",
	"bin-debug/game/views/TeamMemberPanel.js",
	"bin-debug/game/views/TeamPanel.js",
	"bin-debug/game/views/TujianListItem.js",
	"bin-debug/game/views/TujianPanel.js",
	"bin-debug/game/views/ViewManager.js",
	"bin-debug/game/views/YellowLeftBtn.js",
	"bin-debug/game/views/YongbinMenuItem.js",
	"bin-debug/game/views/YongbinPanel.js",
	"bin-debug/game/vo/HeroAnimaVO.js",
	"bin-debug/LoadingUI.js",
	"bin-debug/Main.js",
	"bin-debug/ThemeAdapter.js",
	//----auto game_file_list end----
];

var window = this;

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    egret_native.requireFiles();
    egret.TextField.default_fontFamily = "/system/fonts/DroidSansFallback.ttf";
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 60,
		scaleMode: "exactFit",
		contentWidth: 640,
		contentHeight: 1136,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel(egret.TextField.default_fontFamily, 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};