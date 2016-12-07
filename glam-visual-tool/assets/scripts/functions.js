$(document).ready(function(){
	d3.json("assets/data/data.json", dataviz_1);
	//console.log("ok")
})

/* -----------------------
main variables
------------------------- */

var w = window;
var width = 1000, ///w.outerWidth,
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

function dataviz_1(d){
    console.log(d);

    var parseTime = d3.timeParse("%Y/%m/%d")
    
    d.forEach(function(d) {
        d.date = parseTime(d.date);
        d.total = +d.total;
        //console.log(d.date + '-' + d.total);
    });

    var x = d3.scaleTime()
        .rangeRound([0, nomargin_w]);

    var y = d3.scaleLinear()
        .rangeRound([nomargin_h, 0]);

    var line = d3.line()
        .curve(d3.curveStep)
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
        .attr("class", "axis axis-x")
        .attr("transform", "translate(0," + (height - 100) + ")")
        .call(d3.axisBottom(x))
    .append("text")
        .attr("fill", "#000")
        .attr("x", 0)
        .attr("dy", "1em")
        .attr("font-size","2em")
        .style("text-anchor", "start")
        .text("x")

    plot.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y))
    .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "1em")
        .attr("font-size","2em")
        .style("text-anchor", "end")
        .text("y")

    plot.append("path")
        .datum(d)
        .attr("class", "line")
        .attr("d", line)
        .attr("stroke","red")
        .attr("fill","transparent")
        .attr("stroke-width","2px")
}