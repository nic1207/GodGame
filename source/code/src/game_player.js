/*
 * GamePlayerUnit.js
 */
//===========================================================================================
var GamePlayer = cc.Sprite.extend({
  body: null,
  velocity: null,
  scaleUp: false,
  scale: 0.2,
  changing: false,
  hardDie: false, 
  getBullet: false,
  die:false,
  hitPress: false,
  hitBullet: false,
  hitBulletTimer: 0,
  _world: null,
  _layer: null,

  playerRunFrames : new Array(),

  playRunningAction : null,
  playDeadAction : null,
  playJumpAction : null,
  playStandByAction : null,

  ctor: function() {
    cc.log("GamePlayer ctor()");
    this._super();
    this.init();
    this.gameConfig = new GameConfig();
    this.audioEngine = cc.AudioEngine.getInstance();
    this.velocity = new b2Vec2(0, 0);
    this.do_move_left = false;
    this.do_move_right = false;
    this.can_move_up = true;
    this.do_move_up = false;
    this.max_hor_vel = 10;
    this.max_ver_vel = 40;
    this.isInTheSky = false;
    this.scaleUp = false;
    this.hardDie = false;
    this.die = false;
    this.isGoing = false;
    this.idle = false;

    this.isPlayerMovingRight = false;
    this.isPlayerMovingLeft  = false;
    this.dynamicBox = new b2PolygonShape();
    this.fixtureDef = new b2FixtureDef();
    this.counter = 0;
    this.tempX = 0;
  },
  //------------------------------------------------------------------
  //人物初始設定
  init: function() {

    var playerDieFrames = new Array();
    var playerJumpFrames = new Array();
    var playerStandByFrames = new Array();

    //push人物跑步的動畫
    for (var i = 1 ; i < 10 ; i++) {
      var str = "0" + i + ".png";
      var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
      this.playerRunFrames.push(frame); 
    }

    //push人物死掉的動畫
    for (var i = 1 ; i < 6 ; i++) {
      var str = "dead0" + i + ".png";
      var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
      playerDieFrames.push(frame); 
    }

    //push人物跳躍的動畫
    for (var i = 1 ; i < 6 ; i++) {
      var str = "jump" + i + ".png";
      var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
      playerJumpFrames.push(frame); 
    }

    //push人物StandBy的動畫
    for (var i = 1 ; i < 5 ; i++) {
      var str = "standby0" + i + ".png";
      var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
      playerStandByFrames.push(frame); 
    }

    //使用我們上頭定義好的數組,創建動畫,第二參數為每個FRAME間隔時間
    var PlayRunningAnimation = cc.Animation.create(this.playerRunFrames, 0.1);
    this.playRunningAction = cc.RepeatForever.create(cc.Animate.create(PlayRunningAnimation));
    var PlayDieAnimation = cc.Animation.create(playerDieFrames, 0.1);
    this.playDieAction = cc.Sequence.create(cc.Animate.create(PlayDieAnimation));
    var PlayJumpAnimation = cc.Animation.create(playerJumpFrames, 0.1);
    this.playJumpAction = cc.Sequence.create(cc.Animate.create(PlayJumpAnimation));
    var PlayStandByAnimation = cc.Animation.create(playerStandByFrames, 0.1);
    this.playStandByAction = cc.RepeatForever.create(cc.Animate.create(PlayStandByAnimation));
   
    //設定初始動作
    //this.runAction(this.playStandByAction); 
    this.setDisplayFrame(this.playerRunFrames[0]);

    //(暫時)避免第一次吃到無敵奶油會有停頓現象
    this.setColor(cc.c3b(139, 139, 0));
    this.setColor(cc.c3b(255, 255, 255));

    this.scheduleUpdate();
  },
  //------------------------------------------------------------------
  //設定人物物理引擎物件
  createBox2dObject: function(world) {
    var playerBodyDef = new b2BodyDef();
    playerBodyDef.type = b2Body.b2_dynamicBody;
    //console.log(PTM_RATIO);
    playerBodyDef.position.Set(this.position.x/PTM_RATIO, this.position.y/PTM_RATIO);
    //playerBodyDef.gravityScale = 1;
    //playerBodyDef.linearDamping = 1;
    //playerBodyDef.angularDamping = 0.0f;
    playerBodyDef.userData = this;
    playerBodyDef.fixedRotation = true;
    this.csize = this.getContentSize();

    var body = world.CreateBody(playerBodyDef);
    body.gametype = "PLAYER";
    this.body = body;
    //var circleShape = new b2CircleShape();
    //circleShape.m_radius = 1;
    //var dynamicBox = new b2PolygonShape();
    this.dynamicBox.SetAsBox(this.csize.width/2/PTM_RATIO*0.5, this.csize.height/2/PTM_RATIO);
    //this.dynamicBox.SetAsBox(this.csize.width/2/PTM_RATIO, this.csize.height/2/PTM_RATIO);
    //console.log(this.csize.width/2/PTM_RATIO, this.csize.height/2/PTM_RATIO);
    //dynamicBox.SetAsBox(64/2/PTM_RATIO, 64/2/PTM_RATIO);
    //var fixtureDef = new b2FixtureDef();
    this.fixtureDef.shape = this.dynamicBox;
    this.fixtureDef.density = 1;//密度
    this.fixtureDef.friction = 0.7;//摩擦力
    this.fixtureDef.restitution = 0;//彈性
    body.CreateFixture(this.fixtureDef);
    body.parent = this;
    this._world = world;

    //設定預設SIZE大小
    //this.setScale(this.scale);
    this.setBox(this.scale);
  },
  //------------------------------------------------------------------
  //設定人物KEYBOARD放開觸發動作
  setIdle: function(e) {
    //if(this.die)
    // return false;

    if(e === cc.KEY.a) {
      if(this.isPlayerMovingLeft) {
        this.isPlayerMovingLeft = false;
        this.setFlippedX(true);
        this.idle = true;
        if(this.playRunningAction._originalTarget != null)
          this.stopAction(this.playRunningAction);
        this.setDisplayFrame(this.playerRunFrames[0]);      
      }
      this.do_move_left = false;
    }
    else if(e === cc.KEY.d) {
      if(this.isPlayerMovingRight) {
        this.isPlayerMovingRight = false;
        this.setFlippedX(false);
        this.idle = true;
        if(this.playRunningAction._originalTarget != null)
          this.stopAction(this.playRunningAction);
        this.setDisplayFrame(this.playerRunFrames[0]);
      }
      this.do_move_right = false;
    }
    else if(e === cc.KEY.k) {
      this.do_move_up = false;
      this.can_move_up = true;
    }
    else if(e === cc.KEY.l) {
      //.hitPress = false;
      this.hitBullet = false; 
      this.hitBulletTimer = 0;
    }
  },
  //------------------------------------------------------------------
  //設定人物右移
  rightWalk: function() {
    if(this.isPlayerMovingLeft)
      return;

    this.setFlippedX(false);
    this.add_velocity(new b2Vec2(2,0));
  },
  //------------------------------------------------------------------
  //設定人物左移
  leftWalk: function() {
    if(this.isPlayerMovingRight)
      return;

    this.setFlippedX(true);
    this.add_velocity(new b2Vec2(-2,0));
  },
  //------------------------------------------------------------------
  //設定人物跳躍
  jump: function() {

    //if(Math.abs(this.body.GetLinearVelocity().y) > 0.0)
    if(isInTheSky)
    {
      return false;
    }

    if(this.do_move_up)
      return false;

    this.do_move_up = true;

    /*
    if(this.playStandByAction._originalTarget != null){
      this.stopAction(this.playStandByAction);
    }

    if(this.playRunningAction._originalTarget != null){
      this.stopAction(this.playRunningAction);
    }
    */

    this.runAction(this.playJumpAction); 

    if (!GameConfig.isMute())
      this.audioEngine.playEffect(s_jumpMP3);
  },
  //------------------------------------------------------------------
  //設定人物KEYBOARD按下觸發動作
  handleKey:function(e) {
    if(this.die)
      return false;

    if(e === cc.KEY.a) {
      
      if(!this.isPlayerMovingLeft && !this.isPlayerMovingRight && !this.isInTheSky) {
      //if(!this.isInTheSky) {
        this.isPlayerMovingLeft = true;
        this.isGoing = false;
        this.setFlippedX(false);
        this.do_move_left = true;
        /*
        if(this.playStandByAction._originalTarget != null)
          this.stopAction(this.playStandByAction);
        if(this.playJumpAction._originalTarget != null)
          this.stopAction(this.playJumpAction);
        
        this.idle = false;
        if(this.playRunningAction._originalTarget != null)
          this.stopAction(this.playRunningAction);
        */
        this.runAction(this.playRunningAction);
      }       
    }
    else if(e === cc.KEY.d) {
      if(!this.isPlayerMovingRight && !this.isPlayerMovingLeft && !this.isInTheSky) {
      //if(!this.isInTheSky) {
        this.isPlayerMovingRight = true;
        this.isGoing = true;
        this.setFlippedX(true);
        this.do_move_right = true;
        /*
        if(this.playStandByAction._originalTarget != null)
          this.stopAction(this.playStandByAction);
        if(this.playJumpAction._originalTarget != null)
          this.stopAction(this.playJumpAction);
        
        this.idle = false;
        if(this.playRunningAction._originalTarget != null)
          this.stopAction(this.playRunningAction);
        */
        this.runAction(this.playRunningAction);
      }      
    }
    else if(e === cc.KEY.k) {
      this.jump();
    }
    else if(e === cc.KEY.l) {
      this.hitBullet = true;

      if(this.hitBulletTimer == 0)
        this.launchBullet();
    }
  },
  //------------------------------------------------------------------
  //人物UPDATE
  update: function() {
    
    if(this.die)
      return false;

    //子彈間斷發射
    if(this.hitBullet){
      this.hitBulletTimer++;

      if(this.hitBulletTimer == 15){ 
        this.hitBulletTimer = 0;
      }
    }

    //判斷有無在空中
    if(Math.abs(this.body.GetLinearVelocity().y) > 0.01) {
      isInTheSky = true;
      this.idle = true;
      //空中要有對應的FRAME
      if(this.isPlayerMovingLeft){
        this.setFlippedX(true);
      }
      if(this.isPlayerMovingRight){
        this.setFlippedX(false);
      }
    }
    else {
      isInTheSky = false;
      /*
      if(this.idle === true && !this.isPlayerMovingRight && !this.isPlayerMovingLeft){
        if(this.playStandByAction._originalTarget != null){
          this.stopAction(this.playStandByAction);
        }
        if(this.playJumpAction._originalTarget != null)
          this.stopAction(this.playJumpAction);
        this.runAction(this.playStandByAction);
        //console.log("aaaaa");
        this.idle = false;  
      }
      */
    }

    //避免在空中持續對X軸方向施力會產生可以跳躍的現象
    if(this.do_move_left) {
      if(this.tempX === this.getPosition().x){
        isInTheSky = true;
      }
      this.leftWalk();
      this.tempX = this.getPosition().x;
    }
    else if(this.do_move_right) {
      if(this.tempX === this.getPosition().x){
        isInTheSky = true;
      }
      this.rightWalk();
      this.tempX = this.getPosition().x;
    }

    //跳躍動作施力d
    if(this.do_move_up && this.can_move_up) {
      this.add_velocity(new b2Vec2(0,28));
      this.can_move_up = false;
    }

    //無敵狀態
    if(this.hardDie) {
      this.counter++;
      if(this.counter == 1) {
        this.setColor(cc.c3b(139, 139, 0));
      }
      else if(this.counter == 16){
        this.setColor(cc.c3b(255, 255, 112));
      }
      else if(this.counter == 30){
        this.counter = 0;
      }
    }
  },
  //------------------------------------------------------------------
  //添加人物速度
  add_velocity:function(vel) {

    var b = this.body;
    var v = b.GetLinearVelocity();
    v.Add(vel);

    if(!b.IsAwake())
      b.SetAwake(true);

    //check for max horizontal and vertical velocities and then set
    if(Math.abs(v.y) > this.max_ver_vel)
    {
      v.y = this.max_ver_vel * v.y/Math.abs(v.y);
    }

    if(Math.abs(v.x) > this.max_hor_vel)
    {
      v.x = this.max_hor_vel * v.x/Math.abs(v.x);
    }

    //console.log(v);
    //set the new velocity
    b.SetLinearVelocity(v);
  },
  //------------------------------------------------------------------
  //設定人物放大狀態
  setScaleUp:function(type,value) {
    //if(value < 1) {
    //  console.log("setScaleUp Error!!!");
    //  return false;
    //}

    if(this.scaleUp)
      return false;

    this.scaleUp = true;

    //播放huge音效
    if (!GameConfig.isMute())
      this.audioEngine.playEffect(s_hugeSound);

    if(type === 0){
      //var scaleTo_level_1 = cc.ScaleTo.create(0.3, value - 0.4);
      var scaleTo_level_2 = cc.ScaleTo.create(0.2, value - 0.2);
      var scaleTo_level_3 = cc.ScaleTo.create(0.2, value - 0.1);
      var scaleTo_level_4 = cc.ScaleTo.create(0.2, value - 0.05);
      var scaleTo_level_5 = cc.ScaleTo.create(0.2, value);
      //this.runAction(cc.Sequence.create(scaleTo_level_1, scaleTo_level_2, scaleTo_level_3, scaleTo_level_4, scaleTo_level_5));
      this.runAction(cc.Sequence.create(scaleTo_level_2,scaleTo_level_3, scaleTo_level_4, scaleTo_level_5));
    }
    else{
      var scaleTo = cc.ScaleTo.create(1.2, value);
      this.runAction(scaleTo);
    }
    //this.setBox(1 + this.scale);
    this.setBox(value/this.scale);
    //this.setBox(1.35);
    this.scale = value;
  },
  //------------------------------------------------------------------
  //設定人物縮小狀態
  setScaleDown:function(type,value) {
    //if(value > 1) {
    //  console.log("setScaleDown Error!!!");
    //  return false;
    //}

    if(!this.scaleUp)
      return false;

    this.scaleUp = false;
    this.changing = true;
    var cb = cc.CallFunc.create(this.finishChanged, this);
    if(type === 0){
      //var scaleTo_level_1 = cc.ScaleTo.create(0.3, value + 0.4);
      //var scaleTo_level_2 = cc.ScaleTo.create(0.3, value + 0.3);
      var scaleTo_level_3 = cc.ScaleTo.create(0.3, value + 0.05);
      var scaleTo_level_4 = cc.ScaleTo.create(0.3, value + 0.1);
      var scaleTo_level_5 = cc.ScaleTo.create(0.3, value);
      //this.runAction(cc.Sequence.create(scaleTo_level_1, scaleTo_level_2, scaleTo_level_3, scaleTo_level_4, scaleTo_level_5));
      this.runAction(cc.Sequence.create(scaleTo_level_3, scaleTo_level_4, scaleTo_level_5,cb));
      //this.runAction(cc.Sequence.create(scaleTo,cb));
    }
    else{
      var scaleTo = cc.ScaleTo.create(1.2, value); 
      this.runAction(cc.Sequence.create(scaleTo,cb));
    }
    this.setBox(value/this.scale);
    this.scale = value;
  },
  finishChanged: function() {
    this.changing = false;
  },
  //------------------------------------------------------------------
  //設定人物正常狀態
  setNormalState:function() {
    if(this.scaleUp && !this.hardDie) {
      //刪除剛體
      //this._world.DestroyBody(this.body);
      //console.log(this.body);
      //閃爍
      var blink = cc.Blink.create(1.2, 4);
      this.runAction(blink);
      //縮小
      this.setScaleDown(0,0.2); 
    }
    else if(this.hardDie) {
      this.hardDie = false;
      this.setColor(cc.c3b(255, 255, 255));
      //有無敵奶油就停止播放
      this.audioEngine.stopEffect(this.soundId);
    }
  },
  //------------------------------------------------------------------
  //設定人物無敵狀態
  setHardDieState:function() {
    if(this.hardDie)
      return false;

    this.hardDie = true;
    this.counter = 0;

    //播放super音效
    if (!GameConfig.isMute())
      this.soundId = this.audioEngine.playEffect(s_superSound);
  },
  //------------------------------------------------------------------
  //設定人物物理碰撞BOX
  setBox:function(value) {
    /*
    //如果有Fixturey則刪除
    if(this.body.GetFixtureList()){
      this.body.DestroyFixture(this.body.GetFixtureList());
    }

    this.csize = this.getContentSize();
    this.dynamicBox.SetAsBox(this.csize.width*value/2/PTM_RATIO, this.csize.height*value/2/PTM_RATIO);
    //console.log(this.csize.width*value/2/PTM_RATIO, this.csize.height*value/2/PTM_RATIO);
    //console.log(this.dynamicBox.GetVertices());
    //var vecl = new b2Vec2(5,5);
    //console.log(vecl);
    //var l = new b2Vec2(0,0);
    //for(l in this.dynamicBox.GetVertices()) {
      //console.log(l);
      //vec.b2Vec2.Multiply(0.9);
      //this.dynamicBox.GetVertices(vec).Multiply(0.9);
    //}
    
    this.fixtureDef.shape = this.dynamicBox;
    this.fixtureDef.density = 1;
    this.fixtureDef.friction = 1;
    this.fixtureDef.restitution = 0;
    this.body.CreateFixture(this.fixtureDef);
    console.log(this.body);
    */
    var vecs = this.body.GetFixtureList().GetShape().GetVertices();
    for(var i in vecs) {
      vecs[i].Multiply(value);
    }   
  },
  //------------------------------------------------------------------
  //設定人物GG狀態
  setDieState:function() {
    if(this.die)
      return false;
    
    //有無敵就停止播放
    if(this.hardDie)
    {
      this.audioEngine.stopEffect(this.soundId);
    }

    
    //if(this.playStandByAction._originalTarget != null)
    //  this.stopAction(this.playStandByAction);
    
    this.playDieEffect();//播放GG音效
    
    this.hardDie = false;
    this.die = true;
    this.getBullet = false;

    //設定死掉動畫
    if(this.isGoing) {
      //先把移動動作idle掉
      this.setIdle(cc.KEY.d);
    }
    else {
      //先把移動動作idle掉
      this.setIdle(cc.KEY.a);
    }

    //摧毀剛體
    var sz = cc.Director.getInstance().getWinSize();
    this._world.DestroyBody(this.body);
    //動畫行為 死掉動畫->淡出->移除
    var act = cc.Sequence.create(this.playDieAction,cc.FadeOut.create(2),cc.CallFunc.create(this.removeSelf, this));
    this.runAction(act);
  },
  //------------------------------------------------------------------
  removeSelf: function() {
    this.stopAllActions();
    this.removeFromParent();
  },
  //------------------------------------------------------------------
  playDieEffect: function() {
    //播放GG音效
    if (!GameConfig.isMute())
      this.audioEngine.playEffect(s_dieSound);
  },
  //------------------------------------------------------------------
  playWinEffect: function() {
    //播放win音效
    if (!GameConfig.isMute())   
      this.audioEngine.playEffect(s_passed);
  },
  //------------------------------------------------------------------
  //裝備子彈
  equipBullet:function(layer) {
    this._layer = layer;
    this.getBullet = true;
  },
  //------------------------------------------------------------------
  //發射子彈
  launchBullet:function() {
    if(this.getBullet) {  
      //播放子彈音效
      if (!GameConfig.isMute())
        this.audioEngine.playEffect(s_hitMP3);

      if(this.isGoing) {
        var temp = new GameBullet(this.gameConfig.items.cornBullet, cc.p(this.getPosition().x + 50, this.getPosition().y));
      }
      else {
        var temp = new GameBullet(this.gameConfig.items.cornBullet, cc.p(this.getPosition().x - 50, this.getPosition().y));
      }
      temp.setAnchorPoint(0.5, 0.5);
      //新增子彈剛體
      temp.createBox2dObject(this._world);
      //發射子彈
      temp.launch(this.isGoing);
      //增加到場景裡
      this._layer.addChild(temp, 99);
    }
  },
  //------------------------------------------------------------------
  //摧毀子彈
  //destroyBullet:function(index) {
    /*
    for(var i = 0 ; i < this.tempBullets.length ; i++) {
      if(this.tempBullets[i].__instanceId === index) {
        this.tempBullets[i].setHide();
        this.tempBullets.pop();  
      }
    }
    */
  //},
  //------------------------------------------------------------------
});
