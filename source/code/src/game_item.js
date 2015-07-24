/*
 * GameNpc.js
 */
//===========================================================================================
var GameItem = cc.Sprite.extend({
  ctor: function(Config, pos, no, tagPoint, isLoadSpriteSheet, texture) {
    this._super();
    this.itemConfig = Config; 
    this.position = pos;  
    this.no = no;
    this.tag = tagPoint;
    this.init(isLoadSpriteSheet,texture);
    return this;
  },

  init: function(isLoadSpriteSheet,texture) {
    //initial item
    if(!isLoadSpriteSheet) {
      this.initWithTexture(this.itemConfig.texture, this.itemConfig.textureRect);
    }
    else {
      this.initWithTexture(texture, this.itemConfig.textureRect);   
    }
    //set Scale
    this.setScale(this.itemConfig.textureSize);
  
    //Set Position
    this.setPosition(cc.p(this.position.x, this.position.y));

    //Set Show items
    this.setShow();

    //Schedule Update
    this.scheduleUpdate();
  },

  setShow: function() {
    this.setVisible(true);
  },

  setHide: function() {
    this.setVisible(false);
  },

  destroy: function() {
    this.removeFromParent();
  },

  update:function() {

    
  }

});