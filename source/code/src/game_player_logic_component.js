// The player's logic. Update every frame to see what the player should do based on state of itself and other things like touch
var GamePlayerLogicComponent = GameLogicComponent.extend({

  ctor:function () {
	  this._super();
    cc.log("GamePlayerLogicComponent ctor()");
  },
  
  changeDirection:function(state, inputDirection){
    //console.log(state);
    if(inputDirection || inputDirection == null){
      state.movementDirection = inputDirection;
      state.updateAnimation = true;
    }
  },
  
  update:function() {
    this._super();
  }
});