var module;

function Message(from, to, text){
  this.from = from;
  this.to = to;
  this.text = text;
}

Message.prototype.type = "message";

if(module){
  module.exports = Message;
}
