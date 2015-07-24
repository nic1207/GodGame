// The basic physics stuff you need besides position, which is handled by each Entity->CCSprite
var GamePhysicsComponent = cc.Class.extend({

	ctor:function () {
    	this.velocity = new cc.p(0,0);
    	this.position = new cc.p(0,0);
    	this.hitbox = null;
    	this.mass = 0;
    	this.globalMediator = null;
    	this.gameConfig = new GameConfig();
    	this.baseSpeed = 0;
    	this.maxVelocity = 0;
    	
    },
     
    setGlobalMediator:function(mediator){
	  	if(mediator){
		  	this.globalmediator = mediator;
	  	}  
    },
    
    setVelocity:function (velocity){
	    if(velocity){
		    this.velocity.x = velocity.x;
		    this.velocity.y = velocity.y;
	    }else{
		    cc.log("GamePhyicsComponent setVelocity() velocity is null");
	    }
    },
    
    setPosition:function(position){
    //console.log(position);
	  if(position){
		  this.position.x = position.x;
		  this.position.y = position.y;
	  }  
    },
    
    
    setHitbox:function (hitbox){
	    if(hitbox){
		    this.hitbox = hitbox;
	    }else{
		    cc.log("GamePhyicsComponent setHitbox() velocity is null");		    
	    }
    },
    
     setBaseSpeed:function (baseSpeed){
	    if(baseSpeed){
		    this.baseSpeed = baseSpeed;
	    }else{
		    cc.log("GamePhyicsComponent setBaseSpeed() baseSpeed is null");		    
	    }
    },
    
    setBaseAccelleration:function (baseAccelleration){
	  	if(baseAccelleration){
		  	this.baseAccelleration = baseAccelleration;
	  	}  else{
		  	cc.log("GamePhysicsComponent setBaseAccelleration() baseAccellleration == null.");
	  	}
	    
    },
    
    setMaxVelocity:function (maxVelocity){
	  	if(maxVelocity){
		  	this.maxVelocity = maxVelocity;
	  	}  else{
		  	cc.log("GamePhysicsComponent setMaxVelocity() maxVelocity == null.");
	  	}
	    
    },
    
    // returns the corners of the hitbox in order: BL, BR, TR, TL. 
    getHitboxVertices:function(){
	    //console.log(this.hitbox);
	    var xx = cc.rectGetMinX(this.hitbox);
	    var vertices = [
	    
	      cc.p(cc.rectGetMinX(this.hitbox), cc.rectGetMinY(this.hitbox)), 
	      cc.p(cc.rectGetMaxX(this.hitbox), cc.rectGetMinY(this.hitbox)), 
	      cc.p(cc.rectGetMaxX(this.hitbox), cc.rectGetMaxY(this.hitbox)), 
	      cc.p(cc.rectGetMinX(this.hitbox), cc.rectGetMaxY(this.hitbox))
	    ];
	    
	    
	    return vertices;
	    
    },
    
    drawHitbox:function (){
	    
	    
    },
    
    checkForegroundLeft:function(position, caller, map, hitboxVertices){
	    //console.log(map);
	     var pp = cc.p(position.x + hitboxVertices[0].x, position.y + hitboxVertices[0].y);
	     var ForegroundProperties = map.getPointProperties("foreground", pp);
	     //console.log("11111111111111111",ForegroundProperties);
	    /*
	    var bottomLeft = cc.p(position.x + hitboxVertices[0].x, position.y + hitboxVertices[0].y + 1);
	    var topLeft = cc.p(position.x + hitboxVertices[3].x, position.y + hitboxVertices[3].y - 1);
	    var blForegroundProperties = map.getPointProperties("foreground", bottomLeft);
	    console.log("11111111111111111",blForegroundProperties);
	    if(blForegroundProperties){
	      console.log("!!!!!!!!!!!!!",blForegroundProperties);
		    if(blForegroundProperties.name == "grass" || blForegroundProperties.name == "house"){
			     while(map.getPointProperties("foreground", bottomLeft).name == "grass" || map.getPointProperties("foreground", bottomLeft).name == "house"){
				     position.x += .1;
				     bottomLeft = cc.p(position.x + hitboxVertices[0].x, position.y + hitboxVertices[0].y + 1);
			     }
			     position.x = Math.floor(position.x);
			     this.velocity.x = 0;
		    }
	    }
	    
	    var tlForegroundProperties = map.getPointProperties("foreground", topLeft);
	    console.log("222222222222222222",tlForegroundProperties);
	    if(tlForegroundProperties){
		    if(tlForegroundProperties.name == "grass" || tlForegroundProperties.name == "house"){
			     while(map.getPointProperties("foreground", topLeft).name == "grass" || map.getPointProperties("foreground", topLeft).name == "house"){
				     position.x += .1;
				     topLeft = cc.p(position.x + hitboxVertices[3].x, position.y + hitboxVertices[3].y - 1);
			     }
			     position.x = Math.floor(position.x);
			     this.velocity.x = 0;
		    }
	    }
	    */
	    return position.x;
    },
    
    checkForegroundRight:function(position, caller, map, hitboxVertices){
	    /*
	    var bottomRight = cc.p(position.x + hitboxVertices[1].x, position.y + hitboxVertices[1].y + 1);
	    var topRight = cc.p(position.x + hitboxVertices[2].x, position.y + hitboxVertices[2].y - 1);
	    
	    var brForegroundProperties = map.getPointProperties("foreground", bottomRight);
	    if(brForegroundProperties){
		    if(brForegroundProperties.name == "grass" || brForegroundProperties.name == "house"){
			     while(map.getPointProperties("foreground", bottomRight).name == "grass" || map.getPointProperties("foreground", bottomRight).name == "house"){
				     position.x -= .1;
				     bottomRight = cc.p(position.x + hitboxVertices[1].x, position.y + hitboxVertices[1].y + 1);
			     }
			     position.x = Math.ceil(position.x);
			     this.velocity.x = 0;
		    }
		    
	    }
	    
	    var trForegroundProperties = map.getPointProperties("foreground", topRight);
	    if(trForegroundProperties){
		    if(trForegroundProperties.name == "grass" || trForegroundProperties.name == "house"){
			     while(map.getPointProperties("foreground", topRight).name == "grass" || map.getPointProperties("foreground", topRight).name == "house"){
				     position.x -= .1;
				     topRight = cc.p(position.x + hitboxVertices[2].x, position.y + hitboxVertices[2].y - 1);
			     }
			     position.x = Math.ceil(position.x);
			     this.velocity.x = 0;
		    }
	    }
	    return position.x;
	    */
    },
    
    checkForegroundTop:function(position, caller, map, hitboxVertices){
	    /*
	    var topRight = cc.p(position.x + hitboxVertices[2].x - 1, position.y + hitboxVertices[2].y);
	    var topLeft = cc.p(position.x + hitboxVertices[3].x + 1, position.y + hitboxVertices[3].y);
	    var trForegroundProperties = map.getPointProperties("foreground", topRight);
	    if(trForegroundProperties){
		    if(trForegroundProperties.name == "grass" || trForegroundProperties.name == "house"){
			     while(map.getPointProperties("foreground", topRight).name == "grass" || map.getPointProperties("foreground", topRight).name == "house"){
				     position.y -= .1;
				     topRight = cc.p(position.x + hitboxVertices[2].x - 1, position.y + hitboxVertices[2].y);
			     }
			     position.y = Math.ceil(position.y);
			     this.velocity.y = 0;
		    }
	    }
	    
	    var tlForegroundProperties = map.getPointProperties("foreground", topLeft);
	    if(tlForegroundProperties){
		    if(tlForegroundProperties.name == "grass" || tlForegroundProperties.name == "house"){
			     while(map.getPointProperties("foreground", topLeft).name == "grass" || map.getPointProperties("foreground", topLeft).name == "house"){
				     position.y -= .1;
				     topLeft = cc.p(position.x + hitboxVertices[3].x + 1, position.y + hitboxVertices[3].y);
			     }
			     position.y = Math.ceil(position.y);
			     this.velocity.y = 0;
		    }
	    }
	    return position.y;
	    */
    },
    
    checkForegroundBottom:function(position, caller, map, hitboxVertices){
	    /*
	    var bottomRight = cc.p(position.x + hitboxVertices[1].x - 1, position.y + hitboxVertices[1].y);
	    var bottomLeft = cc.p(position.x + hitboxVertices[0].x + 1, position.y + hitboxVertices[0].y);
	    
	   var brForegroundProperties = map.getPointProperties("foreground", bottomRight);
	    if(brForegroundProperties){
		    if(brForegroundProperties.name == "grass" || brForegroundProperties.name == "house"){
			     //cc.log("SCPhysicsCompnent checkForegroundBottom() BR COLLISION");
			     while(map.getPointProperties("foreground", bottomRight).name == "grass" || map.getPointProperties("foreground", bottomRight).name == "house"){
				     position.y += .1;
				     bottomRight = cc.p(position.x + hitboxVertices[1].x - 1, position.y + hitboxVertices[1].y);
			     }
			     position.y = Math.floor(position.y);
			     this.velocity.y = 0;
		    }
		    
	    }
	    
	    var blForegroundProperties = map.getPointProperties("foreground", bottomLeft);
	    if(blForegroundProperties){
		    if(blForegroundProperties.name == "grass" || blForegroundProperties.name == "house"){
			     while(map.getPointProperties("foreground", bottomLeft).name == "grass" || map.getPointProperties("foreground", bottomLeft).name == "house"){
				     position.y += .1;
				     bottomLeft = cc.p(position.x + hitboxVertices[0].x + 1, position.y + hitboxVertices[0].y);
			     }
			     position.y = Math.floor(position.y);
			     this.velocity.y = 0;
		    }
	    }
	    return position.y;
	    */
    },
    
    
    update:function(dt, caller, map, physEntities){
    	//cc.log("GamePhysicsComponent update(), entity ID = " + caller.getID());
	   	//var nextPosition = cc.p(this.position.x, this.position.y);
	   	//console.log(this.position.x);
	   	// returns array of cc.p objects in order BL, BR, TR, TL
	    var hitboxVertices = this.getHitboxVertices();
	    
	    if(caller.state.movementDirection){
		    switch(caller.state.movementDirection){
			    case "left":
			    console.log("left11111");
                //console.log(this.position.x);
                //console.log(this.position.y);
			    //caller.state.setPosition(cc.p(300, 300));

			    //this.position.x += (this.velocity.x -= this.baseAccelleration);
			    //this.velocity.y=0;
			    //console.log(this.position.x);
                //console.log(this.position.y);
			    //this.position.x = this.checkForegroundLeft(this.position, caller, map, hitboxVertices);
			    break;
			    
			    case "right":
			    console.log("right");
			    //console.log(this.position.x);
                //console.log(this.position.y);
			    //this.position.x += (this.velocity.x += this.baseAccelleration);
			    //this.velocity.y=0;
			    //console.log(this.position.x);
                //console.log(this.position.y);
			    //this.position.x = this.checkForegroundRight(this.position, caller, map, hitboxVertices);
			    break;
		      	    
			    case "jump":
			    //console.log("jump");
			    //this.position.y += (this.velocity.y += this.baseAccelleration);
			    //this.velocity.x=0;
			    //this.position.y = this.checkForegroundTop(this.position, caller, map, hitboxVertices);
			    break;
			     
			    case "hit":
			    //this.position.y += (this.velocity.y -= this.baseAccelleration);
			    //this.velocity.x=0;
			    //this.position.y = this.checkForegroundBottom(this.position, caller, map, hitboxVertices);
			    break;
			    default:
			    break;
		    }
	    }else{
	    }
	    
	    if(this.velocity.x<0){
		    //this.position.x = this.checkForegroundLeft(this.position, caller, map, hitboxVertices);
	    }
	    if(this.velocity.x>0){
		    //this.position.x = this.checkForegroundRight(this.position, caller, map, hitboxVertices);
	    }
	    if(this.velocity.y>0){
		    //this.position.y = this.checkForegroundTop(this.position, caller, map, hitboxVertices);
	    }
	    if(this.velocity.y<0){
		    //this.position.y = this.checkForegroundBottom(this.position, caller, map, hitboxVertices);
	    }
	    
	    // keep velocity within bounds
	    if(this.velocity.x > this.maxVelocity){
		    this.velocity.x = this.maxVelocity;
	    }
	    if(this.velocity.x < -this.maxVelocity){
		    this.velocity.x = -this.maxVelocity;
	    }
	    if(this.velocity.y > this.maxVelocity){
		    this.velocity.y = this.maxVelocity;
	    }
	    if(this.velocity.y < -this.maxVelocity){
		    this.velocity.y = -this.maxVelocity;
	    }
	    
	    /* causing error, not used ever that I know of
	    if((map.getPointProperties("signs", this.position)))
	    {
	    }
	    */
	 
	 
	 // do check on other entities
	 for(var i = 0; i<physEntities.length; i++){
		 if(physEntities[i].getID() != caller.getID()){
		 	cc.log("SCPhysicsComponent update() entities loop, entity that is != this found! ID = " + physEntities[i].getID());	 
		 }
	 }   
    }
    

});