var Bot, Message, require, module;

if(typeof require == "function"){
  Bot = require("../lib/Bot.js");
  Message = require("../lib/Message.js");
}


function BasicBot(name, queue){
  var bot = new Bot();
  bot.name = name;
  bot.model = "BasicBot";
  bot.queued_messages = Array.isArray(queue)?queue:[];

  bot.say = function(to, msg, event){
    var message = new Message(this.name, to, msg);
    if(event && typeof event.start == "function"){
      event.start.call(message);
    }else{
      bot.queued_messages.push(message);
    }
    return this;
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

  return bot;
}

if(module){
  module.exports = BasicBot;
}
