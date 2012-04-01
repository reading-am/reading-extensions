// dispatch
var handle_command = function(event){
  console.log('command', event);
  safari.application.activeBrowserWindow.activeTab.page.dispatchMessage(event.command, {url:'http://example.com'});
};

// validate
var handle_validate = function(event){
};

var handle_cm = function(event){
  console.log('open cm', event);
  if (event.userInfo === "IMG") {
    event.contextMenu.appendContextMenuItem("enlarge", "Post image to Reading");
  }
};

// attach listeners
safari.application.addEventListener("command", handle_command, false);
safari.application.addEventListener("validate", handle_validate, false);
safari.application.addEventListener("contextmenu", handle_cm, false);
