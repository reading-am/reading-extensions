var pageSearch = function(info, tab) {
    // Send the selected image to TinEye
    sort_order = sortOrder();
    open_url("http://" + SERVER + "/search/?pluginver=chrome-" + CHROME_VERSION +  sort_order + "&url=" + encodeURIComponent(info.srcUrl));
};

var page_menu = chrome.contextMenus.create({"title": "Post to Reading",
                                            "contexts": ["all"],
                                            "onclick": pageSearch});

chrome.browserAction.onClicked.addListener(function(tab){
  chrome.tabs.executeScript(null, {file:"action.js"});
});

// chrome.tabs.onUpdated.addListener(function(tabId , info){
  // if(info.status == "complete"){
    // chrome.tabs.executeScript(null, {file:"content.js"});
  // }
// });
