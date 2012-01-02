var self = this;
    post = function(url){
      console.log(url);
    },
    post_page = function(info, tab){ post(info.pageUrl); },
    post_link = function(info, tab){ post(info.linkUrl); },
    post_image= function(info, tab){ post(info.srcUrl); },
    post_video= function(info, tab){ post(info.srcUrl); },
    post_audio= function(info, tab){ post(info.srcUrl); };

var contexts = ["page","link","image","video","audio"];
for(var i = 0; i < contexts.length; i++){
  var context = contexts[i],
      title = "Post " + context + " to Reading";
  chrome.contextMenus.create({"title": title, "contexts": [context], "onclick": self['post_'+context]});
}

chrome.browserAction.onClicked.addListener(function(tab){
  chrome.tabs.executeScript(null, {file:"action.js"});
});

// This is currently handled in the content script manifest option
// chrome.tabs.onUpdated.addListener(function(tabId , info){
  // if(info.status == "complete"){
    // chrome.tabs.executeScript(null, {file:"content.js"});
  // }
// });
