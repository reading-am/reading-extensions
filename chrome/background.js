//-------//
// Setup //
//-------//
var self = this;

//-------------//
// Track Usage //
//-------------//
var track = function(button, event){
  if(!event) event = 'clicked';
  _gaq.push(['_trackEvent', button, event]);
};

//-------------------//
// Submit to Reading //
//-------------------//
var submit = function(type, via, id, url, title){
  track(via+'_'+type);
  chrome.tabs.sendRequest(id, {func: 'submit', url: url, title: title});
};

//--------------------//
// Main Plugin Button //
//--------------------//
chrome.browserAction.onClicked.addListener(function(tab){
  submit('page', 'browserAction', tab.id, tab.url, tab.title);
});

//---------------//
// Context Menus //
//---------------//
var submit_page = function(info, tab){ submit('page',  'contextMenu', tab.id, tab.url, tab.title); },
    submit_link = function(info, tab){ submit('link',  'contextMenu', tab.id, info.linkUrl); },
    submit_image= function(info, tab){ submit('image', 'contextMenu', tab.id, info.srcUrl); },
    submit_video= function(info, tab){ submit('video', 'contextMenu', tab.id, info.srcUrl); },
    submit_audio= function(info, tab){ submit('audio', 'contextMenu', tab.id, info.srcUrl); };

var contexts = ["page","link","image","video","audio"];
for(var i = 0; i < contexts.length; i++){
  var context = contexts[i],
      title = "Post " + context + " to Reading";
  chrome.contextMenus.create({"title": title, "contexts": [context], "onclick": self['submit_'+context]});
}
