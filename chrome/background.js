var pageSearch = function(info, tab){
    sort_order = sortOrder();
    open_url("http://" + SERVER + "/search/?pluginver=chrome-" + CHROME_VERSION +  sort_order + "&url=" + encodeURIComponent(info.srcUrl));
};

var contexts = ["page","link","image","video","audio"];
for(var i = 0; i < contexts.length; i++){
  var context = contexts[i],
      title = "Post " + context + " to Reading";
  chrome.contextMenus.create({"title": title, "contexts": [context], "onclick": pageSearch});
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
