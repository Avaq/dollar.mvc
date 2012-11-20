;(function(root, _, $, undefined){
  
  //Define the MixinFactory.
  var MixinFactory = $.mvc.MixinFactory = function(mixin){
    this.Mixin = mixin;
  }
  
  //Define the Mixin prototype.
  var Mixin = function(){
    this.mixins = [];
    this.statics = {};
    this.members = {};
    this.classEvents = {
      create: [],
      instantiate: [],
      extend: []
    };
  };
  
  //Extend the factory with methods that build the mixin.
  _(MixinFactory.prototype).extend({
    
    //Add "sub"-mixins.
    use: function(mixin){
      
      if(!(mixin instanceof Mixin)){
        throw "Can only use Mixins.";
      }
      
      this.Mixin.mixins.push(mixin);
      return this;
      
    },
    
    //Add static members.
    statics: function(map){
      _(this.Mixin.statics).extend(map);
      return this;
    },
    
    //Add normal members.
    members: function(map){
      _(this.Mixin.members).extend(map);
      return this;
    },
    
    //Bind an instantiation event.
    onInstantiate: function(callback){
      
      this.Mixin.classEvents.instantiate.push(callback);
      
      return this;
      
    },
    
    //Bind a creation event.
    onCreate: function(callback){
      
      this.Mixin.classEvents.create.push(callback);
      
      return this;
      
    },
    
    //Bind an extension event.
    onExtend: function(callback){
      
      this.Mixin.classEvents.extend.push(callback);
      
      return this;
      
    },
    
    //Return the mixin.
    finalize: function(){
      return this.Mixin;
    }
    
  });
  
  //Define the mixin creating function.
  $.mvc.Mixin = function(){
    
    //Create the mixin and its factory.
    var mixin = new Mixin
      , factory = new MixinFactory(mixin);
    
    //Return the factory.
    return factory;
    
  }
  
  //Extend the ClassFactory with mixin-including functionality.
  _($.mvc.ClassFactory.prototype).extend({
    
    //Mix in a mixin.
    use: function(mixin){
      
      //We require a real mixin.
      if(!(mixin instanceof Mixin)){
        throw "Can only use Mixins.";
      }
      
      //Add the sub-mixins first. Because we will overwrite their members.
      for(var i = 0; i < mixin.mixins.length; i++){
        this.use(mixin.mixins[i]);
      }
      
      //Add static members.
      this.statics(mixin.statics);
      
      //Add normal members.
      this.members(mixin.members);
      
      //Add class events.
      this.onCreation = this.onCreation.concat(mixin.classEvents.create);
      this.onInstantiation = this.onInstantiation.concat(mixin.classEvents.instantiate);
      this.onExtension = this.onExtension.concat(mixin.classEvents.extend);
      
      //Enable chaining.
      return this;
      
    }
    
  });
  
})(this, _, $);
