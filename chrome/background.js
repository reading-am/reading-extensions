var self = this;
    post = function(url, tab){
      console.log(url);
      chrome.tabs.executeScript(tab.id, {file: "action.js"}, function(){
        chrome.tabs.sendRequest(tab.id, {url: url});
      });
    },
    post_page = function(info, tab){ post(info.pageUrl, tab); },
    post_link = function(info, tab){ post(info.linkUrl, tab); },
    post_image= function(info, tab){ post(info.srcUrl, tab); },
    post_video= function(info, tab){ post(info.srcUrl, tab); },
    post_audio= function(info, tab){ post(info.srcUrl, tab); };

var contexts = ["page","link","image","video","audio"];
for(var i = 0; i < contexts.length; i++){
  var context = contexts[i],
      title = "Post " + context + " to Reading";
  chrome.contextMenus.create({"title": title, "contexts": [context], "onclick": self['post_'+context]});
}

chrome.browserAction.onClicked.addListener(function(tab){
  chrome.tabs.executeScript(tab.id, {file: "action.js"});
});

// This is currently handled in the content script manifest option
// chrome.tabs.onUpdated.addListener(function(tabId , info){
  // if(info.status == "complete"){
    // chrome.tabs.executeScript(null, {file:"content.js"});
  // }
// });
