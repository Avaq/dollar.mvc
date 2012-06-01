;(function(window, _, $, undefined){
  
  var Class = $.mvc.Class = function(){
    
    //Define a class-factory and an actual class for this "class".
    var ClassFactory = {}
      , noop = function(){}
      , Class = noop;
      
    //Extend the factory with function that can extend the class.
    _(ClassFactory).extend({
      
      //Set a parent class.
      extends: function(parent){
        
        //Add the statics of our parent to our statics.
        Class.__proto__ = parent;
        
        //Add the prototype of our parent to our own prototype.
        Class.prototype.__proto__ = parent.prototype;
        
        //If we haven't defined our own constructor, use a function that will call the parent.
        if(Class == noop){
          this.construct(function(){
            parent.apply(this, arguments);
          });
        }
        
        //Keep an easy reference to parent.
        Class.prototype.parent = parent;
        
        //Enable chaining.
        return this;
        
      },
      
      //Add static members to the class.
      statics: function(map){
        
        //Add the members in the map to the Class object.
        _(Class).extend(map);
        
        //Enable chaining.
        return this;
        
      },
      
      //Change the constructor (default is a noop).
      construct: function(constructor){
        
        //Remember the old class properties.
        var oldMembers = Class.prototype || {};
        var oldStatics = _({}).extend(Class);
        
        //Set the new constructor.
        Class = constructor;
        Class.prototype = oldMembers;
        _(Class).extend(oldStatics);
        
        //Add a reference to the classes static members from within the classes normal members.
        _(Class.prototype).extend({
          static: Class
        });
        
        //Enable chaining.
        return this;
        
      },
      
      //Add normal members to the class.
      members: function(map){
        
        //Add the members in the map to the Class's prototype.
        _(Class.prototype).extend(map);
        
        //Enable chaining.
        return this;
        
      },
      
      //Returns the class.
      finalize: function(){
        return Class;
      }
      
    });
    
    //Add a default noop constructor.
    ClassFactory.construct(noop);
    
    //Return the class-factory.
    return ClassFactory;
    
  }
  
})(window, _, (jQuery || Zepto || $ || ($={})));
