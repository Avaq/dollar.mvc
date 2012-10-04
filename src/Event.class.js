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
    
    stopPropagation: function(){
      this.stopped = 2;
    },
    
    stopImmediatePropagation: function(){
      this.stopped = 3;
    }
    
  })
  
  //Finalize.
  .finalize();
  
})(this, _, $);
