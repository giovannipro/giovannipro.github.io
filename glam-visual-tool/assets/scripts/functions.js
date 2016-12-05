$(document).ready(function(){
	d3.json("assets/data/data.json", dataviz);
	console.log("ok")
})

/* -----------------------
main variables
------------------------- */

var w = window;
var width = w.outerWidth,
height = width - (width / 3);

var margin = {top: 50, right: 50, bottom: 50, left: 50},
nomargin_w = width - (margin.left + margin.right),
nomargin_h = height - (margin.top + margin.bottom);

/* -----------------------
set plot
------------------------- */

var svg = d3.select("#svg_container")
	.append("svg")
	.attr("viewBox", '0 0 ' + width + ' ' + (height) )

var plot = svg.append("g")
    .attr("id", "d3_plot")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* -----------------------
get data
------------------------- */

function dataviz(d){
	console.log(d);

	var parseTime = d3.timeParse("%Y-%m-%d")
    //d3.timeFormat("%Y-%m-%d");  // -%m-%d // timeParse

	var x = d3.scaleTime()
    	.rangeRound([0, nomargin_w]);

	var y = d3.scaleLinear()
    	.rangeRound([nomargin_h, 0]);

	d.date = parseTime(d.date);
	d.total = +d.total;
	
	var line = d3.line()
		.x(function(d) {
			return x(d.date);
		})
		.y(function(d) { 
			return y(d.total);
		});

	x.domain(d3.extent(d, function(d) {
		return d.date; 
	}));
  	y.domain(d3.extent(d, function(d) { 
  		return d.total; 
  	}));

  	plot.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  	plot.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .style("text-anchor", "end")
      .text("y");

  	plot.append("path")
      .datum(d)
      .attr("class", "line")
      .attr("d", line)
      .attr("stroke","red")
      .attr("fill","transparent")
}


