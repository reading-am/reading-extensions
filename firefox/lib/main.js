const widgets = require("widget");
const tabs    = require("tabs");
const data    = require("self").data;

var widget = widgets.Widget({
  id: "reading-link",
  label: "Reading",
  contentURL: data.url("icon16.png"),
  onClick: function() {
    tabs.open("https://reading.am");
  }
});

console.log("The add-on is running.");
