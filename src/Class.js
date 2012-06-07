;(function(root, _, undefined){
  
  //Define the ClassFactory.
  var ClassFactory = $.mvc.ClassFactory = function(Class){
    this.Class = this.noop = Class;
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
      if(this.Class == this.noop){
        this.construct(function(){
          parent.apply(this, arguments);
        });
      }
      
      //Enable chaining.
      return this;
      
    },
    
    //Add static members to the class.
    statics: function(map){
      
      //Add the members in the map to the Class object.
      _(this.Class).extend(map);
      
      //Enable chaining.
      return this;
      
    },
    
    //Change the constructor (default is a noop).
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
      
      //Add the members in the map to the Class' prototype.
      _(this.Class.prototype).extend(map);
      
      //Enable chaining.
      return this;
      
    },
    
    //Returns the class.
    finalize: function(){
      return this.Class;
    }
    
  });

  var Class = $.mvc.Class = function(){
    
    //Define the class and its factory.
    var noop = function(){}
      , Class = noop
      , factory = new ClassFactory(Class);
      
    //Add a default noop constructor.
    factory.construct(noop);
    
    //Return the class-factory.
    return factory;
    
  }
  
})(this, _);
