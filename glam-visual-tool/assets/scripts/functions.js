$(document).ready(function(){
	d3.json("assets/data/data_1.json", dataviz_1);
	d3.json("assets/data/data_2.json", dataviz_2);
	//dataviz_3();
	//console.log("ok")
})

/* -----------------------
main variables
------------------------- */

var w = window;
var width = 900, ///w.outerWidth,
height = Math.round(width - (width / 3));

var margin = {top: 50, right: 50, bottom: 50, left: 50},
nomargin_w = width - (margin.left + margin.right),
nomargin_h = height - (margin.top + margin.bottom);


/* -----------------------
get data
------------------------- */

function dataviz_1(d){
	console.log(d);

	container = "#files_upload_container"
	
	var svg = d3.select(container)
		.append("svg")
		.attr("viewBox", '0 0 ' + width + ' ' + (height) )

	var plot = svg.append("g")
		.attr("id", "d3_plot")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
	/*.
	append("text")
		.attr("fill", "#000")
		.attr("x", 0)
		.attr("dy", "1em")
		.attr("font-size","2em")
		.style("text-anchor", "start")
		.text("x")
	*/

	plot.append("g")
		.attr("class", "axis axis-y")
		.call(d3.axisLeft(y))
	/*
	.append("text")
		.attr("fill", "#000")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "1em")
		.attr("font-size","2em")
		.style("text-anchor", "end")
		.text("y")
	*/

	plot.append("path")
		.datum(d)
		.attr("class", "line")
		.attr("d", line)
		.attr("stroke","red")
		.attr("fill","transparent")
		.attr("stroke-width","2px")
}

function dataviz_2(d){
	console.log(d);
	
	var col_width = width / 8;
	var h = (height/3) - 10;
	
	var max_size = d3.max(d, function(d) {
		return +d.total;
	});
	var max_pages = d3.max(d, function(d) {
		return +d.pages;
	});

	// set range
	var y_size = d3.scaleLinear().range([0, h]); // [min max]
	var y_page = d3.scaleLinear().range([0, h]);

	// set domain
	y_size.domain([0, d3.max(d, function(d) {
		return d.total;
	})]);

	y_page.domain([0, d3.max(d, function(d) {
		return d.pages;
	})]);	

	// set plot
	container = "#files_metadata_container"

	var svg = d3.select(container)
		.append("svg")
		.attr("viewBox", '0 0 ' + width + ' ' + (height) )

	var plot = svg.append("g")
		.attr("id", "d3_plot")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// set graphical elements
	var bars = plot.append("g")
		.attr("id", "bars")

	// size
	var size = bars.selectAll("size")
		.data(d)
		.enter()
		.append("g")
		.attr("class","size")
		.attr("id",function(d,i){
			return d.size
		})

		.attr("transform",function(d,i){
			return "translate(" + ((col_width+col_width/2) * i) + "," + "0)"
		})

	size.append("rect")
		.attr("class","size_bar")
		.attr("width",col_width)
		.attr("fill","red")
		.attr("height",0)
		.attr("y", function(d,i){
			return y_size(max_size)
		})
		.transition()
		.attr("y", function(d,i){
			return y_size(max_size - d.total)
		})
		.attr("height",function(d,i){
			return y_size(d.total)
		})

	size.append("text")
		.text( function (d,i){
			return d.size
		})
		.attr("y",-10)

	// pages
	var pages = bars.selectAll("pages")
		.data(d)
		.enter()
		.append("g")
		.attr("class","pages")
		.attr("transform",function(d,i){
			return "translate(" + ((col_width+col_width/2) * i) + "," + (h+10) + ")"
		})

	pages.append("rect")
		.attr("class","pages_bar")
		.attr("width",col_width)
		.attr("height",0)
		.attr("y",0)
		.attr("fill","black")
		.transition()
		.attr("height",function(d,i){
			return y_page(d.pages)
		})

	// axis
	plot.append("g")
		.attr("class", "axis axis-y")
		.attr("transform", "translate(-10,0)")
		.call(d3.axisLeft(y_size))

	plot.append("g")
		.attr("class", "axis axis-y")
		.attr("transform", "translate(-10," + (h+10) + ")")
		.call(d3.axisLeft(y_page))


}

function dataviz_3(){
	console.log("x");
}
