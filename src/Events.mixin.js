;(function(root, _, $, undefined){
  
  //Expression to split different events in an eventString.
  var eventSplitter = /[ \t]*,?[ \t]+/
  
    //Expression to split name-spaces.
    , partSplitter = /:/
    
    //The event object.
    , Event = function(){
      this.time = Date.now();
      this.returnValue = null;
    };
    
  //Create the Event object prototype.
  _(Event.prototype).extend({
    
  });
  
  //These functions will be added to both the static members and the normal members of the mixin.
  var events = {
    
    //Keeps track of added listeners.
    _eventListeners: {},
    
    //Allows us to add listeners with this as an instance.
    on: function(){
      
    },
    
    //Trigger an event, calling all needed listener-callbacks. Return the Event object.
    trigger: function(eventString){
      
      //Create the event object.
      var e = new Event;
      
      //Gather all events we want to trigger.
      var events = eventString.split(eventSplitter);
      
      //Iterate over them.
      for(var i = 0; i < events.length; i++){
        
        //Gather the event and it's sub events.
        var parts = events[i].split(partSplitter);
        
        //Iterate over them in reversed order.
        for(var j = parts.length; j > 0; j--){
          
          //Get the key.
          var key = parts.slice(0, j).join(':');
          
          //Find listeners.
          var listeners = this._eventListeners[key] || [];
          
          //Fire callbacks.
          for(var n = 0; n < listeners.length; n++){
            
            e.returnValue = listeners[n].call(this);
            
            if(e.stopped()){
              break;
            }
            
          }
          
        }
        
      }
      
    }
    
  }
  
  //Our events mixin.
  $.mvc.Events = $.mvc.Mixin()
  
  .statics(events)
  .members(events)
  
  //Add normal members.
  .members({
    
    //Delegate triggers to the static context.
    trigger: function(){
      
      var e = events.trigger.apply(this, arguments);
      
      if(!e.stoppedDelegation){
        e.instance = this;
        events.trigger.apply(this.static, arguments)
      }
      
      return e;
      
    }
    
  })
  
  //Finalize.
  .finalize();

})(this, _, $);
