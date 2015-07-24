var MENUITEM_PARENT_TAG = 0;
//var MENUITEM_NEXT_TAG = 1;
//var MENUITEM_STORE_TAG = 2;
//var MENUITEM_REPLAY_TAG = 3;
//var MENUITEM_MAP_TAG = 4;
//var MENUITEM_MAINMENU_TAG = 5;
//var MENUITEM_EXIT_TAG = 6;

var GameResultLayer = cc.Layer.extend({
  gameResult: null,
  gamePassed: false,  // default set gameover = true

  ctor:function (result, passed) {
    //sys.garbageCollect();
    this._super();

    this.setTouchEnabled(true);
    if ('mouse' in sys.capabilities && 'keyboard' in sys.capabilities) {
      this.setMouseEnabled(true);
      this.setKeyboardEnabled(true);
    }

    this.gameResult = result ;
    this.gamePassed = passed ;
    if(passed) {
      var saveData = GameSave.getInstance();
      saveData.obj.lockLevel++;
      saveData.doSave();
    }
      
  },

  onEnter:function () {
    this._super();

    this.gameConfig  = new GameConfig();
    this.audioEngine = cc.AudioEngine.getInstance();

    this.size = cc.Director.getInstance().getWinSize();

    var background = (this.gamePassed)? new cc.Sprite(this.gameConfig.gameResultScene.passededBackground):
      new cc.Sprite(this.gameConfig.gameResultScene.failedBackground);
    var scale = this.size.height / background.getContentSize().height;
    background.setScale(scale);

    background.setPosition(this.gameConfig.gameResultScene.backgroundPosition);
    this.addChild(background, -999, this.gameConfig.globals.TAG_MENU_BACKGROUND);

    // Add menu
    this.initMenu() ;
    // show result
    this.showResult() ;

    return true;
  },
  onEnterTransitionDidFinish: function() {
    this.playBackgroundMusic();
  },
  
  playBackgroundMusic: function() {
    if (!GameConfig.isMute()) {   
      //console.log("!!!!!!!!!!!!");
      if(!this.gamePassed)
        GameConfig.playMusic(s_musicFailed);
      else
        GameConfig.playMusic(s_musicPassed) ;
    }
  },

  showResult: function() {
    var resultConfig = this.gameConfig.gameResultScene.result;

    var resultFont = resultConfig.resultFont;
    var resultFontSize = resultConfig.resultFontSize;

    var resultLayer = cc.Layer.create();

    //console.log(this.gameResult) ;
    var level = cc.LabelTTF.create(this.gameResult.level, resultFont, resultFontSize+20);
    var moneyScore = cc.LabelTTF.create("$"+this.gameResult.money, resultFont, resultFontSize);
    moneyScore.setScale(0.5);

    var elapsedStr = this.gameResult.elapsed + ' seconds' ;
    var timeScore = cc.LabelTTF.create(elapsedStr, resultFont, resultFontSize);
    timeScore.setScale(0.5);

    level.setColor(resultConfig.resultTitleColor);
    level.setScale(0.5);
    moneyScore.setColor(resultConfig.resultTextColor);
    timeScore.setColor(resultConfig.resultTextColor);

    level.setPosition(cc.p(this.size.width/2 -40,  this.size.height -165)) ;
    moneyScore.setPosition(cc.p(this.size.width/2,  this.size.height -240));
    timeScore.setPosition(cc.p(this.size.width/2 - 60,  this.size.height - 204)) ;

    resultLayer.addChild(level) ;
    resultLayer.addChild(moneyScore) ;
    resultLayer.addChild(timeScore) ;

    this.addChild(resultLayer, 20) ;
  },

  initMenu: function() {
    //var menuConfig = this.gameConfig.gameResultScene.menuConfig ;
    //cc.MenuItemFont.setFontName(menuConfig.menuFont);
    //cc.MenuItemFont.setFontSize(menuConfig.menuFontSize);

    var menuItemReplay = cc.MenuItemSprite.create(cc.Sprite.create(s_replayBtn),
      cc.Sprite.create(s_replayBtn), this.onReplay, this);
    menuItemReplay.setScale(0.5);
    var menuItemNext = cc.MenuItemSprite.create(cc.Sprite.create(s_nextBtn), 
      cc.Sprite.create(s_nextBtn), this.onNext, this);
    menuItemNext.setScale(0.5);
    var menuItemMainMenu = cc.MenuItemSprite.create(cc.Sprite.create(s_mainmenuBtn),
      cc.Sprite.create(s_mainmenuBtn), this.onBack, this);
    menuItemMainMenu.setScale(0.5);
    var menuItemMap = cc.MenuItemSprite.create(cc.Sprite.create(s_levelmapBtn), 
      cc.Sprite.create(s_levelmapBtn), this.onMap, this);
    menuItemMap.setScale(0.5);
    var menuItemStore = cc.MenuItemSprite.create(cc.Sprite.create(s_storeBtn),
      cc.Sprite.create(s_storeBtn), this.onStore, this);
    menuItemStore.setScale(0.5);

 

    //var itemReplay = cc.MenuItemFont.create("Replay", this.onReplay, this);
    //var itemMap = cc.MenuItemFont.create("Level Map", null, this);
    //var itemStore = cc.MenuItemFont.create("Store", null, this);
    //var itemExit = cc.MenuItemFont.create("Main Menu", this.onBack , this);

    //itemStore.setTag(MENUITEM_STORE_TAG);
    //itemReplay.setTag(MENUITEM_REPLAY_TAG);
    //itemMap.setTag(MENUITEM_MAP_TAG);
    //itemExit.setTag(MENUITEM_EXIT_TAG);

    if(!this.gamePassed) {
        this.menu = cc.Menu.create(menuItemReplay, menuItemMap, menuItemMainMenu, menuItemStore);
        //this.menu.alignItemsInColumns(4) ;
        this.menu.alignItemsHorizontally();
        this.menu.setPosition(cc.p(this.size.width-100 , 30));
        //this.menu.alignItemsInColumns(2 , 2) ;
      } else {
        //var itemNext = cc.MenuItemFont.create("Next Level", null, this);
        //itemNext.setTag(MENUITEM_NEXT_TAG);
        this.menu = cc.Menu.create(menuItemNext, menuItemReplay, menuItemMap, menuItemMainMenu, menuItemStore);
        //this.menu.alignItemsInColumns(5) ;
        this.menu.alignItemsHorizontally();
        this.menu.setPosition(cc.p(this.size.width-140,30));
        //過關塞星星等級
        this.setStarLevel(this.gameResult.star);
        //this.menu.alignItemsInColumns(2 , 3) ;
      }
    //this.menu.alignItemsVerticallyWithPadding(30);
    //this.addChild(menu,1000,999);
    //cc.registerTargetedDelegate(-127, true, this);

    //this.menu.setPosition(menuConfig.menuPosition);

    /*
    var items = this.menu.getChildren();
    for(var idx in items){
      var item = items[idx];
      if(item){
        item.setColor(menuConfig.menuFontColor);
      }
    }
    */

    this.addChild(this.menu, 20, MENUITEM_PARENT_TAG);
    //this._selectedMenuTag = -1;
  },


  setStarLevel: function(index) { 
    var starConfig = this.gameConfig.star;
    var starIcon = [] ;
    for(var i = 0 ; i < index ; i++) {
      starIcon[i] =  new cc.Sprite(starConfig.iconTexture, starConfig.iconTextureRect) ;
      starIcon[i].setAnchorPoint(cc.p(0,0)) ;
      starIcon[i].setPosition(cc.p(this.size.width/2 + starConfig.iconPositionX[i],
                                   starConfig.iconPositionY[i]));
      this.addChild(starIcon[i]);
    }
  },


  onKeyUp:function(keycode) {
    /*
    switch(keycode) {
      case cc.KEY.tab: // 9
        var items = this.menu.getChildren() ;
        var nextFocusIdx = -1;

        if(this._selectedMenuTag ===-1) {
          this._selectedMenuTag = items[0].getTag() ;
          nextFocusIdx = 0;
        }
        else {
          for(var i=0, len=items.length; i<len; i++) {
            if(items[i].isSelected()) {
              items[i].unselected() ;
              this._selectedMenuTag = items[(i+1)%len].getTag() ;
              nextFocusIdx = (i+1)%len;
              break ;
            }
          }
        }
        if (!GameConfig.isMute()) {
          GameConfig.playEffect(s_btnSwitchWAV) ;
        }
        items[nextFocusIdx].selected();
        break;
      case 13: //enter
        if(this._selectedMenuTag !== -1) {
          var selectedItem = this.menu.getChildByTag(this._selectedMenuTag);
          if(selectedItem)
            selectedItem.activate();
        }
        break ;
      case 117: // F6
        GameConfig.toggleGameSound() ;
    }
    */
  },

  onReplay:function() {
    this._focusChangeSound();
    GameConfig.stopMusic() ;

    delete this;

    cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, new GameLevelScene()));
  },
  shop: function() {
    cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, new GameShopLayer()));
  },
  _focusChangeSound: function() {
    if(!GameConfig.isMute())
      GameConfig.playEffect(s_changeSceneMP3);
  },

  onBack: function() {
    this._focusChangeSound() ;
    GameConfig.stopMusic() ;
    cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, new GameMenuScene()));
  },

  onNext: function() {

  },

  onMap: function() {
    this._focusChangeSound() ;
    GameConfig.stopMusic() ;

    cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, new GameSelectScene()));
  },

  onStore: function() {

  },

  //以下的3个函数是必须要用到的，不然会有错，必须加
  onTouchBegan:function(touch, event){
    return true;
  },
  onTouchMoved:function(touch, event){
    return true;
  },
  onTouchEnded:function(touch, event){
    return true;
  }

});

GameResultLayer.successScene = function (result) {
  var scene = cc.Scene.create();
  var gamePassedLayer = new GameResultLayer(result, true);
  if (gamePassedLayer) {
    scene.addChild(gamePassedLayer);
    return scene;
  }
  return null;
};

GameResultLayer.failScene = function(result) {
  var scene = cc.Scene.create();
  var gameOverLayer = new GameResultLayer(result, false);
  if (gameOverLayer) {
    scene.addChild(gameOverLayer);
    return scene;
  }
  return null;
};