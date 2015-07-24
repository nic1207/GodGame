/*
 * 遊戲商店介面
 */
var MENUITEM_PARENT_TAG = 0;
var MENUITEM_ITEM1_TAG = 1;
var MENUITEM_ITEM2_TAG = 2;
var MENUITEM_ITEM3_TAG = 3;
var MENUITEM_ITEM4_TAG = 4;
var MENUITEM_ITEM5_TAG = 5;
var MENUITEM_ITEM6_TAG = 6;
var MENUITEM_ITEM7_TAG = 7;
var MENUITEM_ITEM8_TAG = 8;

var GameShopLayer = cc.Layer.extend({
  
  ctor: function() {
    this._super();
    this.init();
    this.initMenu();
  },
  
  init: function() {
    cc.log("GameShopLayer.init()");
    this._super(cc.c4b(0, 0, 0, 200));
    this.setTouchEnabled(true);

    var size = cc.Director.getInstance().getWinSize();
    var centerPos = cc.p(size.width / 2, size.height / 2);
    var testSprite = cc.Sprite.create("res/images/shop/bg-shop.png");
  //background
      testSprite.setPosition(centerPos);
      testSprite.setScale(0.5);
      this.addChild(testSprite, 1);

  //buttons
    var menuItemResume = cc.MenuItemSprite.create(cc.Sprite.create(s_MenuResume),
      cc.Sprite.create(s_MenuResume), this.onResume, this);
      menuItemResume.setScale(0.5);
    var menuItemExit = cc.MenuItemSprite.create(cc.Sprite.create(s_MenuLeave), 
      cc.Sprite.create(s_MenuLeave), this.onLeave, this);
      menuItemExit.setScale(0.5);
    var menu = cc.Menu.create(menuItemResume,menuItemExit);
      menu.setPosition(65,300);
      menu.alignItemsHorizontallyWithPadding(15);
      this.addChild(menu,1000,100);
      cc.registerTargetedDelegate(-65, true, this);

  //tabs
    var menuItemFood = cc.MenuItemSprite.create(cc.Sprite.create(s_MenuFood),
      cc.Sprite.create(s_MenuFood), this.onFood, this);
      menuItemFood.setScale(0.5);
    var menuItemChar = cc.MenuItemSprite.create(cc.Sprite.create(s_MenuChar), 
      cc.Sprite.create(s_MenuChar), this.onChar, this);
      menuItemChar.setScale(0.5);
    var bar = cc.Menu.create(menuItemFood,menuItemChar);
      bar.setPosition(125,265);
      bar.alignItemsHorizontallyWithPadding(15,10);
      this.addChild(bar,1000,100);
      cc.registerTargetedDelegate(-65, true, this);
    //return true;
  },
 
  initMenu: function() {

    var item1 = cc.MenuItemFont.create("item1", null, this);
    var item2 = cc.MenuItemFont.create("item2", null, this);
    var item3 = cc.MenuItemFont.create("item3", null, this);
    var item4 = cc.MenuItemFont.create("item4", null, this);
    var item5 = cc.MenuItemFont.create("item5", null, this);
    var item6 = cc.MenuItemFont.create("item6", null, this);
    var item7 = cc.MenuItemFont.create("item7", null, this);
    var item8 = cc.MenuItemFont.create("item8", null, this);

    var charItems = new Array();
    var maxc = 6;
    var sbg = cc.Sprite.create(s_levelBG);

    for(var i=0;i<maxc;i++) {
      charItems[i] = cc.MenuItemSprite.create(sbg, null, null, this);
      charItems[i].id = (i+1);
      charItems[i] = cc.MenuItemFont.create((charItems+i), null, this);

      if(i>=4)
        charItems[i].setPosition(i*-100+700,Math.floor(i/4)*-100+200);
      else
        charItems[i].setPosition(i*100-200,0+200);
        charItems[i].setAnchorPoint(0.5,0.5);
    }

    
    //Items List
    //var cardSprite = cc.Sprite.create("res/images/shop/item-card.png");
    item1.setTag(MENUITEM_ITEM1_TAG);
    item2.setTag(MENUITEM_ITEM2_TAG);
    item3.setTag(MENUITEM_ITEM3_TAG);
    item4.setTag(MENUITEM_ITEM4_TAG);
    item5.setTag(MENUITEM_ITEM5_TAG);
    item6.setTag(MENUITEM_ITEM6_TAG);
    item7.setTag(MENUITEM_ITEM7_TAG);
    item8.setTag(MENUITEM_ITEM8_TAG);

    var size = cc.Director.getInstance().getWinSize();
    var menuPosition = cc.p(size.width/4+120, 150);

    this.menu = cc.Menu.create(item1, item2, item3, item4, item5, item6, item7, item8);
    this.menu.alignItemsInColumns(4 , 4) ;
    this.menu.setPosition(menuPosition);

    this.addChild(this.menu, 20, MENUITEM_PARENT_TAG);
    //this._selectedMenuTag = -1;
  },

  //各按鈕的function
  onResume: function() {
    cc.Director.getInstance().resume();
    cc.unregisterTouchDelegate(this);
    this.removeFromParent();
  },
  onLeave: function() {
    cc.Director.getInstance().resume();
    cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, new GameMenuScene()));
  },
  onFood: function() {
    cc.Director.getInstance().resume();
    cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, new GameMenuScene()));
  },
  onChar: function() {
    cc.Director.getInstance().resume();
    cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, new GameMenuScene()));
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
  //onTouchesCancelled:function (touches, event) {
  //}
});