var DOMAIN = '0.0.0.0:3000';

var head = document.getElementsByTagName('head')[0],
    vars = document.createElement('script'),
    script = document.createElement('script');

vars.appendChild(document.createTextNode('var reading = {platform: "chrome"};'));
script.src="http://"+DOMAIN+"/assets/bookmarklet/loader.js";

head.appendChild(vars);
head.appendChild(script);
