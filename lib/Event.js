var module;

function Event(onCreation){
  var event = this;

  this.onStart_Listeners = [];
  this.onEnd_Listeners = [];

  this.start = function(){
    var self = this,
      args = Array.prototype.slice.call(arguments);
    event.onStart_Listeners.forEach(function(listener){
      if(typeof listener == "function"){
        listener.apply(self, args);
      }
    });
  };

  this.end = function(){
    var self = this,
      args = Array.prototype.slice.call(arguments);
    event.onEnd_Listeners.forEach(function(listener){
      if(typeof listener == "function"){
        listener.apply(self, args);
      }
    });
  };

  if(typeof onCreation == "function"){
    onCreation.call(this, this);
  }
  if(Array.isArray(onCreation)){
    for(var i=0; i<onCreation.length; i++){
      if(typeof onCreation[i] == "function"){
        onCreation[i].call(this, this);
      }
    }
  }
}

Event.prototype.type = "event";

Event.prototype.onStart = function(onStart){
  if(typeof onStart == "function"){
    this.onStart_Listeners.push(onStart);
  }
  if(Array.isArray(onStart)){
    for(var i=0; i<onStart.length; i++){
      if(typeof onStart[i] == "function"){
        this.onStart_Listeners.push(onStart[i]);
      }
    }
  }
};

Event.prototype.onEnd = function(onEnd){
  if(typeof onEnd == "function"){
    this.onEnd_Listeners.push(onEnd);
  }
  if(Array.isArray(onEnd)){
    for(var i=0; i<onEnd.length; i++){
      if(typeof onEnd[i] == "function"){
        this.onEnd_Listeners.push(onEnd[i]);
      }
    }
  }
};

if(module){
  module.exports = Event;
}
