var World = require("./lib/World.js"),
  Bot = require("./lib/Bot.js"),
  Event = require("./lib/Event.js"),
  Message = require("./lib/Message.js"),
  BasicBot = require("./bots/BasicBot.js"),
  HelloBot = require("./bots/HelloBot.js"),
  CommandBot = require("./bots/CommandBot.js");

var HelloWorld = new World();
HelloWorld.name = "Hello World";

Array.random = function(array){
  var i = Math.floor(Math.random()*array.length);
  return array[i];
};


var Bruce = HelloWorld.bot(BasicBot("Bruce"));
var Jim = HelloWorld.bot(CommandBot("Jim"));
var Neil = HelloWorld.bot(HelloBot("Neil", ["Hi", "Hey", "Hello", "Howdy", "Gidday"]));
Bruce.say("Jim", "say Neil: What's up?");

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

setTimeout(function(){
  Bruce.say("Jim", "say Neil: Hi!");
}, 4000)

module.exports = {
  Bruce: Bruce,
  Jim: Jim,
  Neil: Neil,
  HelloWorld: HelloWorld
};
