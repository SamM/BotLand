var BasicBot, Event, require, module, CleverBotAPI;

if(typeof require == "function"){
  BasicBot = require("./BasicBot.js");
  Event = require("../lib/Event.js");
  CleverBotAPI = require("CleverBot.io");
}else{
  var base_url = "https://cleverbot.io/1.0/";
  CleverBotAPI = function(api_user, api_key){
    var bot = this;

    this.user = api_user;
    this.key = api_key;

    this.setNick = function (nick) {
  		this.nick = nick;
  	}

    this.toQueryString = function(data){
      var items = [];
      for(var key in data){
        items.push(key+"="+data[key]);
      }
      return items.join("&");
    }

    this.create = function(callback){
      var request = new XMLHttpRequest();
      request.addEventListener("load", function (e) {
        var body = request.responseText;
        if (JSON.parse(body).status == "success") {
          bot.nick = JSON.parse(body).nick;
          callback(false, bot.nick);
        }
        else if (JSON.parse(body).status == "Error: reference name already exists") {
          callback(false, bot.nick);
        }
        else {
          throw JSON.parse(body).status;
        }
      });
      var data = {
				user: this.user,
				key: this.key,
				nick: this.nick
			};
      request.open("POST", base_url+"create");
      request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      request.send(this.toQueryString(data));
    };

    this.ask = function (input, callback) {
      var request = new XMLHttpRequest();
      request.addEventListener("load", function (e) {
        var body = request.responseText;
        if (JSON.parse(body).status == "success") {
          callback(false, JSON.parse(body).response);
        }
        else {
          callback(true, JSON.parse(body).status);
        }
      });
      var data = {
				user: this.user,
				key: this.key,
				nick: this.nick,
				text: input
			};
  		request.open("post", base_url + "ask");
      request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      request.send(this.toQueryString(data));
  	}
  }
}

function CleverBot(name, queue){
  var bot = new BasicBot(name, queue);
  bot.model = "CleverBot";

  bot.api = new CleverBotAPI("dXboCmSiEL2XdC2w", "FfBwNZ7rHtq6XAaatd9QOwGEpVr8ROiF");
  bot.api.setNick(name);
  bot.api.create(function(err, nick){
    console.log("Created Cleverbot session: "+nick);
  });

  bot.method(function(event, world, bots, messages){
    event.start.call(bot);

    var recv = [];


    messages.forEach(function(msg){
      if(msg.to == bot.name){
        recv.push(msg);
      }
    });

    var step_count = 0,
    step_total = recv.length;
    if(recv.length == 0){
      event.end.call(bot);
      return;
    }
    recv.forEach(function(msg){
      bot.api.ask(msg.text, function(err, response){
        step_count++;
        if(!err){
          bot.say(msg.from, response, event);
        }
        if(step_count == step_total){
          event.end.call(bot);
        }
      });
    })
  });

  return bot;
}

if(module){
  module.exports = CommandBot;
}
