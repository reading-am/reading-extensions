var self = this;
    post = function(id, url, title){
      chrome.tabs.sendRequest(id, {url: url, title: title});
    },
    post_page = function(info, tab){ post(tab.id, tab.url, tab.title); },
    post_link = function(info, tab){ post(tab.id, info.linkUrl); },
    post_image= function(info, tab){ post(tab.id, info.srcUrl); },
    post_video= function(info, tab){ post(tab.id, info.srcUrl); },
    post_audio= function(info, tab){ post(tab.id, info.srcUrl); };

var contexts = ["page","link","image","video","audio"];
for(var i = 0; i < contexts.length; i++){
  var context = contexts[i],
      title = "Post " + context + " to Reading";
  chrome.contextMenus.create({"title": title, "contexts": [context], "onclick": self['post_'+context]});
}

chrome.browserAction.onClicked.addListener(function(tab){
  post(tab.id, tab.url, tab.title);
});
