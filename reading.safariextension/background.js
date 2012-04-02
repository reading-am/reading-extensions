//-------//
// Setup //
//-------//
var handle_command = function(event){
  console.log('command', event);
  if(event.target instanceof SafariExtensionToolbarItem){
    main_button();
  } else {
    click_info[event.command].onclick();
  }
};

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
var submit = function(type, via, url, title){
  track(via+'_'+type);
  safari.application.activeBrowserWindow.activeTab.page.dispatchMessage('submit', {url: url, title: title});
};

//--------------------//
// Main Plugin Button //
//--------------------//
var main_button = function(){
  submit('page', 'browserAction', safari.application.activeBrowserWindow.activeTab.url, safari.application.activeBrowserWindow.activeTab.title);
};

//---------------//
// Context Menus //
//---------------//
var contexts = [
      {type: "page",  func: function(){ submit('page', 'contextMenu', safari.application.activeBrowserWindow.activeTab.url, safari.application.activeBrowserWindow.activeTab.title); }},
      {type: "link",  selector:"a",   func: function(){ submit('link',  'contextMenu', click_info.link.url); }},
      {type: "image", selector:"img", func: function(){ submit('image', 'contextMenu', click_info.image.url); }}
    ],
    click_info = {};
var handle_cm = function(event){
  console.log('open cm', event);
  for(var i = 0; i < event.userInfo.length; i++){
    for(var j = 0; j < contexts.length; j++){
      if(event.userInfo[i].name == contexts[j].selector){
        click_info[contexts[j].type] = {url: event.userInfo[i].url, onclick: contexts[j].func};
        event.contextMenu.appendContextMenuItem(contexts[j].type, "Post "+contexts[j].type+" to Reading");
      }
    }
  }
  // if none of the selectors match, show "read page" context
  if(!event.contextMenu.contextMenuItems.length){
    event.contextMenu.appendContextMenuItem(contexts[0].type, "Post "+contexts[0].type+" to Reading");
  }
};

// attach listeners
safari.application.addEventListener("command", handle_command, false);
safari.application.addEventListener("contextmenu", handle_cm, false);
