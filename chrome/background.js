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
var contexts = [
  {type: "page",  func: function(info, tab){ submit('page',  'contextMenu', tab.id, tab.url, tab.title); }},
  {type: "link",  func: function(info, tab){ submit('link',  'contextMenu', tab.id, info.linkUrl); }},
  {type: "image", func: function(info, tab){ submit('image', 'contextMenu', tab.id, info.srcUrl); }},
  {type: "video", func: function(info, tab){ submit('video', 'contextMenu', tab.id, info.srcUrl); }},
  {type: "audio", func: function(info, tab){ submit('audio', 'contextMenu', tab.id, info.srcUrl); }}
];
for(var i = 0; i < contexts.length; i++){
  chrome.contextMenus.create({
    "title": "Post " + context[i].type + " to Reading",
    "contexts": [context[i].type],
    "onclick": context[i].func
  });
}
