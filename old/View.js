// injectors: listen to model events and translate to DOM
// extractors: listen to DOM events and translate to model

extractors: {
  firstname: function(el){ return el.val(); },
  is_external: function(el){ return el.is('.external'); }
}

domEvents: {
  "change on [data-has=firstname]": this.extract('firstname')
},



modelEvents: {
  "change on firstname": this.inject('firstname')
}

injectors: {
  firstname: function(el, val){ el.val(val); },
  is_external: function(el, val){ el.toggleClass('external', !!val); }
}

//   extractors: {},
//   injectors: {},

// this.dom({
//   Events: {}
// });

// this.model({
//   Events: {}
// });
