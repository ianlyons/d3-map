var removeSpaces = function(string) {
  return string.replace(" ", "");
};

var width = 900,
    height = 600;

var projection = d3.geo.albersUsa()
    .scale(1200)
    .translate([width/2, height/2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#svgContain").append("svg")
    .attr("width", width)
    .attr("height", height);


// Join the two JSON files so the states are 
// linked with the demographic information
for(var i = 0; i < usaObj.features.length; i++) {
  usaObj.features[i].properties.future = pop[i].future;
  usaObj.features[i].properties.now = pop[i].now;
}


// Okay, now set up the data/DOM pairs
var paths =  svg.selectAll("path")
  .data(usaObj.features)
  .enter()
  .append("path")
  .attr("d", path);

paths.attr("class", function(d) { 
    return removeSpaces(d.properties.NAME); 
  })
.style("opacity", function(d) {
  var future = d.properties.future;
  var now = d.properties.now;
  var diff = future-now;
  return (diff/now)*20;
});


// Okay, now let's also set up the tooltips for more information
var toolTips = d3.select('body')
  .data(usaObj.features)
  .enter()
  .append("div")
  .attr("class", function(d) { return "state-tooltip " + 
    removeSpaces(d.properties.NAME); })
  .attr("style", function(d) {
    return "position: absolute; left: " + (path.centroid(d.geometry)[0]+100) + 
    "px; top: " + (path.centroid(d.geometry)[1]+120) + "px;";
  })
  .text(function(d) {
    var future = d.properties.future;
    var now = d.properties.now;
    var diff = future-now;
    return "The population growth rate for " + d.properties.NAME + 
    " is " + parseFloat((diff/now)*100).toFixed(2) + "%.";
  });


// Some jQuery to show and hide the tooltips
$(document).ready(function() {
  $('path').mouseenter(function(){
    var cl = $(this).attr('class');
      $('.state-tooltip.' + cl).css('visibility', 'visible');
  }).mouseleave(function() {
    var cl = $(this).attr('class');
    $('.state-tooltip.' + cl).css('visibility', 'hidden');
  });
});
