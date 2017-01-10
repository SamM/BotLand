var BasicBot, Event, require, module;

if(typeof require == "function"){
  BasicBot = require("./BasicBot.js");
  Event = require("../lib/Event.js");
}

function CommandBot(name, queue){
  var bot = new BasicBot(name, queue);
  bot.model = "CommandBot";

  bot.commands = {};

  bot.add_command = function(search, handler){
    if(typeof search == "string" && typeof handler == "function"){
      bot.commands[search] = handler;
    }
  }

  bot.method(function(event, world, bots, messages){
    event.start.call(bot);

    var commands_triggered = [];

    messages.forEach(function(message){
      var search;
      if(message.to == bot.name){
        for(var com in bot.commands){
          search = com+" ";
          if(message.text.indexOf(search) === 0){
            commands_triggered.push([com, message.text.slice(search.length)]);
          }
        }
      }
    });

    var step_count = 0,
      step_total = commands_triggered.length;

    if(step_total==0){
      event.end.call(bot);
      return;
    }

    commands_triggered.forEach(function(com){
      if(typeof bot.commands[com[0]] == "function"){
        bot.commands[com[0]].call(bot, new Event(function(){
          this.onStart(event.start);
          this.onEnd(function(){
            step_count++;
            if(step_count == step_total){
              event.end.call(bot);
            }
          })
        }), com[1]);
      }
    })
  });

  bot.add_command("say", function(event, text){
    event.start.call(bot);
    var name = text.split(" ")[0];
    if(name.slice(-1)==":"){
      bot.say(name.slice(0,-1), text.slice(name.length+1));
    }else{
      bot.say("", text);
    }
    event.end.call(bot);
  });

  return bot;
}

if(module){
  module.exports = CommandBot;
}
