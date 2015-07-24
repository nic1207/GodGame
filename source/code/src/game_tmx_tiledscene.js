// an array of the entities in the game
var TAG_SPRITE_MANAGER = 1;
var PTM_RATIO = 32;
var EMPTY_TILE_GID = 0;
var b2Vec2 = Box2D.Common.Math.b2Vec2
  , b2BodyDef = Box2D.Dynamics.b2BodyDef
  , b2Body = Box2D.Dynamics.b2Body
  , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
  , b2World = Box2D.Dynamics.b2World
  , b2debugDraw = Box2D.Dynamics.b2DebugDraw
  , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
  , ContactListener = Box2D.Dynamics.b2ContactListener
  , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;


//var entities = new Array();
//var physicsEntities = new Array();
var GameTileLayer = cc.Layer.extend({
  tileMapNode: null,
  level:"1",
  _BG: null,
  _player: null,
  //_npc: null,
  _lastEyeX:0,
  _world:null,
  _coin: 0,
  _status: false,

  _maxScore: 0,
  _currentScore: 0,

  ctor: function() {

    this._super();
    this.objects = [];

    //道具初始化
    this.coinNum = 0;
    this.flourBag = new Array();
    this.flourBagNum = 0;
    this.corn = new Array();
    this.cornNum = 0;
    this.butter = new Array();
    this.butterNum = 0;
    this.chocoSauce = new Array();
    this.chocoSauceNum = 0;

    //ABC字母數
    this.abcCharacterManager = null;
    this.abcCurrentNum = 0;
    this.abcMatchArray = new Array();

    this.hardDieLimit = 0;
    this.hardDieStart = 0;

    this.setTouchEnabled(true);
    this.setKeyboardEnabled(true);
    this.gameConfig = new GameConfig();
    var sz = cc.Director.getInstance().getWinSize();
    this.screenSize = sz;

    this.setupPhysicsWorld();
    
    this._BG = cc.Sprite.create(s_BgLevel1);
    this._BG.setAnchorPoint( cc.p(0,0) );
    //this._BG = cc.LayerColor.create(new cc.Color4B(100, 100, 250, 255));
    this.addChild(this._BG, 0, 99);
    
    this.gameLayer = new GameLayer();
    this.gameLayer.world = this._world;
    this.gameLayer.setPosition(cc.p(0,0));
    this.addChild(this.gameLayer, 1, this.gameConfig.globals.TAG_GAME_LAYER);
    //this.backgroundLayer = new GameBackgroundLayer();
    //this.gameLayer.addChild(this.backgroundLayer, 0, this.gameConfig.globals.TAG_TILE_MAP);
    this.addScrollingBackgroundWithTileMap();
    this.setupCollisionTiles();
    this.setupNPC();
    this.setupPlayer();
    //this.setupBoss();
    //this._BG = cc.LayerColor.create(new cc.Color4B(100, 100, 250, 255));
    //this.gameLayer.addChild(this._BG);
    this.controlBarLayer = new ControlBarLayer();
    this.controlBarLayer.setPosition(cc.p(0,0));
    this.controlBarLayer.setTarget(this._player);
    this.addChild(this.controlBarLayer, 2, this.gameConfig.globals.TAG_CONTROL_BAR);
    this.headerBar = new HeaderBarLayer("level1");
    this.headerBar.parent = this;
    this.moneyStatus = this.headerBar.initMoneyStatus();
    this.headerBar.delegateTimesUp(this.gameOver.bind(this));

    this.addChild(this.headerBar, 2, this.gameConfig.globals.TAG_HEADER_BAR);

    this.scheduleUpdate();
  },

  setupPhysicsWorld: function() {
    //var gravity = new b2Vec2(0, -60);//重力
    var gravity = new b2Vec2(0, -100);//重力
    var doSleep = true;
    this._world = new b2World(gravity, doSleep);//有重力的物理世界
    this._world.SetContinuousPhysics(true);//設定為連續物理模擬

    /*
    var debugDraw = new b2debugDraw();
    debugDraw.SetSprite(cc.renderContext);
    var screenSize = cc.Director.getInstance().getVisibleSize();
    //console.log("xx=",screenSize.width);
    debugDraw.SetDrawScale(PTM_RATIO);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(1);
    debugDraw.SetFlags(b2debugDraw.e_shapeBit);
    this._world.SetDebugDraw(debugDraw);
    */

    this._listener = new ContactListener();
    var that = this;
    this._listener.BeginContact = function(contact) {
      //console.log(contact.GetFixtureA().GetBody().gametype,contact.GetFixtureB().GetBody().gametype);
      var a = contact.GetFixtureA().GetBody();
      var b = contact.GetFixtureB().GetBody();
      if ((a.gametype == 'PLAYER' && b.gametype == 'BOSS')
        || (a.gametype == 'BOSS' && b.gametype == 'PLAYER')
        || (a.gametype == 'PLAYER' && b.gametype == 'NPC')
        || (a.gametype == 'NPC' && b.gametype == 'PLAYER')
        ) {
        if(that._player.hardDie) {//無敵星星
          //NPC Die
          //console.log(a.parent,b.parent);
          if(a.gametype == "NPC" || a.gametype == 'BOSS' ) {
            if(a.gametype == "NPC") {
              that.caculateCurrentScore(100);
            }
            else {
              that.caculateCurrentScore(500); 
            }
            a.parent.die();
          }
          if(b.gametype == "NPC" || b.gametype == 'BOSS' ) {
            if(b.gametype == "NPC") {
              that.caculateCurrentScore(100);
            }
            else {
              that.caculateCurrentScore(500); 
            }
            b.parent.die();
          }
        } else {
          if(!that._player.scaleUp&&!that._player.changing)
            that.gameOver();//Game Over
          else
            that._player.setNormalState();//人物變小
        }
      }
      if((a.gametype == 'NPC' && b.gametype == 'pBULLET')
        ||(a.gametype == 'pBULLET' && b.gametype == 'NPC')
        ||(a.gametype == 'BOSS' && b.gametype == 'pBULLET')
        ||(a.gametype == 'pBULLET' && b.gametype == 'BOSS')
        ) {
        if(a.gametype == 'pBULLET') {
          a.parent.destroy();
        }
        if(b.gametype == 'pBULLET') {
          b.parent.destroy();
        }
        if(a.gametype == 'NPC' || a.gametype == 'BOSS') {
          if(a.gametype == "NPC") {
            that.caculateCurrentScore(100); 
          }
          else {
            that.caculateCurrentScore(500);  
          }
          a.parent.die();
        }
        if(b.gametype == 'NPC' || b.gametype == 'BOSS') {
          if(b.gametype == "NPC") {
            that.caculateCurrentScore(100); 
          }
          else {
            that.caculateCurrentScore(500); 
          }
          b.parent.die();
        }
      }
       if((a.gametype == 'PLAYER' && b.gametype == 'eBULLET')
        ||(a.gametype == 'eBULLET' && b.gametype == 'PLAYER')
        ) {
        console.log("pppppp",a.gametype,b.gametype);
        if(a.gametype == 'eBULLET') {
          a.parent.destroy();
        }
        if(b.gametype == 'eBULLET') {
          b.parent.destroy();
        }
        if(a.gametype == 'PLAYER') {
          if(!that._player.scaleUp&&!that._player.changing)
            that.gameOver();//Game Over
          else
            that._player.setNormalState();//人物變小
        }
        if(b.gametype == 'PLAYER') {
          if(!that._player.scaleUp&&!that._player.changing)
            that.gameOver();//Game Over
          else
            that._player.setNormalState();//人物變小
        }

      }
      //子彈與場景碰撞
      if((a.gametype == 'WALL' && b.gametype == 'eBULLET')
           || (a.gametype == 'eBULLET' && b.gametype == 'WALL')
           || (a.gametype == 'WALL' && b.gametype == 'pBULLET')
           || (a.gametype == 'pBULLET' && b.gametype == 'WALL')
           || (a.gametype == 'eBULLET' && b.gametype == 'pBULLET')
           || (a.gametype == 'pBULLET' && b.gametype == 'eBULLET')
        ) {
        if(a.gametype == 'eBULLET'||a.gametype == 'pBULLET') {
          a.parent.destroy();
        }
        if(b.gametype == 'eBULLET'||b.gametype == 'pBULLET') {
          b.parent.destroy();
        }
      }
      if(a.gametype == 'eBULLET') {
          a.parent.destroy();
      }
      if(b.gametype == 'eBULLET' ) {
          b.parent.destroy();
      }
    }
    this._world.SetContactListener(this._listener);
  },

  setupPlayer: function() {
    cc.SpriteFrameCache.getInstance().addSpriteFrames(s_PlayerPlist);
    var mgr = cc.SpriteBatchNode.create(s_PlayerMotion);
    var player = new GamePlayer();
    player.setAnchorPoint(0.5, 0.5);
    //player.position = cc.p(50, 1200);
    player.position = cc.p(50, 1100);
    player.createBox2dObject(this._world);
    player.setScale(0.2);
    this.player = player;
    this.gameLayer.addChild(player,99, this.gameConfig.globals.TAG_PLAYER);
    //this.addChild(player,99, this.gameConfig.globals.TAG_PLAYER);
    this._player = player;
  },

  setupBoss: function() {
    //cc.SpriteFrameCache.getInstance().addSpriteFrames(s_BossMonsterPlist);
   // var bossMgr = cc.SpriteBatchNode.create(s_BossMonsterMotion);
    var boss = new GameBoss(cc.p(1950,600));
    boss._layer = this.gameLayer;
    //boss.position = cc.p(1500,400);
    //boss.basePosition = boss.position;
    boss.setAnchorPoint(0.5, 0.5);
    boss.createBox2dObject(this._world);
    this.boss = boss;
    this.gameLayer.addChild(boss, 99, this.gameConfig.globals.TAG_NPC);

  },

  setupNPC: function() {
    //======================= New NPC =======================
    //cc.SpriteFrameCache.getInstance().addSpriteFrames(s_MonsterPlist);
    var npc = new Array();
    for(var i = 0 ; i < this.gameConfig.antNPC.num ; i++) {
      npc[i] = new GameNpc(i);
      npc[i] .setAnchorPoint(0.5, 0.5);
      npc[i] .createBox2dObject(this._world);
      this.gameLayer.addChild(npc[i], 99, this.gameConfig.globals.TAG_NPC);
    }
  },

  addScrollingBackgroundWithTileMap: function() {
    var tileMapNode = new GameTileMap();
    this.tileMapNode = tileMapNode;
    
    var saveData = GameSave.getInstance();
    //console.log(saveData);
    switch(saveData.level) {
      case 1:
        tileMapNode.initWithTMXFile(this.gameConfig.maps.level1.filename);
      break;
      case 2:
        tileMapNode.initWithTMXFile(this.gameConfig.maps.level2.filename);
      break;
      default:
      break;
    }
                  
    tileMapNode.initWithTMXFile(this.gameConfig.maps.level1.filename);
    tileMapNode.setPosition(0,0);

    this.gameLayer.addChild(tileMapNode, 0, this.gameConfig.globals.TAG_TILE_MAP);
    
    //load一般道具
    this.loadNormalItems();
    //load字母
    this.loadABCItems();
    //計算此關初始最大完成度
    this.checkLevelMaxComplete();

    /*
    var pos = 62; //子弹距离场景左端的位置
    var count = 1;
    if(count > 0)
    {
        var delta = 50; //子弹之间的间隔

        for(var i = 0 ; i < count ; i++, pos += delta)
        {
           PolygonShape pd = new PolygonShape();

           //创建一个多边形的物体
           Vec2[] vec2s = new Vec2[6];
           vec2s[0] = new Vec2(-0.6f, 0.66f);
           vec2s[1] = new Vec2(-0.8f, -0.2f);
           vec2s[2] = new Vec2(-0.28f,-0.88f);
           vec2s[3] = new Vec2(0.4f,-0.6f);
           vec2s[4] = new Vec2(0.88f,-0.1f);
           vec2s[5] = new Vec2(0.4f,0.82f);
           pd.set(vec2s, 6);

           var dynamicBox = new b2PolygonShape();
           dynamicBox.SetAsBox(this.csize.width/2/PTM_RATIO, this.csize.height/2/PTM_RATIO);

           var fd = new b2FixtureDef();
           fd.shape = dynamicBox;
           fd.density = 1;
           fd.friction = 0.8;
           fd.restitution = 0.3;
           fd.isSensor = false;   // 对象之间有碰撞检测但是又不想让它们有碰撞反应

           var db = new Box2D.Dynamics.b2BodyDef;
           db.position.set(pos/RATE, (ScreenH - FLOOR_HEIGHT - 50)/RATE);
           db.type = BodyType.DYNAMIC;
           db.bullet = true; //表示这是个高速运转的物体，需要精细的模拟

           var body = new b2BodyDef();
           body = world.createBody(db);
           //body.userData = new Bullet(bulletBitmap, pos, FLOOR_HEIGHT+15.0f,30,30, 0);
           //body.createFixture(fd);

           //bullet.add(body);
        }
    }
    */
  },

  setupCollisionTiles: function() {
    //console.log(this.tileMapNode);
    if(!this.tileMapNode)
      return;
    var group = this.tileMapNode.getObjectGroup("Wall");
    if(group) {
      var objs = group.getObjects();
      var x, y, w, h;
      for (var i in objs) {
        x = objs[i].x;
        y = objs[i].y;
        w = objs[i].width;
        h = objs[i].height;
        var _point=cc.p(x+w/2,y+h/2);
        var _size=cc.p(w,h);
        this.makeBox2dObjAt(_point, _size, 0.3, 1, 0, -1);
      }
    }
  },

  makeBox2dObjAt: function(p, size, f, dens, rest, boxid) {
    var sprite = cc.Sprite.create();
    var bodyDef = new b2BodyDef();
    //if(d)
    //  bodyDef.type = b2_dynamicBody;
    bodyDef.position.Set(p.x/PTM_RATIO, p.y/PTM_RATIO);

    sprite.setPosition(p.x, p.y);

    bodyDef.userData = sprite;
    var body = this._world.CreateBody(bodyDef);
    body.gametype = "WALL";
    var dynamicBox = new b2PolygonShape();
    //console.log(size);
    dynamicBox.SetAsBox(size.x/2/PTM_RATIO, size.y/2/PTM_RATIO);//These are mid points for our 1m box

    // Define the dynamic body fixture.
    var fixtureDef = new b2FixtureDef();
    fixtureDef.shape = dynamicBox;
    fixtureDef.density = dens;//密度
    fixtureDef.friction = f;//摩擦力
    fixtureDef.restitution = rest;//彈性
    body.CreateFixture(fixtureDef);
    this.addChild(sprite);
  },
  /*
  draw: function() {
    //this._super();
    //this._world.DrawDebugData();

    cc.renderContext.fillStyle = "rgba(255,255,255,1)";
    cc.renderContext.strokeStyle = "rgba(255,255,255,1)";

    //if (this._radians < 0)
    this._radians = 360;
    cc.drawingUtil.drawCircle(cc.PointZero(), 30, cc.DEGREES_TO_RADIANS(this._radians), 60, true);

    //this._super();
    //this._world.DrawDebugData();
    //console.log("XXXXXXXXX");
     //cc.renderContext.lineWidth = 3;
     //cc.renderContext.strokeStyle = "rgba(0,255,0,1)";
     //cc.drawingUtil.drawLine(cc.p(100, 100), cc.p(200, 200));

    //console.log("DDDDDDDDDDDDDDDDDDDDDDDDD");
    //if(!this.tileMapNode)
    // return;

    var group = this.tileMapNode.getObjectGroup("Wall");
    if(group) {
      var objs = group.getObjects();
      //console.log(objs);
      var x, y, w, h;
      for (var i in objs) {
        x = objs[i].x;
        y = objs[i].y;
        //x = 0;
        //y = 0;
        w = objs[i].width;
        h = objs[i].height;
        //console.log(x,y,w,h);
        //var _point=cc.p(x+w/2,y+h/2);
        //var _size=cc.p(w,h);
        cc.renderContext.lineWidth = 3;
        //cc.renderContext.fillStyle = "rgba(255,255,255,1)";//上下文填充颜色
        cc.renderContext.strokeStyle = "rgba(0,255,0,1)";
        cc.drawingUtil.drawLine(cc.p(x, y), cc.p(x + w, y));
        cc.drawingUtil.drawLine(cc.p(x + w, y), cc.p(x + w, y + h));
        cc.drawingUtil.drawLine(cc.p(x + w, y + h), cc.p(x, y + h));
        cc.drawingUtil.drawLine(cc.p(x, y + h), cc.p(x, y));
        cc.renderContext.lineWidth = 1;
      }
    }

  },
  */
  /*
  // Keyboard handling
  onKeyUp:function(e){
    this._player.setIdle(e);
  },

  onKeyDown:function(e){
    this._player.handleKey(e);
  },
  */

  // make a player, initialize, add to layer
  initPlayer: function(){
    // test animaiton on player
    var actionTo = cc.MoveTo.create(5, cc.p(1024, 32));
    this.player.runAction(actionTo);
  },


  checkSomething: function(layername) {

    var tileMap = this.gameLayer.getChildByTag(this.gameConfig.globals.TAG_TILE_MAP);
    if(!tileMap)
      return;

    var tileMapPos = tileMap.getPosition();
    var tileSize = tileMap.getTileSize();
    var mapSize = tileMap.getMapSize();
    var layer = tileMap.getLayer(layername);
    //var playerPosition = this._player.getPosition();
    //var playerSize = this._player.getContentSize();
    var playerPosition_X = this._player.getBoundingBox().getX();
    var playerPosition_Y = this._player.getBoundingBox().getY();
    var playerSize_Width = this._player.getBoundingBox().getWidth();
    var playerSize_Height = this._player.getBoundingBox().getHeight();
    var tileI = new Array(); 
    var tileJ = new Array();
    var realtileI = new Array(); 
    var realtileJ = new Array();
    
    //建立人物剛體四個座標點(x,y),(x+w,y),(x,y+h),(x+w,y+h)
    tileI[0] = Math.floor(playerPosition_X / tileSize.width);
    tileJ[0] = Math.floor(((mapSize.height * tileSize.height) - playerPosition_Y) / tileSize.height);
    tileI[1] = Math.floor((playerPosition_X + playerSize_Width) / tileSize.width);
    tileJ[1] = Math.floor(((mapSize.height * tileSize.height) - (playerPosition_Y - playerSize_Height)) / tileSize.height);
    //tileI[2] = Math.floor(playerPosition_X / tileSize.width);
    //tileJ[2] = Math.floor(((mapSize.height * tileSize.height) - (playerPosition_Y - playerSize_Height)) / tileSize.height);
    //tileI[3] = Math.floor((playerPosition_X + playerSize_Width) / tileSize.width);
    //tileJ[3] = Math.floor(((mapSize.height * tileSize.height) - (playerPosition_Y - playerSize_Height)) / tileSize.height);

    //建立人物剛體所包含的tile場景範圍
    for(var i = 0 ; i <= tileI[1] - tileI[0] ; i++) {
      realtileI.push(tileI[0] + i);
    }
    for(var j = 0 ; j < realtileI.length ; j++) {
      realtileJ.push(tileJ[0] - j);
    }

    //針對以上範圍作碰撞偵測 
    for(var i = 0 ; i < realtileI.length ; i++) {
      for(var j = 0 ; j < realtileJ.length ; j++) {
        
        if(!layer)
          return;
      
        // Tiled Map space coordinates. Start at top left, 0,0
        var tileCoord = cc.p(realtileI[i], realtileJ[j]);
        //console.log(tileCoord,mapSize);
        if(realtileI[i] < 0 || realtileI[i] >= mapSize.width) {
          //console.log(tileI,"gameOver I");
          //this.gameOver();
          return;
        }

        if((mapSize.height - realtileJ[j]) <= 0 || (mapSize.height - realtileJ[j]) >= mapSize.height) {
          if(mapSize.height - realtileJ[j] <= 0) {
            //console.log(tileJ,mapSize.height,"gameOver J",(mapSize.height-tileJ));
            this.gameOver();
          }
          return;
        }

        var GID = layer.getTileGIDAt(tileCoord);
        var tileProperties = JSON.stringify(tileMap.propertiesForGID(GID));
        //console.log("tileProperties=",tileProperties);

        //console.log(tileProperties);
        if(tileProperties && !this._player.die) {
        
          if(tileProperties == "{\"type\":\"coin\"}") {
            //console.log("getGoin");
            this.collectItemAtPoint(tileCoord);
            this.caculateCurrentScore(1); 
          }

          if(tileProperties == "{\"type\":\"exit\"}") {
            //console.log("gameSuccess");
            this.gameSuccess();
          }

          if(tileProperties == "{\"type\":\"flourBag\"}") {
            console.log("hugePlayerEffect");
            this.hugePlayerEffect(tileCoord);
            this.caculateCurrentScore(100); ;
          }

          if(tileProperties == "{\"type\":\"corn\"}") {
            //console.log("getBullet");
            this.getCornBullet(tileCoord);
            this.caculateCurrentScore(100); 
          }

          if(tileProperties == "{\"type\":\"butter\"}") {
            //console.log("getBullet");
            this.hardDie(tileCoord);
            this.caculateCurrentScore(100); 
          }

          if(tileProperties == "{\"type\":\"chocoSauce\"}") {
            //console.log("getBullet");
            this.freeze(tileCoord);
          }

          if(tileProperties == "{\"type\":\"abc\"}") {
            //console.log("getBullet");
            this.collectAbc(tileCoord);
            this.caculateCurrentScore(100); 
          }

        }
      }
    }
    delete realtileI;
    delete realtileJ;
  },

  //吃金幣
  collectItemAtPoint:function(point) {
    //cc.log("collectItem()");
    this._coin++;
    var map = this.gameLayer.getChildByTag(this.gameConfig.globals.TAG_TILE_MAP);
    var layer = map.getLayer("Item");
    //var existingGID = layer.getTileGIDAt(point);
    //cc.log("ORB GID " + existingGID);
    layer.setTileGID(EMPTY_TILE_GID, point);
    //console.log(this._coin);
    this.moneyStatus.setScore(this._coin);
  },

  //吃麵粉袋變大隻視效
  hugePlayerEffect:function(point) {
    //先對場景中的tile物件作隱藏
    var map = this.gameLayer.getChildByTag(this.gameConfig.globals.TAG_TILE_MAP);
    var layer = map.getLayer("Item");
    layer.setTileGID(EMPTY_TILE_GID, point);

    //再觸發隱藏真實的物件
    for(var i = 0 ; i < this.flourBag.length ; i++) {
      if(point.x === this.flourBag[i].tag.x && point.y === this.flourBag[i].tag.y) {
        this.flourBag[i].removeFromParent();
      }
    }

    //變大視效
    //this._player.setScaleUp(0,this._player.bigScale);
    this._player.setScaleUp(0,0.3);
  },

  //吃到玉米粒得到玉米子彈
  getCornBullet:function(point) {
    //先對場景中的tile物件作隱藏
    var map = this.gameLayer.getChildByTag(this.gameConfig.globals.TAG_TILE_MAP);
    var layer = map.getLayer("Item");
    layer.setTileGID(EMPTY_TILE_GID, point);

    //再觸發隱藏真實的物件
    for(var i = 0 ; i < this.corn.length ; i++) {
      if(point.x === this.corn[i].tag.x && point.y === this.corn[i].tag.y) {
        this.corn[i].removeFromParent();
      }
    }

    //得到子彈視效
    this._player.equipBullet(this.gameLayer);
  },

  //吃到奶油變成無敵
  hardDie:function(point) {
    //先對場景中的tile物件作隱藏
    var map = this.gameLayer.getChildByTag(this.gameConfig.globals.TAG_TILE_MAP);
    var layer = map.getLayer("Item");
    layer.setTileGID(EMPTY_TILE_GID, point);

    //再觸發隱藏真實的物件
    for(var i = 0 ; i < this.butter.length ; i++) {
      if(point.x === this.butter[i].tag.x && point.y === this.butter[i].tag.y) {
        this.butter[i].removeFromParent();
      }
    }

    //無敵視效
    this._player.setHardDieState();
    //開始計算有效時間
    this.hardDieStart = this.headerBar.getElapsedTime();
  },

  //吃到巧克力醬獲得凝固能力
  freeze:function(point) {
    //先對場景中的tile物件作隱藏
    var map = this.gameLayer.getChildByTag(this.gameConfig.globals.TAG_TILE_MAP);
    var layer = map.getLayer("Item");
    layer.setTileGID(EMPTY_TILE_GID, point);

    //再觸發隱藏真實的物件
    for(var i = 0 ; i < this.chocoSauce.length ; i++) {
      if(point.x === this.chocoSauce[i].tag.x && point.y === this.chocoSauce[i].tag.y) {
        this.chocoSauce[i].removeFromParent();
      }
    }

    //凝固能力視效
  },

  //吃到字母並蒐集
  collectAbc:function(point) {
    //先對場景中的tile物件作隱藏
    var map = this.gameLayer.getChildByTag(this.gameConfig.globals.TAG_TILE_MAP);
    var layer = map.getLayer("Item");
    layer.setTileGID(EMPTY_TILE_GID, point);

    //再觸發隱藏真實的物件
    for(var i = 0 ; i < this.gameConfig.abcItems.abclevel1.contact.length ; i++) {
      if(point.x === this.abcCharacterManager.tilpPosArray[i].x && 
         point.y === this.abcCharacterManager.tilpPosArray[i].y) {
        //吃到REMOVE掉此SPRITE
        this.abcCharacterManager.sprite[i].removeFromParent();
        //判斷是吃到甚麼字母
        this.checkWhatCharacter(this.abcCharacterManager.typeArray[i]);
      }
    } 

  },

  //遊戲失敗結束
  gameOver: function() {
    if(this._status)
      return;
    console.log(this.level + ' gameOver!!,  elapsed:'+ this.headerBar.getElapsedTime() +',   money: '+ this.moneyStatus.getScore());
    //死掉人物淡出
    this._player.setDieState();
    //切到GAME OVER SCENE
    this.scheduleOnce(this.showFail, 2);
    this._status = true;
  },

  //遊戲成功結束
  gameSuccess: function() {
    if(this._status)
      return;
    //cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, new GameMenuScene()));
    console.log(this.level + ' gameSuccess!!,  elapsed:'+ this.headerBar.getElapsedTime()
      + ',   money: '+this.moneyStatus.getScore()) ;
    console.log("dddd");
    this._player.playWinEffect();
    this.scheduleOnce(this.showSuccess, 3);
    this._status = true;
  },

  //
  showFail: function() {
    cc.Director.getInstance().replaceScene(cc.TransitionFade.create(3, GameResultLayer.failScene({
      level: this.level,
      elapsed:  this.headerBar.getElapsedTime(),
      money: this._coin
    })));

  },
  //顯示過關資訊
  showSuccess: function() {
    cc.Director.getInstance().replaceScene(cc.TransitionFade.create(3, GameResultLayer.successScene({
      level: this.level,
      elapsed:  this.headerBar.getElapsedTime(),
      money: this._coin,
      star: this.checkLevelComplete()
    })));
  },

  updateRender: function(dt) {
    this.checkSomething("Item");
    this.checkSomething("Layer 0");
    //if(this._npc)
    //  this._npc.updateRender();
    //if(this._player)
    //  this._player.updateRender();
  },

  //Load道具
  loadNormalItems:function () {
    var map = this.gameLayer.getChildByTag(this.gameConfig.globals.TAG_TILE_MAP);
    var layer = map.getLayer("Item");
    var mapSize = layer.getLayerSize();
    for (var i = 0 ; i < mapSize.width ; i++) {
      for (var j = 0; j < mapSize.height ; j++) {
        var GID = layer.getTileGIDAt(cc.p(i,j));
        var tileProperties = JSON.stringify(map.propertiesForGID(GID));
        if(tileProperties) {
          var x = i * map.getTileSize().width;
          var y = (map.getMapSize().height * map.getTileSize().height) - j * map.getTileSize().height;
          var position = cc.p(x,y);

          //金幣
          if(tileProperties == "{\"type\":\"coin\"}") {
            this.coinNum++;
          }

          //麵粉袋
          if(tileProperties == "{\"type\":\"flourBag\"}") {
            var tempFlourBag = new GameItem(this.gameConfig.items.flourBag, position, this.flourBagNum, cc.p(i,j), false, null);
            this.flourBagNum++;
            tempFlourBag.setAnchorPoint(0.5, 0.5);
            this.flourBag[this.flourBagNum - 1] = tempFlourBag;
            tempFlourBag.destroy();
            this.gameLayer.addChild(this.flourBag[this.flourBagNum - 1], 98);
          }
          //玉米
          else if(tileProperties == "{\"type\":\"corn\"}") {
            var tempCorn = new GameItem(this.gameConfig.items.corn, position, this.cornNum, cc.p(i,j), false, null);
            this.cornNum++;
            tempCorn.setAnchorPoint(0.5, 0.5);
            this.corn[this.cornNum - 1] = tempCorn;
            tempCorn.destroy();
            this.gameLayer.addChild(this.corn[this.cornNum - 1], 98);
          }
          //奶油
          else if(tileProperties == "{\"type\":\"butter\"}") {
            var tempButter = new GameItem(this.gameConfig.items.butter, position, this.butterNum, cc.p(i,j), false, null);
            this.butterNum++;
            tempButter.setAnchorPoint(0.5, 0.5);
            this.butter[this.butterNum - 1] = tempButter;
            tempButter.destroy();
            this.gameLayer.addChild(this.butter[this.butterNum - 1], 98);
          }
          //巧克力醬
          else if(tileProperties == "{\"type\":\"chocoSauce\"}") {
            var tempChocoSauce = new GameItem(this.gameConfig.items.chocoSauce, position, this.chocoSauceNum, cc.p(i,j), false, null);
            this.chocoSauceNum++;
            tempChocoSauce.setAnchorPoint(0.5, 0.5);
            this.chocoSauce[this.chocoSauceNum - 1] = tempChocoSauce;
            tempChocoSauce.destroy();
            this.gameLayer.addChild(this.chocoSauce[this.chocoSauceNum - 1], 98);
          }
        }
      }
    }
  },

  //Load ABC字母
  loadABCItems:function () {
    var map = this.gameLayer.getChildByTag(this.gameConfig.globals.TAG_TILE_MAP);
    var layer = map.getLayer("Item");
    var mapSize = layer.getLayerSize();
    var typeArray = new Array();
    var posArray = new Array();
    var tilpPosArray = new Array();

    for (var i = 0 ; i < mapSize.width ; i++) {
      for (var j = 0; j < mapSize.height ; j++) {
        var GID = layer.getTileGIDAt(cc.p(i,j));
        var tileProperties = JSON.stringify(map.propertiesForGID(GID));
        if(tileProperties) {
          var x = i * map.getTileSize().width;
          var y = (map.getMapSize().height * map.getTileSize().height) - j * map.getTileSize().height;
          var position = cc.p(x,y);
          var tilpPosition = cc.p(i,j);
          
          //abc字母
          if(tileProperties == "{\"type\":\"abc\"}") {
            console.log(this.gameConfig.abcItems.abclevel1.contact[this.abcCurrentNum]);
            typeArray.push(this.gameConfig.abcItems.abclevel1.contact[this.abcCurrentNum]);
            this.abcCurrentNum++;
            posArray.push(position);
            tilpPosArray.push(tilpPosition);
          }   
        }
      }
    }

    this.abcCharacterManager = new GameAbcItemManager(this.gameConfig, typeArray, posArray, tilpPosArray, this.gameLayer);
  },

  //Check吃到哪一種的字母
  checkWhatCharacter:function (string) {
    for (var i = 0 ; i < this.gameConfig.headerbar.abcStatus.matchcontact1.length ; i++) {
      if(string === this.gameConfig.headerbar.abcStatus.matchcontact1[i]) {
        //在HeadBar上顯示吃到啥字母
        this.headerBar.setAbcCharacterStatus(string,i);
        //check吃到的字母是否能換到物品
        this.checkCharacterExchangeItems(i,this.headerBar);
      }
    }
  },

  checkCharacterExchangeItems : function(index,headerbar) {
    var isInsise = false;
    //MatchArray都沒東西的話先塞
    if(this.abcMatchArray.length == 0) {
      this.abcMatchArray.push(index);
    }
    //要判斷是否塞過
    else {
      for(var i = 0 ; i < this.abcMatchArray.length ; i++) {
        if(index == this.abcMatchArray[i]) {
          isInsise = true;
        }
      }

      //如果沒塞過就把它塞進去
      if(!isInsise)
        this.abcMatchArray.push(index);
    }

    //判斷獲得物品
    if(this.abcMatchArray.length == this.gameConfig.headerbar.abcStatus.matchcontact1.length) {
      headerbar.setItemStatus(this.gameConfig.items.corn, this.abcMatchArray.length + 1);
      this.abcMatchArray.splice(0,this.abcMatchArray.length);
    }

  },

  //關卡最大完成度計算
  checkLevelMaxComplete:function () {
    
    console.log(this.flourBagNum);
    console.log(this.cornNum);
    console.log(this.butterNum);
    console.log(this.abcCurrentNum);
    console.log(this.coinNum);
    
    var time = this.gameConfig.headerbar.timer["level1"].INIT_MINUTE * 60 +
               this.gameConfig.headerbar.timer["level1"].INIT_SECOND;

    this._maxScore = 100 * this.flourBagNum + 100 * this.cornNum  + 100 * this.butterNum +
                     100 * this.abcCurrentNum + 500 * this.gameConfig.antNPC.bossNum + 100 * this.gameConfig.antNPC.num + time;
    
    console.log("maxScore : " +　this._maxScore);
  },

  //關卡完成度計算
  checkLevelComplete:function () {
    var time = this.gameConfig.headerbar.timer["level1"].INIT_MINUTE * 60 +
               this.gameConfig.headerbar.timer["level1"].INIT_SECOND;

    this._currentScore = this._currentScore + time - this.headerBar.getElapsedTime();
    console.log("currentScore : " + this._currentScore);
    if(this._currentScore > this._maxScore * 0.8)
      return 3;
    else if(this._currentScore > this._maxScore * 0.6)
      return 2;
    else
      return 1;

    //過關將分數歸零
    this._currentScore = 0; 
  },

  //計算目前累加總分
  caculateCurrentScore:function (value) {
    this._currentScore = this._currentScore + value;
    //console.log(this._currentScore);
  },

  // update every frame of the game
  update:function (dt) {
    //It is recommended that a fixed time step is used with Box2D for stability
    //of the simulation, however, we are using a variable time step here.
    //You need to make an informed choice, the following URL is useful
    //http://gafferongames.com/game-physics/fix-your-timestep/
    
    /*
    //抓取Player是否發射子彈
    if(this._player.hitBullet) {
      if(this._player.isGoing) {
        var tempBullet = new GameBullet(this.gameConfig.items.cornBullet, cc.p(this._player.getPosition().x + 20, this._player.getPosition().y));
      }
      else {
        var tempBullet = new GameBullet(this.gameConfig.items.cornBullet, cc.p(this._player.getPosition().x - 20, this._player.getPosition().y));
      }
      tempBullet.setAnchorPoint(0.5, 0.5);
      tempBullet.createBox2dObject(this._world);
      tempBullet.launch(this._player.isGoing);
      this.gameLayer.addChild(tempBullet,99);
    }
    */


    //吃到無敵奶油呈現無敵 超過時間恢復正常
    if(this._player.hardDie) {
      if(this.headerBar.getElapsedTime() - this.hardDieStart > this.gameConfig.hardDieTime) {
        this._player.setNormalState();
      }
    }


    var velocityIterations = 8;
    var positionIterations = 1;

    // Instruct the world to perform a single step of simulation. It is
    // generally best to keep the time step and iterations fixed.
    this._world.Step(dt, velocityIterations, positionIterations);
    //this._world.DrawDebugData();

    //Iterate over the bodies in the physics world
    for (var b = this._world.GetBodyList(); b; b = b.GetNext()) {
      if (b.GetUserData() != null) {
        //Synchronize the AtlasSprites position and rotation with the corresponding body
        var myActor = b.GetUserData();
        myActor.setPosition(b.GetPosition().x * PTM_RATIO, b.GetPosition().y * PTM_RATIO);
        //myActor.setRotation(-1 * cc.RADIANS_TO_DEGREES(b.GetAngle()));
       // console.log(b.GetAngle());
      }
    }
    this.updateRender(dt);
  },

});


// Use this to create different levels / areas on a map
var GameLevelScene = cc.Scene.extend({
  ctor:function () {

    this._super();
    var layer = new GameTileLayer();
    layer.init();
    this.addChild(layer,0);
  }

  // not currently used. fix this up to make it easy to launch any level
  /*
  initWithLevelName:function (levelName) {
    var map = new GameTileMap();
    console.log("levelName=",levelName);
    map.initWithTMXFile(levelName);
    map.setPosition(cc.p(0,0));
    this.addChild(map, 0, this.gameConfig.globals.TAG_TILE_MAP);
  }
  */
});

