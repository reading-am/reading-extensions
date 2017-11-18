//----------------//
// Support Chrome //
//----------------//
// Firefox uses "browser" while Chrome uses "chrome"
if (typeof browser === "undefined") {
  browser = chrome;
}

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
  browser.tabs.sendMessage(id, {func: 'submit', url: url, title: title});
};

//--------------------//
// Main Plugin Button //
//--------------------//
browser.browserAction.onClicked.addListener(function(tab){
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
  browser.contextMenus.create({
    "title": "Post " + contexts[i].type + " to Reading",
    "contexts": [contexts[i].type],
    "onclick": contexts[i].func
  });
}

//------------//
// CSP Bypass //
//------------//
browser.webRequest.onHeadersReceived.addListener(function(details) {
  for (i = 0; i < details.responseHeaders.length; i++) {
    if (['content-security-policy',
         'x-content-security-policy',
         'x-webkit-csp'
        ].indexOf(details.responseHeaders[i].name.toLowerCase()) > -1
       ) {
      details.responseHeaders[i].value = CSP.inject(details.responseHeaders[i].value);
    }
  }
  return {responseHeaders: details.responseHeaders};
}, {
  urls: ["http://*/*", "https://*/*"],
  types: ["main_frame"]
}, ["blocking", "responseHeaders"]);
