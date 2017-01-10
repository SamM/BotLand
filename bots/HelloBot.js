var BasicBot, require, module;

if(typeof require == "function"){
  var BasicBot = require("./BasicBot.js");
}

Array.random = function(array){
  var i = Math.floor(Math.random()*array.length);
  return array[i];
};

function HelloBot(name, greetings, queue){
  var bot = new BasicBot(name, queue);
  bot.model = "HelloBot";
  if(typeof greetings == "string"){
    greetings = [greetings];
  }
  bot.greetings = Array.isArray(greetings)?greetings:["Hi", "Hello"];

  bot.method(function(event, world, bots, messages){
    event.start.call(bot);

    messages.forEach(function(msg){
      if(msg.to == bot.name){
        bot.say(msg.from, Array.random(bot.greetings)+" "+msg.from+"!", event);
      }
    });

    event.end.call(bot);
  });

  return bot;
}

if(module){
  module.exports = HelloBot;
}
