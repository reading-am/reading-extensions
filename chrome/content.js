var DOMAIN = '0.0.0.0:3000',
    head = document.getElementsByTagName('head')[0],
    loaded = false;

var load = function(){
  var vars = document.createElement('script'),
      script = document.createElement('script');

  vars.appendChild(document.createTextNode('var reading = {platform: "chrome"};'));
  script.src="http://"+DOMAIN+"/assets/bookmarklet/loader.js";

  head.appendChild(vars);
  head.appendChild(script);
  return true;
};

var submit = function(url, title){
  if(!loaded) loaded = load();
  var script = document.createElement('script'),
      title = title ? '"'+title+'"' : 'null';
  script.appendChild(document.createTextNode(
    'var r_submit = function(){ reading.submit({url:"'+url+'", title:'+title+'}) };'+
    'if(reading.ready) r_submit();'+
    'else document.addEventListener("reading.ready", r_submit);'
  ));
  head.appendChild(script);
};

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse){
    submit(request.url, request.title);
    sendResponse({}); // close the connection
  }
);

if(document.referrer.indexOf(DOMAIN) > -1){
  // if we came from Reading, auto post
  submit(document.location.href, document.title);
}
