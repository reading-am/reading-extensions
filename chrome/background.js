//-------//
// Setup //
//-------//
var ROOT_DOMAIN = 'reading.am';
// uncomment for local testing
// ROOT_DOMAIN = 'reading.dev:3000';

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
    "title": "Post " + contexts[i].type + " to Reading",
    "contexts": [contexts[i].type],
    "onclick": contexts[i].func
  });
}

//------------//
// CSP Bypass //
//------------//
// https://www.planbox.com/blog/development/coding/bypassing-githubs-content-security-policy-chrome-extension.html
chrome.webRequest.onHeadersReceived.addListener(function(details) {
  for (i = 0; i < details.responseHeaders.length; i++) {

    if (isCSPHeader(details.responseHeaders[i].name.toUpperCase())) {
      var csp = details.responseHeaders[i].value,
          defsrcs = ['http://*.'+ROOT_DOMAIN, 'https://*.'+ROOT_DOMAIN],
          // via: https://developer.mozilla.org/en-US/docs/Security/CSP/CSP_policy_directives
          directives = {
            'default-src': defsrcs,
            'script-src': [
              "'unsafe-eval'",
              'http://*.'+ROOT_DOMAIN,
              'https://*.'+ROOT_DOMAIN
            ],
            'object-src': defsrcs,
            'img-src':    defsrcs,
            'media-src':  defsrcs,
            'frame-src':  defsrcs,
            'font-src':   defsrcs,
            'connect-src': [
              'http://*.'+ROOT_DOMAIN,
              'https://*.'+ROOT_DOMAIN,
              "ws://*.pusherapp.com",
              "wss://*.pusherapp.com",
              // SockJS fallback endpoints
              "http://*.pusher.com",
              "https://*.pusher.com"
            ],
            'style-src':  defsrcs,
            'report-uri': defsrcs
          };

      for (var key in directives) csp = csp.replace(key, key+" "+directives[key].join(" "));
      details.responseHeaders[i].value = csp;
    }
  }

  return { // Return the new HTTP header
    responseHeaders: details.responseHeaders
  };
}, {
  urls: ["http://*/*", "https://*/*"],
  types: ["main_frame"]
}, ["blocking", "responseHeaders"]);

function isCSPHeader(headerName) {
  return (headerName == 'CONTENT-SECURITY-POLICY') || (headerName == 'X-WEBKIT-CSP');
}
