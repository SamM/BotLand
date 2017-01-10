var Event, Bot, World, Message;

function BotLand(bots, models, messages){
  var BL = this;
  this.make.self = this;
  this.bots = Array.isArray(bots)?bots:[];
  this.models = Array.isArray(models)?models:[];
  this.messages = Array.isArray(messages)?messages:[];
  this.selected_bot = false;

  this.world = new World(this.bots);

  this.render();
}

BotLand.prototype.getBot = function(name){
  if(!name) name = this.selected_bot;
  for(var i=0; i<this.bots.length; i++){
    if(this.bots[i].name == name) return this.bots[i];
  }
  return undefined;
}

BotLand.prototype.addBot = function(bot){
  if(bot && bot.type == "bot"){
    this.world.bot(bot);
    this.render();
  }
};

BotLand.prototype.removeBot = function(name){
  this.world.kill(name);
  this.render();
};

BotLand.prototype.addMessage = function(message){
  if(message && message.type == "message"){
    this.messages.push(message);
    this.render();
  }
}

BotLand.prototype.run = function(sec_delay){
  var self = this;
  this.world.run(new Event(function(){
    this.onStart(function(stage){
      if(this.type == "message"){
        self.addMessage(this);
      }
    });
    this.onEnd(function(){
      self.render();
    })
  }), sec_delay);
}

BotLand.prototype.step = function(){
  var self = this;
  this.world.step(new Event(function(){
    this.onStart(function(stage){
      if(this.type == "message"){
        self.addMessage(this);
      }
    })
  }));
}

BotLand.prototype.stop = function(){
  this.world.stop();
  this.render();
}

BotLand.prototype.render = function(){
  document.body.innerHTML = "";
  document.body.style.margin = "0";
  document.body.style.fontFamily = "sans-serif";
  this.make.gui(document.body, this);
}

BotLand.prototype.make = {};
BotLand.prototype.make.text = function(text, parent){
  var node = document.createTextNode(text);
  if(parent) parent.appendChild(node);
  return node;
}
BotLand.prototype.make.el = function(type, parent){
  var el = document.createElement(type);
  el.set = function(attr, value){
    var path = attr.split("."),
    cursor = el;
    path.forEach(function(name, i){
      if(i == path.length-1) return;
      if(typeof cursor[name] == "undefined"){
        cursor[name] = {};
      }
      cursor = cursor[name];
    })
    cursor[path.slice(-1)] = value;
    return el;
  }
  if(parent) parent.appendChild(el);
  return el;
}
BotLand.prototype.make.div = function(parent){
  return this.el("div", parent);
}
BotLand.prototype.make.span = function(inner, parent){
  var el = this.el("span", parent);
  if(inner) el.innerHTML = inner;
  return el;
}
BotLand.prototype.make.a = function(inner, href, parent){
  var a = this.el("a", parent);
  if(href) a.href = href;
  if(inner) a.innerHTML = inner;
  return a;
}
BotLand.prototype.make.gui = function(parent, object){
  var el = this.div(parent);
  el.id = "gui";
  object.gui = {};
  object.gui.el = el;

  el.style.position = "absolute";
  el.style.width = "auto";
  el.style.height = "auto";
  el.style.top = "0";
  el.style.bottom = "0";
  el.style.left = "0";
  el.style.right = "0";

  this.header(el, object.gui).set("id", "gui.header");
  this.bot(el, object.gui).set("id", "gui.bot");
  this.land(el, object.gui).set("id", "gui.land");
  this.footer(el, object.gui).set("id", "gui.footer");

  return el;
}
BotLand.prototype.make.header = function(parent, object){
  var el = this.div(parent);
  el.id = "gui.header";
  object.header = {};
  object.header.el = el;

  el.style.position = "absolute";
  el.style.width = "auto";
  el.style.height = "100px";
  el.style.top = "0";
  el.style.bottom = "auto";
  el.style.left = "5%";
  el.style.right = "5%";

  this.title(el, object.header).set("id", "gui.header.title");

  return el;
}

BotLand.prototype.make.title = function(parent, object){
  var el = this.el("h1", parent);
  el.id = "gui.header.title";
  object.title = {};
  object.title.el = el;

  el.style.fontFamily = "sans-serif";
  el.style.textAlign = "center";
  el.style.fontSize = "25px";
  el.style.lineHeight = "65px";

  this.text("Welcome to ", el);
  var logo = this.span(false, el);
  this.logo(el, object.title).set("id", "gui.header.title.logo")
  this.text("!!", el);
  return el;
}

BotLand.prototype.make.logo = function(parent, object){
  var el = this.span(false, parent);
  if(object){
    object.logo = {};
    object.logo.el = el;
  }

  this.span("Bot", el)
    .set("style.color", "red")
    .set("style.border", "2px solid red")
    .set("style.borderRight", "0")
    .set("style.paddingLeft", "0.2em");
  this.span("Land", el)
    .set("style.color", "blue")
    .set("style.border", "2px solid blue")
    .set("style.borderLeft", "0")
    .set("style.paddingRight", "0.2em")
    .set("style.marginRight", "0.2em");

  return el;
}

BotLand.prototype.make.heading = function(level, innerHTML, parent){
  var el = this.el("h"+level, parent);
  if(innerHTML) el.innerHTML = innerHTML;
  el.style.margin = "0.5em";
  el.style.paddingBottom = "0.25em";
  return el;
}

BotLand.prototype.make.bot = function(parent, object){
  var el = this.div(parent);
  el.id = "gui.bot";
  object.bot = {};
  object.bot.el = el;

  var make = this;

  el.style.position = "absolute";
  el.style.width = "auto";
  el.style.height = "auto";
  el.style.top = "100px";
  el.style.bottom = "50px";
  el.style.left = "5%";
  el.style.right = "60%";
  el.style.overflow = "auto";

  el.style.border = "5px solid red";
  el.style.borderRight = "5px solid #F0F0F0";

  if(this.self.selected_bot){
    var bot = this.self.getBot();

    var heading = this.heading(2, "Bot", el)
      .set("style.color", "red")
      .set("style.borderBottom", "5px solid #F0F0F0");

    var buttons = this.div(heading);
    buttons.style.fontSize = "50%";
    buttons.style.margin = "0.5em";
    buttons.style.float = "right";

    var all_bots = this.button("&lt; All Bots", function(e){
      make.self.selected_bot = false;
      make.self.render();
      e.preventDefault();
    }, buttons);
    all_bots.style.backgroundColor = "#999999";

    var delete_bot = this.button("Delete Bot", function(e){
      make.self.selected_bot = false;
      make.self.removeBot(bot.name);
      make.self.render();
      e.preventDefault();
    }, buttons);
    delete_bot.style.backgroundColor = "red";

    var container = this.div(el);
    container.style.position = "absolute";
    container.style.top = "55px";
    container.style.bottom = "0";
    container.style.height = "auto";
    container.style.left = "0";
    container.style.right = "0";
    container.style.width = "auto";
    container.style.overflow = "auto";

    var model_label = this.span("Model: ");
    model_label.style.fontWeight = "bold";

    var model_text = this.span(bot.model);
    model_text.style.fontWeight = "normal";

    var rows = [];
    rows.push([this.span("Name: ").set("style.fontWeight", "bold"),
    this.span(bot.name)]);
    rows.push([model_label, model_text]);

    var details_list = this.list(["30%", "70%"], rows, container);

    var queued = this.heading(3, "Queued Messages", container);
    queued.style.marginTop = "1em";

    var queued_messages = bot.queued_messages;

    if(queued_messages.length){
      var heading_list = this.list(["30%", "70%"], [this.text("To"), this.text("Message")], container)
      heading_list.style.margin = "0 1em 0 1em";
      heading_list.style.fontWeight = "bold";

      var rows = [];
      queued_messages.forEach(function(message){
        var row = [];
        row.push(make.bot_link(message.to).set("style.color", "red").set("style.display", "block"));
        row.push(make.span(message.text));
        rows.push(row);
      });

      var message_list = this.list(["30%", "70%"], rows, container)
      message_list.style.margin = "0 1em 0 1em";
    }else{
      var notice = this.div(container);
      notice.style.margin = "0 1em";
      this.text("There are no queued messages.", notice);
    }

    var say_heading = this.heading(3, "Say Message", container);
    say_heading.style.marginTop = "1em";

    var to_select = this.el("select");
    var bot_names = [];
    this.self.bots.forEach(function(bot){
      bot_names.push(bot.name);
    });
    var options = [""].concat(bot_names);
    options.forEach(function(label){
      var option = make.el("option", to_select);
      option.value = label;
      option.innerHTML = label;
      if(make.self.save_to && make.self.save_to == label){
        option.selected = "true";
      }
    });
    to_select.onchange = function(e){
      make.self.save_to = to_select.selectedOptions[0].value;
    }

    var text_input = this.el("input");
    text_input.type = "text";
    text_input.style.width = "100%";
    if(this.self.save_message){
      text_input.value = this.self.save_message;
    }
    text_input.onkeyup = function(e){
      make.self.save_message = text_input.value;
    }

    var rows = [];
    rows.push([this.span("To: ").set("style.fontWeight", "bold"),
      to_select]);

    rows.push([this.span("Message: ").set("style.fontWeight", "bold"),
      text_input]);

    this.list(["30%", "70%"], rows, container);


    var send_button = this.button("Queue Message", function(e){
      e.preventDefault();
      var option = to_select.selectedOptions[0];
      var to = option.value;
      var message = text_input.value;
      if(!message) return;
      bot.say(to, message);
      text_input.value = "";
      make.self.save_message = "";
      make.self.render();
    }, this.div(container).set("style.marginTop", "1em"));

    send_button.style.backgroundColor = "red";
    send_button.style.margin = "0 0 0 1em";

  }else{
    var heading = this.heading(2, "Bots", el)
      .set("style.color", "red")
      .set("style.borderBottom", "5px solid #F0F0F0");

    var buttons = this.div(heading);
    buttons.style.fontSize = "50%";
    buttons.style.margin = "0.5em";
    buttons.style.float = "right";

    var make_bot = this.button("Create Bot", function(e){
      e.preventDefault();
      var name = prompt("Enter a name for the bot: ");
      if(name === null) return;

      var model = "";
      while(true){
        model = prompt("Choose a bot model from: "+make.self.models.join(" "));
        if(model === null) return;
        if(typeof window[model] != "function"){
          alert("The bot model you entered is not found. Please try again!");
        }else{
          break;
        }
      }

      make.self.addBot(new window[model](name));

      make.self.render();
    }, buttons);
    make_bot.style.backgroundColor = "red";

    var container = this.div(el);
    container.style.position = "absolute";
    container.style.top = "55px";
    container.style.bottom = "0";
    container.style.height = "auto";
    container.style.left = "0";
    container.style.right = "0";
    container.style.width = "auto";
    container.style.overflow = "auto";

    var bots = this.self.bots;

    var rows = [];
    var make = this;

    bots.forEach(function(bot){
      var row = [];
      row.push(make.bot_link(bot.name).set("style.color", "red").set("style.display", "block"));
      row.push(make.span(bot.model));
      rows.push(row);
    });

    var heading_list = this.list(["50%", "40%"], [this.text("Name"), this.text("Model")], container);
    heading_list.style.margin = "0 1em 0 1em";
    heading_list.style.fontWeight = "bold";

    var row_list = this.list(["50%", "40%"], rows, container);
    row_list.style.margin = "0 1em 0 1em";
  }

  return el;
}
BotLand.prototype.make.bot_link = function(name, bot, parent){
  if(!name){
    var el = this.span("Everyone", parent);
    return el;
  }
  var el = this.a(name, "#", parent);
  var make = this;
  el.onclick = function(e){
    make.self.selected_bot = name;
    make.self.render();
    e.preventDefault();
  };
  return el;
}
BotLand.prototype.make.button = function(label, onclick, parent){
  var el = this.a(label, "#", parent);
  if(typeof onclick == "function") el.onclick = onclick;
  el.style.padding = "0.25em 0.5em";
  el.style.margin = "0 0.5em 0 0";
  el.style.backgroundColor = "#999999";
  el.style.color = "white";
  el.style.textDecoration = "none";
  el.style.borderRadius = "0.5em";
  el.style.whiteSpace = "nowrap";
  el.style.overflow = "hidden";
  return el;
}
BotLand.prototype.make.land = function(parent, object){
  var el = this.div(parent);
  el.id = "gui.land";
  object.land = {};
  object.land.el = el;

  el.style.position = "absolute";
  el.style.width = "auto";
  el.style.height = "auto";
  el.style.top = "100px";
  el.style.bottom = "50px";
  el.style.left = "40%";
  el.style.right = "5%";
  el.style.overflow = "auto";

  el.style.border = "5px solid blue";
  el.style.borderLeft = "5px solid #F0F0F0";

  var heading = this.heading(2, "World", el)
    .set("style.color", "blue")
    .set("style.borderBottom", "5px solid #F0F0F0");
  heading.style.position = "absolute";
  heading.style.width = "auto";
  heading.style.left = "0";
  heading.style.right = "0";

  var make = this;

  var buttons = this.div(heading);
  buttons.style.fontSize = "50%";
  buttons.style.margin = "0.5em";
  buttons.style.float = "right";

  var set_delay = this.button("Delay: "+make.self.world.delay+"sec", function(e){
    var delay = prompt("Enter a delay in seconds: ", make.self.world.delay);
    if(delay !== null && !isNaN(parseFloat(delay))){
      make.self.world.delay = parseFloat(delay);
    }
    make.self.render();
    e.preventDefault();
  }, buttons);
  set_delay.style.backgroundColor = "blue";

  if(make.self.world.stopped){
    var run_world = this.button("Run World", function(e){
      make.self.run();
      make.self.render();
      e.preventDefault();
    }, buttons);
    run_world.style.backgroundColor = "blue";

    var step_world = this.button("Step World", function(e){
      make.self.step();
      e.preventDefault();
    }, buttons);
    step_world.style.backgroundColor = "blue";
  }else{
    var stop_world = this.button(make.self.world.stop_please?"Stopping...":"Stop World", function(e){
      make.self.stop();
      e.preventDefault();
    }, buttons);
    stop_world.style.backgroundColor = "blue";
  }

  var container = this.div(el);
  container.style.position = "absolute";
  container.style.top = "55px";
  container.style.bottom = "0";
  container.style.height = "auto";
  container.style.left = "0";
  container.style.right = "0";
  container.style.width = "auto";
  container.style.overflow = "auto";


  var messages_heading = this.heading(3, "Messages", container);
  messages_heading.style.margin = "10px 0 0.5em 0.75em";

  var messages = this.self.messages;
  if(messages.length){
    var rows = [];

    messages.forEach(function(message){
      var row = [];
      row.push(make.bot_link(message.from).set("style.color", "blue").set("style.display", "block"));
      row.push(make.bot_link(message.to).set("style.color", "blue").set("style.display", "block"));
      row.push(make.span(message.text));
      rows.push(row);
    });

    var heading_list = this.list(["20%", "20%", "50%"], [this.text("From"), this.text("To"), this.text("Message")], container)
    heading_list.style.margin = "0 1em 0 1em";
    heading_list.style.fontWeight = "bold";

    var message_list = this.list(["20%", "20%", "50%"], rows, container)
    message_list.style.margin = "0 1em 0 1em";
  }else{
    var notice = this.div(container);
    this.text("There are no messages to display.", notice);
    notice.style.margin = "0 1em";
  }

  container.scrollTop = container.clientHeight;

  return el;
}

BotLand.prototype.make.list = function(widths, rows, parent){
  var el = this.div(parent);
  var make = this;

  el.style.overflow= "auto";

  if(Array.isArray(rows)){
    if(!Array.isArray(rows[0])){
      rows = [rows];
    }
    rows.forEach(function(cols){
      var row = make.row(el);
      cols.forEach(function(inner, i){
        var col = make.column(widths[i], row);
        if(inner) col.appendChild(inner);
      });
    });
  }

  el.style.margin = "0 1em 0 1em";

  return el;
}
BotLand.prototype.make.row = function(parent){
  var el = this.div(parent);
  el.style.borderBottom = "2px solid #F0F0F0";
  el.style.padding = "0.25em";
  el.style.overflow = "auto";
  return el;
}
BotLand.prototype.make.column = function(width, parent){
  var el = this.div(parent);
  el.style.float = "left";
  if(width) el.style.width = width;
  return el;
}

BotLand.prototype.make.footer = function(parent, object){
  var el = this.div(parent);
  el.id = "gui.footer";
  object.footer = {};
  object.footer.el = el;

  el.style.position = "absolute";
  el.style.width = "auto";
  el.style.height = "50px";
  el.style.top = "auto";
  el.style.bottom = "0";
  el.style.left = "5%";
  el.style.right = "5%";

  el.style.textAlign = "center";
  el.style.color = "black";
  el.style.lineHeight = "50px";
  el.style.backgroundColor = "white";

  this.logo(el, object.footer);
  this.text(" is copyright of Sam Mulqueen, 2017.", el);
  return el;
}
