/*
 * GameAbcItemManager.js
 */
//===========================================================================================
var GameAbcItemManager = cc.Class.extend({
  ctor: function(config,typeArray,posArray,tilpPosArray,layer) {
    cc.log("GameAbcItemManager ctor()");
    //this._super();
    this.gameConfig = config;
    this.typeArray = typeArray;
    this.posArray = posArray;
    this.tilpPosArray = tilpPosArray;
    this.sprite = new Array();
    this.layer = layer;
    this.init();
    return this;
  },
//===========================================================================================
  init: function() {
    var spriteFrameCache = cc.SpriteFrameCache.getInstance(); //使用精灵帧缓存，方便后面多次使用
    var frameCache = spriteFrameCache.addSpriteFrames(s_ABCAlphabetPlist, s_ABCAlphabet); //第一个参数plist文件，第二个参数plist对应的png图片  

    //建立所有的英文字母
    for(var i = 0 ; i < this.typeArray.length ; i++) {
      var position = cc.p(this.posArray[i].x, this.posArray[i].y);
      var str = this.typeArray[i] + ".png";
      this.sprite[i] = cc.Sprite.createWithSpriteFrame(spriteFrameCache.getSpriteFrame(str));
      this.sprite[i].setPosition(position); 
      this.sprite[i].setAnchorPoint(0.5, 0.5);
      this.sprite[i].setScale(this.gameConfig.abcItems.abclevel1.textureSize);
      var blink = cc.RepeatForever.create(cc.Blink.create(2, 4));
      this.sprite[i].runAction(blink);
      this.layer.addChild(this.sprite[i],this.gameConfig.globals.TAG_ABC_ITEMS);
    }
  },
//===========================================================================================   
  update:function() {

  }
//===========================================================================================
});