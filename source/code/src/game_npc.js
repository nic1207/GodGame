/*
 * GameNpc.js
 */
//===========================================================================================
var GameNpc = cc.Sprite.extend({
  dx: 2,
  dead: false,
  _world: null,

  ctor: function(index) {
    cc.log("GameNpc ctor()");
    this._super();
    this.gameConfig = new GameConfig();
    this.npcInitialMove = false;
    this.npcChangeDirection = false;
    //this.npcPlayRunningAction = null;
    this.init();
    //this.setPosition(this.gameConfig.antNPC.rightAniLimit[this.npcIndex] - (this.gameConfig.antNPC.rightAniLimit[this.npcIndex] - this.gameConfig.antNPC.leftAniLimit[this.npcIndex])/2,
    //this.gameConfig.antNPC.landPosition[this.npcIndex]);
    this.position = cc.p(this.gameConfig.antNPC.rightAniLimit[index] - (this.gameConfig.antNPC.rightAniLimit[index] - this.gameConfig.antNPC.leftAniLimit[index])/2,
      this.gameConfig.antNPC.landPosition[index]);

    return this;
  },

  init: function() {
    //傳入存取的PLIST
    cc.SpriteFrameCache.getInstance().addSpriteFrames(s_MonsterPlist);

    //npc Animation
    var npcAnimFrames = [];
    for (var i = 1 ; i <= this.gameConfig.antNPC.AniTotalFrame ; i++) {
      var str = this.gameConfig.antNPC.itsName + i.toString() + ".png";
      var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
      npcAnimFrames.push(frame);
    }

    //使用我們上頭定義好的數組,創建動畫,第二參數為每個FRAME間隔時間
    var npcPlayAnimation = cc.Animation.create(npcAnimFrames, 0.2);
    this.npcPlayRunningAction = cc.RepeatForever.create(cc.Animate.create(npcPlayAnimation));

    //設定初始動作
    this.setDisplayFrame(npcAnimFrames[0]);

    //npc scale
    this.setScale(this.gameConfig.antNPC.baseSize);

    //Schedule Update
    this.scheduleUpdate();
  },

  createBox2dObject: function(world) {

    var playerBodyDef = new b2BodyDef();
    playerBodyDef.type = b2Body.b2_dynamicBody;
    //console.log(this.position);
    this.csize = this.getContentSize();
    playerBodyDef.position.Set(this.position.x/PTM_RATIO, this.position.y/PTM_RATIO);
    //playerBodyDef.position.Set(0, 0);
    playerBodyDef.userData = this;
    //playerBodyDef.gametype = "BOSS";
    //console.log(playerBodyDef);
    var csize = this.getContentSize();

    playerBodyDef.fixedRotation = true;

    var body = world.CreateBody(playerBodyDef);
    body.gametype = "NPC";
    this.body = body;

    this.xPos = this.body.GetPosition().x;
    //var circleShape = new b2CircleShape();
    //circleShape.m_radius = 1;
    var dynamicBox = new b2PolygonShape();
    //dynamicBox.SetAsBox(1, 1);//These are mid points for our 1m box
    //console.log(this);
    dynamicBox.SetAsBox(this.csize.width/2/PTM_RATIO, this.csize.height/2/PTM_RATIO);
    var fixtureDef = new b2FixtureDef();
    fixtureDef.shape = dynamicBox;
    fixtureDef.density = 1;//密度
    fixtureDef.friction = 1;//摩擦
    fixtureDef.restitution = 0;//彈性
    //fixtureDef.isSensor = true;   // 对象之间有碰撞检测但是又不想让它们有碰撞反应
    body.CreateFixture(fixtureDef);
    body.parent = this;
    this._world = world;
    //console.log(body);

    this.setBox(this.gameConfig.antNPC.baseSize);
  },

  moveRight: function() {
    var vel = this.body.GetLinearVelocity();
    vel.x = 5;
    this.body.SetLinearVelocity( vel );
    this.setFlippedX(true);
  },
  moveLeft: function() {
    var vel = this.body.GetLinearVelocity();
    vel.x = -5;
    this.body.SetLinearVelocity( vel );
    this.setFlippedX(false);
  },

  doDie: function() {
    console.log("doDie()");
    var sz = cc.Director.getInstance().getWinSize();
    this._world.DestroyBody(this.body);
    //this.removeFromParent();
    var tx = this.position.x +  (this.body.GetPosition().x - this.xPos)*32;
    //cc.Sequence.create依次执行
    //cc.Spawn.create同时执行
    //cc.Repeat.create重复执行
    //cc.RepeatForever.create 永久重复执行
    var act = cc.Sequence.create(cc.RotateTo.create(0.3, 180),cc.MoveTo.create(0.5, cc.p(tx, 0)),cc.CallFunc.create(this.removeSelf, this));
    this.runAction(act);
    this.waitDead = true;
  },

  die: function() {
    console.log("die()");
    this.dead = true;
    this.stopAllActions();
  },

  removeSelf: function() {
    console.log("removeSelf()");
    this.stopAllActions();
    this.removeFromParent();
  },

  setBox:function(value) {
    var vecs = this.body.GetFixtureList().GetShape().GetVertices();
    for(var i in vecs) {
      vecs[i].Multiply(value);
    }   
  },

  changeDirection: function(d) {
    this.npcChangeDirection = d;
    if(this.npcChangeDirection) {
      this.moveRight();
      if(this.npcPlayRunningAction) {
        if(!this.doRunRight) {
          //if(this.npcPlayRunningAction._originalTarget != null)
            //this.stopAction(this.npcPlayRunningAction);
          //if(this.npcPlayRunningAction.right._originalTarget==null)
          //this.runAction(this.npcPlayRunningAction);
          this.doRunRight = true;
          this.doRunLeft = false;
        }
      }
    } else {
      this.moveLeft();
      if(this.npcPlayRunningAction) {
        if(!this.doRunLeft) {
          //if(this.npcPlayRunningAction_originalTarget != null)
            //this.stopAction(this.npcPlayRunningAction);
          //if(this.npcPlayRunningAction.left._originalTarget==null)
          //this.runAction(this.npcPlayRunningAction);
          this.doRunLeft = true;
          this.doRunRight = false;
        }
      }
    }
  },

  update:function() {
    if(this.dead && !this.waitDead) {
      this.doDie();
      return;
    }
    if(!this.npcInitialMove) {
      this.npcInitialMove = true;
      //this.runAction(this.actionPlay);
      this.runAction(this.npcPlayRunningAction);
      //this.npcChangeDirection = false;
      this.moveLeft();
    } else {
      if(this.xPos) {
        var nowP = this.body.GetPosition();
        //console.log("!!!!!!!!!!!!!!",nowP.x-this.xPos);
        if(nowP.x - this.xPos < -this.dx) {
          this.changeDirection(true);
        } else if(nowP.x - this.xPos > this.dx){
          this.changeDirection(false);
        }

        if(this.npcChangeDirection) {
          this.moveRight();
        } else {
          this.moveLeft();
        }
      }
    }
  }

});
