var World = require("./lib/World.js"),
  Bot = require("./lib/Bot.js"),
  Event = require("./lib/Event.js"),
  Message = require("./lib/Message.js");

var HelloWorld = new World();
HelloWorld.name = "Hello World";

Array.random = function(array){
  var i = Math.floor(Math.random()*array.length);
  return array[i];
};



function _HelloBot(name, greetings, queue){
  var bot = new Bot();
  bot.name = name;
  bot.model = "HelloBot";
  if(typeof greetings == "string"){
    greetings = [greetings];
  }
  bot.greetings = Array.isArray(greetings)?greetings:["Hi", "Hello"];
  bot.queued_messages = Array.isArray(queue)?queue:[];

  bot.say = function(to, msg){
    var message = new Message(this.name, to, msg);
    bot.queued_messages.push(message);
  };
  bot.method(function(event, world, bots, messages){
    event.start.call(bot);

    var queue = bot.queued_messages;

    queue.forEach(function(msg){
      event.start.call(msg);
    });

    bot.queued_messages = [];

    event.end.call(bot);
  });

  bot.method(function(event, world, bots, messages){
    event.start.call(bot);

    messages.forEach(function(msg){
      if(msg.to == bot.name){
        var out = new Message(bot.name, msg.from, Array.random(bot.greetings)+" "+msg.from+"!");
        event.start.call(out);
      }
    });

    event.end.call(bot);
  });

  return bot;
}

var Bruce = HelloWorld.bot(_HelloBot("Bruce", ["Gidday"]));
var Jim = HelloWorld.bot(_HelloBot("Jim", ["Howdy", "How's it going", "Hiya"]));

Jim.say("Bruce", "Let's get things started.");

var step_count = 0;

HelloWorld.run(new Event(function(){
  this.onStart(function(stage){
    if(this.type == "message"){
      if(!this.to){
        console.log(this.from+": "+this.text);
      }else{
        console.log(this.from+" >> "+this.to+": "+this.text);
      }
    }
    if(stage == "step"){
      step_count++;
      console.log("=="+step_count+"==");
    }
  });
}), 1);


module.exports = {
  Bruce: Bruce,
  Jim: Jim,
  HelloWorld: HelloWorld
};
