//-------//
// Setup //
//-------//
// system
var widgets = require("widget"),
    tabs    = require("tabs"),
    data    = require("self").data,
    cm      = require("context-menu"),
    pageMod = require("page-mod");
// tracking
var workers = [],
    tabbers = [],
    current_worker = function(){ return workers[tabbers.indexOf(tabs.activeTab)]; };

//---------------------//
// Insert on Page Load //
//---------------------//
// equivalent to Chrome's manifest.json ruels
pageMod.PageMod({
  include: ["http://*", "https://*"],
  contentScriptWhen: 'ready',
  contentScriptFile: data.url("content.js"),
  onAttach: function(worker){
    // check that you're not in an iframe
    if(worker.url == worker.tab.url){
      // add to list
      var existing = tabbers.indexOf(worker.tab);
      if(existing > -1){
        // NOTE - some pages register the same load twice.
        // We save and call both workers but only one will truly submit
        if(worker.url == workers[existing][0].url){
          console.log("duplicate", existing);
          workers[existing].push(worker);
        } else {
          console.log("attach to", existing);
          workers[existing] = [worker];
        }
      } else {
        console.log("attach new", tabbers.length);
        workers.push([worker]);
        tabbers.push(worker.tab);
      }
      // cleanup on close
      worker.tab.on("close", function(tab){
        var index = tabbers.indexOf(tab);
        if(index > -1){
          console.log("close", index);
          tabbers.splice(index, 1);
          workers.splice(index, 1);
        }
      });
    }
  }
});

//-------------------//
// Submit to Reading //
//-------------------//
var submit = function(url){
  var worker  = current_worker();
      message = {func:'submit'};
  if(url instanceof String){
    message.url = url;
  } else {
    message.url   = worker[0].tab.url;
    message.title = worker[0].tab.title;
  }
  for(var i=0; i<worker.length; i++){
    worker[i].postMessage(message);
  }
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
