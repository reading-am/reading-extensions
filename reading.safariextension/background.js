//-------//
// Setup //
//-------//
var handle_command = function(event){
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
var click_info = {};
var add_cm = function(event, type, data){
  click_info[type] = data;
  event.contextMenu.appendContextMenuItem(type, "Post "+type+" to Reading");
};

var contexts = [
  {type: "page",  func: function(){ submit('page', 'contextMenu', safari.application.activeBrowserWindow.activeTab.url, safari.application.activeBrowserWindow.activeTab.title); }},
  {type: "link",  selector:"a",   func: function(){ submit('link',  'contextMenu', click_info.link.url); }},
  {type: "image", selector:"img", func: function(){ submit('image', 'contextMenu', click_info.image.url); }}
];
var handle_cm = function(event){
  for(var i = 0; i < event.userInfo.length; i++){
    for(var j = 0; j < contexts.length; j++){
      if(event.userInfo[i].name == contexts[j].selector){
        add_cm(event, contexts[j].type, {url: event.userInfo[i].url, onclick: contexts[j].func});
      }
    }
  }
  // if none of the selectors match, show "read page" context
  if(!event.contextMenu.contextMenuItems.length){
    add_cm(event, contexts[0].type, {onclick: contexts[0].func});
  }
};

// attach listeners
safari.application.addEventListener("command", handle_command, false);
safari.application.addEventListener("contextmenu", handle_cm, false);
