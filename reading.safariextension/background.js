// dispatch
var handle_command = function(event){
  console.log('command', event);

  if(event.command == 'page'){
    var message = {
      url: safari.application.activeBrowserWindow.activeTab.url,
      title: safari.application.activeBrowserWindow.activeTab.title
    };
  } else {
    var message = click_info[event.command];
  };

  safari.application.activeBrowserWindow.activeTab.page.dispatchMessage('submit', message);
};

// validate
var handle_validate = function(event){
};

//---------------//
// Context Menus //
//---------------//
var contexts = [
      {type: "page"},
      {type: "link",  selector:"a"},
      {type: "image", selector:"img"}
    ],
    click_info = {};
var handle_cm = function(event){
  console.log('open cm', event);
  for(var i = 0; i < event.userInfo.length; i++){
    for(var j = 0; j < contexts.length; j++){
      if(event.userInfo[i].name == contexts[j].selector){
        click_info[contexts[j].type] = {url: event.userInfo[i].url};
        event.contextMenu.appendContextMenuItem(contexts[j].type, "* Post "+contexts[j].type+" to Reading");
      }
    }
  }
  // if none of the selectors match, show "read page" context
  if(!event.contextMenu.contextMenuItems.length){
    event.contextMenu.appendContextMenuItem(contexts[0].type, "* Post "+contexts[0].type+" to Reading");
  }
};

// attach listeners
safari.application.addEventListener("command", handle_command, false);
safari.application.addEventListener("validate", handle_validate, false);
safari.application.addEventListener("contextmenu", handle_cm, false);
