;(function(root, _, $, undefined){
  
  //The class.
  $.mvc.Event = $.mvc.Class()
  
  //Constructor.
  .construct(function(eventString){
    this.eventString = eventString;
    this.time = Date.now();
  })
  
  //Members.
  .members({
    
    stopped: -1,
    returnValue: null,
    
    stopStaticPropagation: function(){
      this.stopped = 1;
    },
    
    stopPropagation: function(){
      this.stopped = 2;
    },
    
    stopImmediatePropagation: function(){
      this.stopped = 3;
    },
    
    isStaticPropagationStopped: function(){
      return this.stopped > 0;
    },
    
    isPropagationStopped: function(){
      return this.stopped > 1;
    },
    
    isImmediatePropagationStopped: function(){
      return this.stopped > 2;
    }
    
  })
  
  //Finalize.
  .finalize();
  
})(this, _, $);
