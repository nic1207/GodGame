/*
 * 遊戲儲存資料
 */
var GameSave = cc.Class.extend({
  ls: null,
  obj: null,
  key: "TG_GameData",
  
  ctor: function() {
    this.doLoad();
  },
  
  createDefault: function(key) {
    var ls = sys.localStorage;
    var obj = new Object();
    obj.nowLevel = 1;//目前關卡
    obj.lockLevel = 2;//目前關卡鎖定
    obj.maxLevel = 10;//關卡上限
    obj.Scores = 0;//關卡分數
    ls.setItem(key,JSON.stringify(obj));
  },
  
  doSave: function() {
    this.save(this.obj);
  },
  doLoad: function() {
    this.obj = this.load(this.key);
  },
   
  save: function(obj) {
    var ls = sys.localStorage;
    ls.setItem(this.key,JSON.stringify(obj));
  },
  
  load: function(key) {
    var ls = sys.localStorage;
    var r = null;
    r = ls.getItem(key);
    if(!r) {
      this.createDefault(key);
      r = ls.getItem(key);
    }
    return JSON.parse(r);    
  }
});

/**
 * DesignPattern : Sington
 */
GameSave.getInstance = function() {  
  if (!this._instance) {
    this._instance = new GameSave();
  }
  //console.log(this.level,this.hp);
  return this._instance;
};
                                                                                                                           