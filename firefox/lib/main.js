//-------//
// Setup //
//-------//
var widgets = require("widget");
var tabs    = require("tabs");
var data    = require("self").data;
// from: file:///Users/leppert/dev/addon-sdk-1.5/doc/packages/addon-kit/docs/page-mod.html#include
var workers = [];
var detachWorker = function(worker, workerArray){
  var index = workerArray.indexOf(worker);
  if(index != -1) {
    workerArray.splice(index, 1);
  }
};

//---------------------//
// Insert on Page Load //
//---------------------//
var pageMod = require("page-mod");
pageMod.PageMod({
  include: ["http://*", "https://*"],
  contentScriptWhen: 'ready',
  contentScriptFile: data.url("content.js"),
  onAttach: function(worker){
    workers.push(worker);
    worker.on('detach', function(){
      detachWorker(this, workers);
    });
  }
});

//-------------------//
// Submit to Reading //
//-------------------//
var submit = function(url){
  var worker = workers[0];
      message = {func:'submit'};
  if(url instanceof String){
    message.url = url;
  } else {
    message.url   = worker.tab.url;
    message.title = worker.tab.title;
  }
  worker.postMessage(message);
};

//--------------------//
// Main Plugin Button //
//--------------------//
var widget = widgets.Widget({
  id: "reading",
  label: "Reading",
  contentURL: data.url("icon16.png"),
  onClick: submit
});

//---------------//
// Context Menus //
//---------------//
var cm = require("context-menu");
var contexts = [
  {name:"page",  sel:false},
  {name:"link",  sel:"a"},
  {name:"image", sel:"img"}
];
for(var i = 0; i < contexts.length; i++){
  var item = {
    label: "Post " + contexts[i].name + " to Reading",
    image: data.url("icon16.png"),
    contentScript: 'self.on("click", function(node, data){' +
                   '  self.postMessage(node);' +
                   '});',
    onMessage: submit
  };
  if(contexts[i].sel) item.context = cm.SelectorContext(contexts[i].sel);
  cm.Item(item);
}

console.log("The add-on is running.");
