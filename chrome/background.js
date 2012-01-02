var self = this;
    submit = function(id, url, title){
      chrome.tabs.sendRequest(id, {url: url, title: title});
    },
    submit_page = function(info, tab){ submit(tab.id, tab.url, tab.title); },
    submit_link = function(info, tab){ submit(tab.id, info.linkUrl); },
    submit_image= function(info, tab){ submit(tab.id, info.srcUrl); },
    submit_video= function(info, tab){ submit(tab.id, info.srcUrl); },
    submit_audio= function(info, tab){ submit(tab.id, info.srcUrl); };

var contexts = ["page","link","image","video","audio"];
for(var i = 0; i < contexts.length; i++){
  var context = contexts[i],
      title = "Post " + context + " to Reading";
  chrome.contextMenus.create({"title": title, "contexts": [context], "onclick": self['submit_'+context]});
}

chrome.browserAction.onClicked.addListener(function(tab){
  submit(tab.id, tab.url, tab.title);
});
