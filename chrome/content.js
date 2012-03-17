var DOMAIN = 'reading.am',
    PROTOCOL = 'https',
    VERSION = '1.1.1',
    head = document.getElementsByTagName('head')[0],
    loaded = false;

var load = function(){
  var vars = document.createElement('script'),
      script = document.createElement('script');

  vars.appendChild(document.createTextNode('var reading = {platform:"chrome",version:"'+VERSION+'"};'));
  script.src = PROTOCOL+"://"+DOMAIN+"/assets/bookmarklet/loader.js";

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

var loc = document.location.href,
    ref = document.referrer;
if(
  // don't post while still on Reading
  loc.indexOf(DOMAIN) == -1
  // don't post on oauth pages
  && loc.indexOf('/oauth/') == -1
  // account for http and https
  && (ref.indexOf(DOMAIN) == 7 || ref.indexOf(DOMAIN) == 8)
  // exclude auth and settings sections
  && ref.indexOf('/auth') == -1 && ref.indexOf('/hooks') == -1 && ref.indexOf('/info') == -1 && ref.indexOf('/extras') == -1
  ){
  // if we came from Reading, auto post
  submit(document.location.href, document.title);
}
