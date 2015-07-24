var TG = {};
TG.MUTE = false ;

var GameConfig = cc.Class.extend({

  ctor:function (filename) {
    var mapSize = cc.Director.getInstance().getWinSize();
    this.hardDieTime = 6;
    //cc.log(mapSize.width,mapSize.height);
    this.player = {
      //"carRight":cc.TextureCache.getInstance().addImage(s_CarRight),
      //"carLeft":cc.TextureCache.getInstance().addImage(s_CarLeft),
      //"carUp":cc.TextureCache.getInstance().addImage(s_CarUp),
      //"carDown":cc.TextureCache.getInstance().addImage(s_CarDown),
      //"runner":s_Runner,
      //"runnerMotion":cc.SpriteBatchNode.create(s_RunnerMotion),
      //"runnerPlist":cc.SpriteFrameCache.getInstance().addSpriteFrames(s_RunnerPlist),
      //"runner":s_Runner,
      "baseTextureRect":cc.rect(0, 0, 32, 32),
      "startPosition":cc.p(0, 0),
      "hitbox":cc.rect(17,8,44,59),
      "centerOffset":cc.p(16,16),
      "baseSpeed":1,
      "maxVelocity":7,
      "baseAccelleration":1,
      "startingMovementDirection":null,
      "startingRenderDirection":"right"
    };

    this.antNPC = {
      "bossNum" : 1,
      "num" : 5,
      "startingRenderDirection":"left",
      "itsName":"ant",
      "itsBossName":"boss",
      "AniTotalFrame" : 4,
      "baseAccelleration": 1,
      "baseSize": 0.58,
      //"bullet" : cc.TextureCache.getInstance().addImage(s_eBullet),
      //子彈
      "bullet" : {
        "tag" : "eBullet",
        "texture" : cc.TextureCache.getInstance().addImage(s_eBullet),
        "textureRect" : cc.rect(0, 0, 36, 36),
        "textureSize": 1
      },
      "leftAniLimit" : [415,365,1170,1840,2144],
      "rightAniLimit" : [565,515,1360,2040,2320],
      "landPosition" : [80,400,80,120,80],
    };
   	/*
    this.greenCar = {
      "greenCarRight":cc.TextureCache.getInstance().addImage(s_GreenCarRight),
      "greenCarLeft":cc.TextureCache.getInstance().addImage(s_GreenCarLeft),
      "greenCarUp":cc.TextureCache.getInstance().addImage(s_GreenCarUp),
      "greenCarDown":cc.TextureCache.getInstance().addImage(s_GreenCarDown),
      "baseTextureRect":cc.rect(0, 0, 32, 32),
      "startPosition":cc.p(272, 224),
      "hitbox":cc.rect(-14,-14,28,28),
      "centerOffset":cc.p(16,16),
      "baseSpeed":5,
      "maxVelocity":6,
      "baseAccelleration":.1,
      "startingDirection":null
    };
     */

    this.maps = {
      level1:{
        "filename":"res/tilemaps/nic8.tmx",
        "position":cc.p(1,1)
      },
      level2:{
        "filename":"res/tilemaps/nic9.tmx",
        "position":cc.p(1,1)
      }
    };

    this.globals = {
      "MSG_LAYER_TOUCHED" :1,
      "MSG_PLAYER_MOVED":2,
      "MSG_MAP_TOUCHED":3,
      "MSG_INPUT_CHANGED":4,
      "MSG_TIME_OVER":5,
      "TAG_TILE_MAP":1,
      "TAG_MEDIATOR":2,
      "TAG_PLAYER":3,
      "TAG_CAMERA":4,
      "TAG_TIMER":5,
      "TAG_TIMER_TEXT":6,
      "TAG_HUDLAYER":7,
      "TAG_SCORE":8,
      "TAG_CUSTOMER":9,
      "TAG_SIGN":10,
      "TAG_GAME_LAYER":11,
      "TAG_MENU_BACKGROUND":12,
      "TAG_MENU_TITLE":13,
      "TAG_CAR_ENTITY":14,
      "TAG_CONTROL_BAR":15,
      "TAG_HEADER_BAR":16,
      "TAG_NPC":17,
      "TAG_ABC_ITEMS":18,
    };

    this.score = {
      "position":cc.p(200,440),
      "alignment":cc.TEXT_ALIGNMENT_LEFT
    };

    this.headerbar = {
      "scaleHeight": 10,
      "menu": {
        "offsetWidth": 100,
        "offsetHeight": 40,
        "exitNormal": cc.Sprite.create(s_MenuExit, cc.rect(0, 0, 49, 50)),
        "exitSelected": cc.Sprite.create(s_MenuExit, cc.rect(51, 0, 49, 50)),
        "pauseNormal": cc.Sprite.create(s_MenuPause, cc.rect(0, 0, 64, 64)),
        "pauseSelected": cc.Sprite.create(s_MenuPause, cc.rect(0, 0, 64, 64))
      },
      "moneyScore": {
        "iconTexture": cc.TextureCache.getInstance().addImage(s_DollarSign),
        "iconTextureRect": cc.rect(0, 0, 48, 48),
        "iconPosition": cc.p(0,10),
        "textFont":"DejaVuSansMono",
        "textSize": 30,
        "textColor":cc.c3b(255,255,255),
        "textPosition": cc.p(60,20)
      },
      "timer": {
		    "level1": {"INIT_MINUTE":6, "INIT_SECOND":30},
        "position":cc.p(mapSize.width-70, 20),
        "textFont":"DejaVuSansMono",
        "textSize": 30
      },
      "abcStatus": {
        "textureAnchorPoint": cc.p(0,0),
        "textureRect" : cc.rect(0, 0, 64, 60),
        "textureSize": 0.35,
        "num": 7,
        "matchcontact1":["C","O","R","N"],
      },
    };

    this.star = {
      "iconTexture": cc.TextureCache.getInstance().addImage(s_STAR),
      "iconTextureRect": cc.rect(0, 0, 69, 62),
      "iconPositionX": [-107,-34,39],
      "iconPositionY": [392,427,392],
      "iconTextureSize": 1
    },

    //遊戲中ABC字母項目
    this.abcItems = {
      "abclevel1" : {
        "tag" : "abc",
        "textureRect" : cc.rect(0, 0, 64, 60),
        "textureSize": 0.29,
        "contact":["C","O","R","O","C","N"],
      },
    },

    //遊戲中所有道具項目
    this.items = {
      //奶油
      "butter" : {
        "tag" : "butter",
        "texture" : cc.TextureCache.getInstance().addImage(s_Butter),
        "textureRect" : cc.rect(0, 0, 80, 80),
        "textureSize": 0.5
      },
      //巧克力醬
      "chocoSauce" : {
        "tag" : "chocoSauce",
        "texture" : cc.TextureCache.getInstance().addImage(s_ChocoSauce),
        "textureRect" : cc.rect(0, 0, 76, 102),
        "textureSize": 0.6
      },
      //玉米粒
      "corn" : {
        "tag" : "corn",
        "texture" : cc.TextureCache.getInstance().addImage(s_Corn),
        "textureRect" : cc.rect(0, 0, 500, 500),
        "textureSize": 0.05
      },
      //麵粉袋
      "flourBag" : {
        "tag" : "flourBag",
        "texture" : cc.TextureCache.getInstance().addImage(s_FlourBag),
        "textureRect" : cc.rect(0, 0, 178, 209),
        "textureSize": 0.13
      },
      //巧克力醬子彈
      "chocoBullet" : {
        "tag" : "chocoBullet",
        "texture" : cc.TextureCache.getInstance().addImage(s_ChocoBullet),
        "textureRect" : cc.rect(0, 0, 100, 67),
        "textureSize": 1
      },
      //玉米子彈
      "cornBullet" : {
        "tag" : "cornBullet",
        "texture" : cc.TextureCache.getInstance().addImage(s_CornBullet),
        "textureRect" : cc.rect(0, 0, 16, 16),
        "textureSize": 1
      },
    },


    this.gameResultScene = {
      "failedBackground": cc.TextureCache.getInstance().addImage(s_OverBG),
      "passededBackground": cc.TextureCache.getInstance().addImage(s_PassedBG),
      "backgroundTextureRect":cc.rect(0, 200, 960, 640),
      "backgroundPosition":cc.p(mapSize.width/2,mapSize.height/2),
      "result":{
        "resultFont":"Comica BD",
        "resultFontSize":48,
        //"resultTitleColor": cc.c3b(0xff,0x95,0x00),
        "resultTitleColor": cc.c3b(241,139,26),
        "resultTextColor": cc.c3b(255,255,255)
      },
      "menuConfig":{
        "menuPosition":cc.p(mapSize.width/2, 100),
        "menuFont":"Comica BD",
        "menuFontSize":42,
        "menuFontColor":cc.c3b(0x00, 0xc6, 0x18)
      }
    };

    this.gameMenuScene = {
      "backgroundTexture": cc.TextureCache.getInstance().addImage(s_MenuBG),
      "backgroundTextureRect":cc.rect(0, 0, 800, 600),
      //"backgroundPosition":cc.p(400,225),
      //"backgroundTextureRect":cc.rect(0, 0, 800, 450),
      "backgroundPosition":cc.p(mapSize.width/2,mapSize.height/2),
      "titleTexture": cc.TextureCache.getInstance().addImage(s_MenuTitle),
      "titlePosition":cc.p(400,250),
      "menuConfig":{
        "menuPosition":cc.p((mapSize.width-400)/2, 50),
        "playNormal": cc.Sprite.create(s_MenuPlay, cc.rect(0, 0, 151, 54)),
        "playSelected": cc.Sprite.create(s_MenuPlay, cc.rect(0, 0, 151, 54)),
        "playDisabled": cc.Sprite.create(s_MenuPlay, cc.rect(0, 0, 151, 54)),
        "aboutNormal": cc.Sprite.create(s_MenuAbout, cc.rect(0, 0, 151, 54)),
        "aboutSelected": cc.Sprite.create(s_MenuAbout, cc.rect(0, 0, 151, 54)),
        "menuPlayPosition": cc.p(200, 100),
        "menuAboutPosition": cc.p(200, 50),
        "labelFont":"Oblivious font",
        "labelPosition":cc.p(170, 40),
        "labelSize":32
      }
    };

    this.gameActionBtn = {
      "leftNormal": cc.Sprite.create(s_MenuL, cc.rect(0, 0, 65, 65)),
      "leftSelected": cc.Sprite.create(s_MenuL, cc.rect(67, 0, 72, 72)),
      "rightNormal": cc.Sprite.create(s_MenuR, cc.rect(0, 0, 65, 65)),
      "rightSelected": cc.Sprite.create(s_MenuR, cc.rect(67, 0, 72, 72)),
      "jumpNormal": cc.Sprite.create(s_MenuA, cc.rect(0, 0, 65, 65)),
      "jumpSelected": cc.Sprite.create(s_MenuA, cc.rect(67, 0, 72, 72)),
      "hitNormal": cc.Sprite.create(s_MenuB, cc.rect(0, 0, 65, 65)),
      "hitSelected": cc.Sprite.create(s_MenuB, cc.rect(67, 0, 72, 72)),
      "leftPosition":cc.p(5, 20),
      "rightPosition":cc.p(50, 20),
      "jumpPosition":cc.p(mapSize.width-90, 20),
      "hitPosition":cc.p(mapSize.width-40, 20)
    };


    // needed for JS-Bindings compatibility
    cc.associateWithNative( this, cc.Class );
  },

});

GameConfig.isMute = function() {
  return TG.MUTE ;
};

GameConfig.toggleGameSound = function() {
  TG.MUTE = !TG.MUTE ;

  var audioEngine = cc.AudioEngine.getInstance() ;
  if(TG.MUTE) {
    audioEngine.pauseAllEffects();
    audioEngine.pauseMusic();
  } else {
    audioEngine.resumeMusic();
  }
};

GameConfig.playEffect = function(s_effect) {
  var audioEngine = cc.AudioEngine.getInstance() ;
  audioEngine.setEffectsVolume(0.8);
  audioEngine.playEffect(s_effect);
};

GameConfig.playMusic = function(s_music) {
  var audioEngine = cc.AudioEngine.getInstance() ;
  audioEngine.setMusicVolume(0.7);
  audioEngine.playMusic(s_music, true);
};

GameConfig.stopMusic = function(s_music) {
  var audioEngine = cc.AudioEngine.getInstance() ;
  if(audioEngine.isMusicPlaying())
    audioEngine.stopMusic(s_music);
};
