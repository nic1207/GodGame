
//關卡選擇場景
var GameSelectLayer = cc.Layer.extend({
  isMouseDown:false,

  ctor:function () {
    //sys.garbageCollect();
    this._super();

    if ('touches' in sys.capabilities)
      this.setTouchEnabled(true); // KEYBOARD Not supported
    else if ('mouse' in sys.capabilities && 'keyboard' in sys.capabilities) {
      this.setMouseEnabled(true);
      this.setKeyboardEnabled(true);
    }
  },

  onEnter:function () {
    this._super();

    this.audioEngine = cc.AudioEngine.getInstance();
    var sz = cc.Director.getInstance().getWinSize();
    var director = cc.Director.getInstance();
    var bg = cc.TextureCache.getInstance().addImage(s_SelectBG);
    var background = new cc.Sprite(bg);
    var scale = sz.height / background.getContentSize().height;
    background.setScale(scale);
    background.setPosition(sz.width/2,sz.height/2);
    this.addChild(background, -999, 12);
    //if(!GameConfig.isMute()) {
    //  GameConfig.playMusic(s_musicMenu);
    //}
    // Add the menu
    this.initMenuLayer();
    return true;
  },

  initMenuLayer: function() {
    this.gameConfig = new GameConfig();
    var menuConfig = this.gameConfig.gameMenuScene.menuConfig;
    
    // create Play menu
    var sz = cc.Director.getInstance().getWinSize();
    this.mainMenu = cc.Menu.create();
    this.mainMenu.setPosition(sz.width/2,sz.height/2);
    this.addChild(this.mainMenu);
    
    var items = new Array();
    var saveData = GameSave.getInstance();
    var maxl = saveData.obj.maxLevel;
    var lockl = saveData.obj.lockLevel;
    //var sbg = cc.TextureCache.getInstance().addImage(s_levelBG);
    for(var i=0;i<maxl;i++) {
      var sbg = cc.Sprite.create(s_levelBG);
      sbg.setScale(0.6);
      items[i] = cc.MenuItemSprite.create(sbg, null, null, this.gotoSelectLevel, this);
      items[i].id = (i+1);
      
      if(i>=5)
        items[i].setPosition(i*-100+700,Math.floor(i/5)*-100);
      else
        items[i].setPosition(i*100-100,0);
        items[i].setAnchorPoint(0.5,0.5);
      var levelTitle = null;
      if(i>=lockl-1)
        levelTitle = cc.LabelTTF.create("Locked", 'Arial',10);
      else
        levelTitle = cc.LabelTTF.create((i+1), 'Arial',18);
      levelTitle.setPosition(24,20);
      items[i].addChild(levelTitle);
      this.mainMenu.addChild(items[i]);
    }
  },
  
  gotoSelectLevel:function(t) {
    console.log("gotoSelectLevel()",t.id);
    var saveData = GameSave.getInstance();
    if(t.id>=saveData.obj.lockLevel)
      return;
    saveData.obj.nowLevel = t.id;
    //console.log(saveData.lockLevel);
    //this._focusChangeSound();
    //this._selectedMenuTag = MENUITEM_PLAY_TAG;

    //delete this;
    //var director = cc.Director.getInstance();
    //cc.log("Director.isCleanupToScene = " + director.isSendCleanupToScene());
    //cc.AnimationCache.purgeSharedAnimationCache();
    //cc.SpriteFrameCache.purgeSharedSpriteFrameCache();
    //cc.TextureCache.purgeSharedTextureCache();
    //director.purgeDirector();
    //GameConfig.stopMusic() ;
    cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, new GameLevelScene()));
    //cc.log("Director.isCleanupToScene = " + director.isSendCleanupToScene());
  }

  //_focusChangeSound: function() {
  //  if(!GameConfig.isMute())
  //    this.audioEngine.playEffect(s_changeSceneMP3);
  //}

});

// This is called in main.js to load the main game menu
var GameSelectScene = cc.Scene.extend({
  onEnter: function() {
    this._super();
    var layer = new GameSelectLayer();
    // layer.init();
    this.addChild(layer);
  }
});
