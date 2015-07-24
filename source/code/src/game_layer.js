// Game Container
var GameLayer = cc.Layer.extend({
  gameViewSize:null,
  world: null,

	ctor:function () {
		this._super();
        this.scheduleUpdate();
        this.gameConfig = new GameConfig();
        gameViewSize = cc.Director.getInstance().getWinSize();
        console.log(gameViewSize.width);
        console.log(gameViewSize.height);
        //this.endLimit = (Math.abs(3200 - gameViewSize.width) / 32) + 100;
        this.endLimit = 93.5;
        //console.log(gameViewSize.width);
        //console.log(this.endLimit);
  },

  draw: function() {
    this._super();
    if(this.world)
      this.world.DrawDebugData();
  },

  update:function (dt) {
        var playerMotion = this.getChildByTag(this.gameConfig.globals.TAG_PLAYER);
        //console.log(playerMotion.position.x + playerMotion.body.GetPosition().x);
        if(playerMotion && playerMotion.position.x + playerMotion.body.GetPosition().x * 31 > gameViewSize.width/2){
          //console.log(playerMotion.body.GetPosition().x);
          if(playerMotion.body.GetPosition().x < this.endLimit) {
              this.setPositionX(-(playerMotion.position.x + playerMotion.body.GetPosition().x * 31 - (gameViewSize.width/2)));
          }
        }
  }

    /*
    onAccelerometer:function (accelerationValue) {
        cc.log("接收到了重力感应的数值",accelerationValue);
    },
    */

});
