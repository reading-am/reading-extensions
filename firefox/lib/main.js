//-------//
// Setup //
//-------//
// system
var widgets = require("sdk/widget"),
    tabs    = require("sdk/tabs"),
    data    = require("sdk/self").data,
    cm      = require("sdk/context-menu"),
    pageMod = require("sdk/page-mod");
// tracking
var workers = [],
    tabbers = [],
    current_worker = function(){ return workers[tabbers.indexOf(tabs.activeTab)]; };
// misc
var icon = data.url('shared/icon16.png');

//---------------------//
// Insert on Page Load //
//---------------------//
// equivalent to Chrome's manifest.json rules
pageMod.PageMod({
  include: ["http://*", "https://*"],
  contentScriptWhen: 'ready',
  contentScriptFile: data.url('shared/content.js'),
  onAttach: function(worker){
    // check that you're not in an iframe
    if(worker.url == worker.tab.url){
      // add to list
      var existing = tabbers.indexOf(worker.tab);
      if(existing > -1){
        // NOTE - some pages register the same load twice.
        // We save and call both workers but only one will truly submit
        if(worker.url == workers[existing][0].url){
          console.log('MAIN:', "duplicate", existing);
          workers[existing].push(worker);
        } else {
          console.log('MAIN:', "attach to", existing);
          workers[existing] = [worker];
        }
      } else {
        console.log('MAIN:', "attach new", tabbers.length);
        workers.push([worker]);
        tabbers.push(worker.tab);
      }
      // cleanup on close
      worker.tab.on("close", function(tab){
        var index = tabbers.indexOf(tab);
        if(index > -1){
          console.log('MAIN:', "close", index);
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
var submit = function(url, title){
  console.log('MAIN:', 'submit', url, title);
  var worker = current_worker();
  for(var i = 0; i < worker.length; i++){
    worker[i].postMessage({func: 'submit', url: url, title: title});
  }
};

//--------------------//
// Main Plugin Button //
//--------------------//
var widget = widgets.Widget({
  id: "reading",
  label: "Reading",
  contentURL: icon,
  onClick: function(){
    submit(tabs.activeTab.url, tabs.activeTab.title);
  }
});

//---------------//
// Context Menus //
//---------------//
var contexts = [
  {type: "page",  func: function(){ submit(tabs.activeTab.url, tabs.activeTab.title); }},
  {type: "link",  prop: "node.href",  func: submit, selector:"a[href]"},
  {type: "image", prop: "node.src",   func: submit, selector:"img"}
];
for(var i = 0; i < contexts.length; i++){
  var item = {
    label: "Post "+contexts[i].type+" to Reading",
    image: icon,
    onMessage: contexts[i].func,
    contentScript: 'self.on("click", function(node, data){' +
                      'self.postMessage(' + (contexts[i].prop ? contexts[i].prop : 'null') + ');' +
                   '});'
  };
  if(contexts[i].selector) item.context = cm.SelectorContext(contexts[i].selector);
  cm.Item(item);
}

//------------//
// CSP Bypass //
//------------//
// NOTE - The modified headers usually don't show up in the inspector or Firebug.
// If I had to take a guess, it depends on whose observer gets fired first.
//
// https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/platform_xpcom
// http://stackoverflow.com/a/1777834/313561
// http://stackoverflow.com/a/19917664/313561
const {Cc,Ci} = require("chrome");
// FYI this is symlinked to the folder because FF won't let you require()
// files that aren't in ./lib
var {CSP} = require("./csp");

var modify_header = function(channel, header){
  var csp = channel.getResponseHeader(header);
  channel.setResponseHeader(header, CSP.inject(csp), false);
};

Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService).addObserver({
  observe : function(subject, topic, data) {
    var channel = subject.QueryInterface(Ci.nsIHttpChannel);
    if (channel.responseStatus !== 200) return;
    // There is no clean way to check the presence of csp header. an exception
    // will be thrown if it is not there.
    // https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsIHttpChannel
    try { modify_header(channel, "Content-Security-Policy"); } catch (e) {
      try { modify_header(channel, "X-Content-Security-Policy"); } catch (e) {
        try { modify_header(channel, "X-WebKit-CSP"); } catch (e) {
          return; // no headers found
        }
      }
    }
  }
},"http-on-examine-response", false);
