var Event, require, module;

if(typeof require == "function"){
  var Event = require("./Event.js");
}

function Bot(methods){
  this.methods = Array.isArray(methods)?methods:[];
}

Bot.prototype.type = "bot";

Bot.prototype.step = function(event){
  var bot = this,
    args = Array.prototype.slice.call(arguments);
  if(!(event instanceof Event)){
    throw new Error("First argument must be instance of Event");
  }
  event.start.call(this);
  var total_steps = this.methods.length,
    count_steps = 0;
  if(total_steps == 0){
    event.end.call(world);
    return;
  }
  args[0] = new Event(function(){
    this.onStart(event.start);
    this.onEnd(function(){
      count_steps++;
      if(count_steps == total_steps){
        event.end.call(bot);
      }
    })
  });
  this.methods.forEach(function(listener){
    if(typeof listener == "function"){
      listener.apply(bot, args);
    }
  });
};

Bot.prototype.method = function(method){
  if(typeof method == "function"){
    this.methods.push(method);
  }
};

if(module){
  module.exports = Bot;
}
