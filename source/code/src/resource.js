var s_HelloWorld = "res/HelloWorld.png";
var s_CloseNormal = "res/CloseNormal.png";
var s_CloseSelected = "res/CloseSelected.png";

//var s_TestPlayer = "res/images/test-player.png";
//var s_TestPlayerBlock = "res/images/player-block.png";
//var s_PlayerSheet = "res/images/car-sheet.png";
//var s_CarRight = "res/images/koalio_stand.png";
//var s_CarLeft = "res/images/koalio_stand.png";
//var s_CarUp = "res/images/car-up.png";
//var s_CarDown = "res/images/car-down.png";

//var s_GreenCarRight = "res/images/entities/green-car-right.png";
//var s_GreenCarLeft = "res/images/entities/green-car-left.png";
//var s_GreenCarUp = "res/images/entities/green-car-up.png";
//var s_GreenCarDown = "res/images/entities/green-car-down.png";

var s_MenuBG = "res/images/menu/bg-main.png";
var s_MenuPlay = "res/images/menu/menuPlay.png";
var s_MenuAbout = "res/images/menu/menuAbout.png";
//var s_MenuPlay = "res/images/menu/play.png";
// var s_MenuAbout = "res/images/menu/about.png";
var s_MenuInstructions = "res/images/menu/instructions.png";
var s_MenuSite = "res/images/menu/site.png";
var s_MenuTitle = "res/images/menu/title.png";
var s_AboutBG = "res/tilemaps/helloBG.png";
var s_OverBG = "res/images/menu/bg-game_over.png";
var s_PassedBG = "res/images/menu/bg-game_pass.png";
var s_STAR = "res/images/menu/STAR.png";
var s_BgLevel1 = "res/tilemaps/bglevel1.png";

var s_TestTilesheet2 = "res/tilemaps/fixed-ortho-test2.png";

// for menu Button
var s_nextBtn     = "res/images/menu/next.png";
var s_mainmenuBtn = "res/images/menu/mainmenu.png";
var s_replayBtn   = "res/images/menu/replay.png";
var s_levelmapBtn = "res/images/menu/levelmap.png";
var s_storeBtn    = "res/images/menu/store.png";

// for buttons L,R,A,B
var s_MenuL = "res/images/menu/btnLeft.png";
var s_MenuR = "res/images/menu/btnRight.png";
var s_MenuA = "res/images/menu/btnA.png";
var s_MenuB = "res/images/menu/btnB.png";
var s_SelectBG = "res/images/menu/level_select.png";
var s_levelBG = "res/images/menu/level_locked.png";

var s_MenuExit = "res/images/menu/exit.png";
var s_MenuPause = "res/images/menu/pause.png";
var s_MenuShop = "res/images/menu/shop.png";
var s_MenuResume = "res/images/menu/resume.png";
var s_MenuLeave = "res/images/menu/leave.png";
var s_MenuFood = "res/images/menu/foodTab.png";
var s_MenuChar = "res/images/menu/charTab.png";
var s_DollarSign = "res/images/dollor-sign.png";

var s_coinMP3 = "res/sounds/coin.mp3";
var s_coinOGG = "res/sounds/coin.ogg";
var s_btnSwitchWAV = "res/sounds/btnSwitch.wav";
var s_changeSceneMP3 = "res/sounds/changeScene.mp3";
var s_jumpMP3 = "res/sounds/jump.mp3";
var s_hitMP3 = "res/sounds/hit.mp3" ;
var s_hitOGG = "res/sounds/hit.ogg" ;
var s_passed = "res/sounds/passed.mp3" ;
var s_dieSound = "res/sounds/die.mp3" ;
var s_hugeSound = "res/sounds/huge.mp3" ;
var s_superSound = "res/sounds/super.mp3" ;

var s_musicMenu = "res/sounds/game_menu.mp3";
var s_musicFailed = "res/sounds/game_over.mp3";
var s_musicPassed = "res/sounds/game_pass.mp3";
var s_musicLV1 = "res/sounds/game_level1.ogg";

//Player圖檔
var s_PlayerMotion = "res/images/character/toast.png";
var s_PlayerPlist = "res/images/character/toast.plist";

//NPC圖檔
var s_MonsterMotion = "res/images/character/ant.png";
var s_MonsterPlist = "res/images/character/ant.plist";

//BOSS圖檔
var s_BossMonsterMotion = "res/images/character/boss.png";
var s_BossMonsterPlist = "res/images/character/boss.plist";

//商店圖檔
var s_ShopBg = "res/images/shop/bg-shop.jpg";

//道具圖檔
var s_ChocoSauce = "res/images/items/choco_sauce.png";
var s_Butter = "res/images/items/butter.png";
var s_Corn = "res/images/items/corn.png";
var s_FlourBag = "res/images/items/flour_bag.png";

var s_ABCAlphabet = "res/images/items/ABC.png";
var s_ABCAlphabetPlist = "res/images/items/ABC.plist";

//視效圖檔
var s_ChocoBullet = "res/images/effect/choco_bullet.png";
var s_CornBullet = "res/images/effect/corn_bullet.png";
var s_eBullet = "res/images/effect/e_bullet.png";

var g_resources = [
    //image
    {type:"image", src:s_HelloWorld},
    {type:"image", src:s_CloseNormal},
    {type:"image", src:s_CloseSelected},
    //{type:"image", src:s_TestPlayer},
    //{type:"image", src:s_TestPlayerBlock},
    {type:"image", src:s_PlayerMotion},
    {type:"image", src:s_MonsterMotion},
    {type:"image", src:s_BossMonsterMotion},
    {type:"image", src:s_TestTilesheet2},
    {type:"image", src:s_MenuBG},
    {type:"image", src:s_MenuPlay},
    {type:"image", src:s_MenuInstructions},
    {type:"image", src:s_MenuAbout},
    {type:"image", src:s_MenuSite},
    {type:"image", src:s_MenuTitle},
    {type:"image", src:s_BgLevel1},
    {type:"image", src:s_MenuL},
    {type:"image", src:s_MenuR},
    {type:"image", src:s_MenuA},
    {type:"image", src:s_MenuB},
    {type:"image", src:s_nextBtn},
    {type:"image", src:s_mainmenuBtn},
    {type:"image", src:s_replayBtn},
    {type:"image", src:s_levelmapBtn},
    {type:"image", src:s_storeBtn},
    {type:"image", src:s_SelectBG},
    {type:"image", src:s_DollarSign},
    {type:"image", src:s_MenuExit},
    {type:"image", src:s_MenuPause},
    {type:"image", src:s_MenuLeave},
    {type:"image", src:s_MenuResume},
    {type:"image", src:s_MenuChar},
    {type:"image", src:s_MenuFood},
    {type:"image", src:s_MenuShop},
    {type:"image", src:s_AboutBG},
    {type:"image", src:s_ChocoSauce},
    {type:"image", src:s_Butter},
    {type:"image", src:s_Corn},
    {type:"image", src:s_FlourBag},
    {type:"image", src:s_ABCAlphabet},
    {type:"image", src:s_ShopBg},

    //sound
    {type:"sound", src:s_coinMP3},
    {type:"sound", src:s_coinOGG},
    {type:"sound", src:s_btnSwitchWAV},
    {type:"sound", src:s_changeSceneMP3},
    {type:"sound", src:s_jumpMP3},
    {type:"sound", src:s_hitMP3},
    {type:"sound", src:s_hitOGG},

    {type:"sound", src:s_musicMenu},

    //plist
    {type:"plist", src:s_PlayerPlist},
    {type:"plist", src:s_MonsterPlist},
    {type:"plist", src:s_BossMonsterPlist},
    {type:"plist", src:s_ABCAlphabetPlist},

    //fnt
    {fontName:"Oblivious font",src:[{src:"res/fonts/Oblivious font.ttf",type:"truetype"}]},
    {fontName:"DejaVuSansMono", src:[{src:"res/fonts/DejaVuSansMono.ttf", type:"truetype"}]},
    {fontName:"Comica BD",src:[{src:"res/fonts/ComicaBD-Bold.ttf",type:"truetype"}]},

    //tmx
    {type:"tmx", src:"res/tilemaps/nic1.tmx"},
    {type:"tmx", src:"res/tilemaps/nic2.tmx"},
    {type:"tmx", src:"res/tilemaps/nic3.tmx"},
    {type:"tmx", src:"res/tilemaps/nic4.tmx"},
    {type:"tmx", src:"res/tilemaps/nic5.tmx"},
    {type:"tmx", src:"res/tilemaps/nic6.tmx"},
    {type:"tmx", src:"res/tilemaps/nic7.tmx"},
    {type:"tmx", src:"res/tilemaps/nic8.tmx"},

    //bgm

    //effect
    {type:"image", src:s_ChocoBullet},
    {type:"image", src:s_CornBullet},
    {type:"image", src:s_eBullet}

];
