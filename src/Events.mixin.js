;(function(root, _, $, undefined){
  
  //Expression to split different events in an eventString.
  var eventSplitter = /[ \t]*,?[ \t]+/
  
    //Expression to split name-spaces.
    , partSplitter = /:/;
    
  //These functions will be added to both the static members and the normal members of the mixin.
  var events = {
    
    //Add the event listeners object as a property.
    _eventListeners: $.mvc.Property.object,
    
    //Allows us to add listeners.
    on: function(eventString, callback){
      
      if( ! _(callback).isFunction()){
        throw "callback must be function";
      }
      
      (this._eventListeners[eventString] || (this._eventListeners[eventString] = [])).unshift(callback);
      
      return this;
      
    },
    
    //Trigger an event, calling all needed listener-callbacks. Return the Event object.
    trigger: function(eventString, e){
      
      //Create the event object.
      var e = e || new $.mvc.Event(eventString);
      
      //Gather the event and it's sub events.
      var parts = eventString.split(partSplitter);
      
      //Iterate over them in reversed order.
      for(var j = parts.length; j > 0; j--){
        
        //Get the key.
        var key = parts.slice(0, j).join(':');
        
        //Find listeners.
        var listeners = this._eventListeners[key] || [];
        
        //Fire callbacks.
        for(var n = 0; n < listeners.length; n++){
          
          e.returnValue = listeners[n].call(this, e);
          
          if(e.stopped >= 3){
            break;
          }
          
        }
        
        if(e.stopped >= 2){
          break;
        }
        
      }
      
      return e;
      
    }
    
  };
  
  //Our events mixin.
  var Events = $.mvc.Events = $.mvc.Mixin()
  
  //Mix in the event mixin to the Events Mixin. (I know, I know..)
  .statics(events)
  
  //Twice. (Yeah yeah!)
  .members(events)
  
  //Add normal members.
  .members({
    
    //Propagate triggers to the static context.
    trigger: function(){
      
      var e = events.trigger.apply(this, arguments);
      
      if(e.stopped < 1){
        e.instance = this;
        events.trigger.call(this.static, e.eventString, e);
      }
      
      return e;
      
    }
    
  })
  
  //Finalize.
  .finalize();

})(this, _, $);
