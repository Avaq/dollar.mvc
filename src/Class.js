;(function(root, _, $, undefined){
  
  /**
  * HELPERS
  */
  
  //Iterates over [events], calling each function with [context] and [arguments].
  function callEvents(events, context, arguments){
    
    for(var i = 0; i < events.length; i++){
      events[i].apply(context, arguments);
    }
    
  }
  
  
  /**
  * CLASS FACTORY
  */
  
  //Define the ClassFactory.
  var ClassFactory = $.mvc.ClassFactory = function(constructor){
    
    //Create 2 references to the given no-op function.
    this.Class = this.constructor = constructor;
    
    //Add the common class methods to the class.
    this.Class.__proto__ = Class;
    this.Class.prototype.__proto__ = Class.prototype;
    
    //Add containers for events.
    this.onInstantiation = [];
    this.onCreation = [];
    this.onExtension = [];
    
    //Add a method to access the factory.
    var factory = this;
    this.Class._getFactory = function(){
      return factory;
    }
    
  }
  
  //Extend the factory with functions that can extend the class.
  _(ClassFactory.prototype).extend({
    
    //Set a parent class.
    extends: function(parent){
      
      //Add the statics of our parent to our statics.
      this.Class.__proto__ = this.Class.parent = parent;
      
      //Add the prototype of our parent to our own prototype.
      this.Class.prototype.__proto__ = this.Class.prototype.parent = parent.prototype;
      
      //If we haven't defined our own constructor, use a function that will call the parent.
      if(this.Class == this.constructor){
        this.construct(function(){
          parent.apply(this, arguments);
        });
      }
      
      //Call the extension events for the extended class.
      callEvents(parent._getFactory().onExtension, this.Class, [parent]);
      
      //Enable chaining.
      return this;
      
    },
    
    //Add static members to the class.
    statics: function(map){
      
      //Keep a reference to this.
      var Factory = this;
      
      //Add the members in the map to the Class object.
      _(map).each(function(member, key){
        
        //Check if we need to set unwrappers.
        if(_(Property).contains(member)){
          
          //Create the unwrapper.
          var onCreate = function(){
            this[key] = member();
          };
          
          //Use the unwrapper when the class gets finalized.
          Factory.onCreate(onCreate);
          
          //Add the unwrapper to subclasses when they are created.
          Factory.onExtend(function onExtend(){
            this.onCreate(onCreate);
            this.onExtend(onExtend)
          });
          
        }
        
        //Otherwise simply set the member.
        else{
          Factory.Class[key] = member;
        }
        
      });
      
      //Enable chaining.
      return this;
      
    },
    
    //Change the constructor (default is a no-op).
    construct: function(constructor){
      
      //Remember the old class properties.
      var oldMembers = this.Class.prototype || {};
      var oldStatics = _({}).extend(this.Class);
      
      //Set the new constructor.
      this.Class = constructor;
      this.Class.prototype = oldMembers;
      _(this.Class).extend(oldStatics);
      
      //Add a reference to the class' static members from within the class' normal members.
      this.Class.prototype.static = constructor;
      
      //Enable chaining.
      return this;
      
    },
    
    //Add normal members to the class.
    members: function(map){
      
      //Keep a reference to this.
      var Factory = this;
      
      //Add the members in the map to the Class object.
      _(map).each(function(member, key){
        
        //Check if we need to set unwrappers.
        if(_(Property).contains(member)){
          
          //Create the unwrapper.
          var onCreate = function(){
              this.prototype[key] = member();
            }
            , onInstantiate = function(instance){
              instance[key] = member();
            }
          
          //Use an unwrapper when the class gets finalized.
          Factory.onCreate(onCreate);
          
          //Use the other unwrapper when the class gets instantiated.
          Factory.onInstantiate(onInstantiate);
          
          //Add the unwrappers to subclasses when they are created.
          Factory.onExtend(function onExtend(){
            this.onCreate(onCreate);
            this.onInstantiate(onInstantiate);
            this.onExtend(onExtend);
          });
          
        }
        
        //Otherwise simply set the member.
        else{
          Factory.Class.prototype[key] = member;
        }
        
      });
            
      //Enable chaining.
      return this;
      
    },
    
    //Bind an instantiation event.
    onInstantiate: function(callback){
      
      this.onInstantiation.push(callback);
      
      return this;
      
    },
    
    //Bind a creation event.
    onCreate: function(callback){
      
      this.onCreation.push(callback);
      
      return this;
      
    },
    
    //Bind an extension event.
    onExtend: function(callback){
      
      this.onExtension.push(callback);
      
      return this;
      
    },
    
    //Returns the class.
    finalize: function(){
      
      //Call the creation events.
      callEvents(this.onCreation, this.Class, []);
      
      //Return the class.
      return this.Class;
      
    }
    
  });
  
  
  /**
  * CLASS
  */
  
  //Define the Class function. This creates classes.
  var Class = $.mvc.Class = function(){
    
    //Define the class and its factory.
    var constructor = function(){
        this.init();
      }
      , Class = constructor
      , factory = new ClassFactory(Class);
      
    //Add a default constructor.
    factory.construct(constructor);
    
    //Return the class-factory.
    return factory;
    
  }
  
  //Define the common interface for all classes.
  _(Class).extend({
    
  });
  
  //Define the common interface for all instances of classes.
  _(Class.prototype).extend({
    
    //This function calls the instantiation events.
    init: function()
    {
      
      //Call the instantiation events.
      callEvents(this.static._getFactory().onInstantiation, this.static, [this]);
      
      //Enable chaining.
      return this;
      
    }
    
  });
  
  
  /**
  * CLASS PROPERTY
  */
  
  var Property = $.mvc.Property = {
    array: function(){return []},
    object: function(){return {}}
  }
  
})(this, _, $);
