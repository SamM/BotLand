var Event, require, module;

if(typeof require == "function"){
  var Event = require("./Event.js");
}

Array.empty = function(array){
  while(array.length){
    array.shift();
  }
  return array;
};
Array.fill = function(from, to){
  from.forEach(function(i){
    to.push(i);
  })
  return to;
}

function World(bots, messages){
  this.bots = Array.isArray(bots)?bots:[];
  this.messages = Array.isArray(messages)?messages:[];
  this.stop_please = false;
  this.stopped = true;
  this.delay = 1;
}

World.prototype.type = "world";

World.prototype.bot = function(bot){
  if(typeof bot == "object" && bot.type == "bot"){
    this.bots.push(bot);
  }
  return bot;
}

World.prototype.kill = function(name){
  var index = -1, bot;
  this.bots.forEach(function(bot, i){
    if(bot.name == name){ index = i; }
  });
  if(index > -1) bot = this.bots.splice(index, 1);
  return bot;
}

World.prototype.message = function(message){
  if(typeof message == "object" && message.type == "message"){
    this.messages.push(message);
  }
  return message;
}

World.prototype.run = function(event, sec_delay){
  var world = this;
  if(!(event instanceof Event)){
    throw new Error("First argument must be instance of Event");
  }
  if(typeof sec_delay != "number"){
    sec_delay = this.delay;
  }
  this.delay = sec_delay;
  event.start.call(this);
  if(this.stop_please){
    if(this.stopped){
      this.stop_please = false;
      this.stopped = false;
    }else{
      this.stopped = true;
      event.end.call(this);
      return;
    }
  }else{
    this.stopped = false;
  }
  this.step(new Event(function(){
    this.onStart(event.start);
    this.onEnd(function(){
      setTimeout(
        function(){
          world.run(event);
        },
        Math.round(world.delay*1000)
      );
    });
  }));
}

World.prototype.step = function(event){
  var world = this;
  if(!(event instanceof Event)){
    throw new Error("First argument must be instance of Event");
  }
  event.start.call(this, "step");
  var messages = this.messages;
  this.messages = [];
  var step_args = [this, this.bots, messages];

  var total_steps = this.bots.length,
    count_steps = 0;
  if(total_steps == 0){
    event.end.call(world);
    return;
  }
  var args = [new Event(
    function(){
      this.onStart(function(){
        if(this.type == "message"){
          world.message(this);
        }
        event.start.call(this);
      });
      this.onEnd(function(){
        count_steps++;
        if(count_steps == total_steps){
          event.end.call(world, "step");
        }
      });
    })
  ].concat(step_args);

  this.bots.forEach(function(bot){
    if(typeof bot == "object" && typeof bot.step == "function"){
      bot.step.apply(bot, args);
    }
  });
}

World.prototype.stop = function(){
  this.stop_please = true;
};

if(module){
  module.exports = World;
}
