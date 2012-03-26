const widgets = require("widget");
const tabs    = require("tabs");
const data    = require("self").data;

var widget = widgets.Widget({
  id: "reading-link",
  label: "Reading",
  contentURL: data.url("icon16.png"),
  onClick: function() {
    tabs.open("https://reading.am");
  }
});

// from: file:///Users/leppert/dev/addon-sdk-1.5/doc/packages/addon-kit/docs/page-mod.html#include
var workers = [];
function detachWorker(worker, workerArray){
  var index = workerArray.indexOf(worker);
  if(index != -1) {
    workerArray.splice(index, 1);
  }
}

const pageMod = require("page-mod");
pageMod.PageMod({
  include: ["http://*", "https://*"],
  contentScriptWhen: 'ready',
  contentScriptFile: data.url("content.js"),
  onAttach: function(worker){
    worker.postMessage({func:'submit', url:'http://example.com', title:'Example'});
    workers.push(worker);
    worker.on('detach', function () {
      detachWorker(this, workers);
    });
  }
});

console.log("The add-on is running.");
