// dispatch
safari.application.addEventListener("command", function(event){
  console.log('command', event);
  safari.application.activeBrowserWindow.activeTab.page.dispatchMessage(event.command, {url:'http://example.com'});
}, false);

// validate
safari.application.addEventListener("validate", function(event){
}, false);
