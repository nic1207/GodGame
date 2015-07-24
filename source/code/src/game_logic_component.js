// The generic logic component
var GameLogicComponent = cc.Class.extend({

	ctor:function () {
    	cc.log("GameLogicComponent ctor()");
    	this.globalMediator = null;
    },
    
    setGlobalMediator:function(mediator){
	  	cc.log("GameLogicComponent setGlobalMediator()");
	  	
	  	if(mediator){
		  	this.globalmediator = mediator;
	  	}  
    },
        
    update:function (){
	    
	    
    }

});