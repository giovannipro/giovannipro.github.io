$(document).ready(function(){
	d3.json("assets/data/data_1.json", dataviz_1);
	d3.json("assets/data/data_2.json", dataviz_2);
	d3.json("assets/data/data_3.json", dataviz_3);
	dataviz_4()
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
		.attr("viewBox", "0 0 " + width + " " + height)

	var plot = svg.append("g")
		.attr("id", "d3_plot")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var parseTime = d3.timeParse("%Y/%m/%d")
	
	d.forEach(function(d) {
		d.date = parseTime(d.date);
		d.total = +d.total;
		//console.log(d.date + "-" + d.total);
	});

	// range
	var x = d3.scaleTime()
		.rangeRound([0, nomargin_w]);

	var y = d3.scaleLinear()
		.rangeRound([nomargin_h, 0]);

	// domain
	x.domain(d3.extent(d, function(d) {
		return d.date; 
	}));
	y.domain(d3.extent(d, function(d) { 
		return d.total; 
	}));

	/* line generator
	var line = d3.line()
		.curve(d3.curveStepBefore) //curveStep
		.x(function(d) {
				return x(d.date);
		})
		.y(function(d) { 
				return y(d.total);
		});
	*/

	// area generator
	var area = d3.area()
		.curve(d3.curveStepBefore)
		.x(function(d) {
			return x(d.date);
		})
		.y0(nomargin_h)
		.y1(function(d) { 
			return y(d.total);
	});

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
		.attr("class", "area") // area line
		.attr("d", area) // area line
		.attr("fill","black")
		.attr("stroke","transparent")
		.attr("stroke-width","2px")
}

function dataviz_2(d){
	console.log(d);
	
	var col_width = width / 8;
	var h = (height/2.2) - 20;
	var ticks = 5;
	
	var max_size = d3.max(d, function(d) {
		return +d.total;
	});
	var max_pages = d3.max(d, function(d) {
		return +d.pages;
	});
	//console.log(max_size)

	// set range
	var y_size = d3.scaleLinear().range([0,h]); // h,0  0,h [min max]
	var y_size_axis = d3.scaleLinear().range([h,0]); 
	var y_page = d3.scaleLinear().range([0,h]);

	// set domain
	y_size.domain([0, d3.max(d, function(d) {
		return d.total;
	})]);
	y_size_axis.domain([0, d3.max(d, function(d) {
		return d.total;
	})]);

	y_page.domain([0, d3.max(d, function(d) {
		return d.pages;
	})]);	

	// set plot
	container = "#files_metadata_container"

	var svg = d3.select(container)
		.append("svg")
		.attr("viewBox", "0 0 " + width + " " + (height) )

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
			return d.total
		})
		.attr("transform",function(d,i){
			return "translate(" + ((col_width+col_width/2) * i) + "," + "0)"
		})

	size.append("rect")
		.attr("class","size_bar")
		.attr("width",col_width)
		.attr("fill","red")
		.attr("y", function(d,i){
			return y_size(max_size) // y_size(d.total) //y_size(d.total) // max_size - 
		})
		.transition()
		.ease(d3.easeLinear) // easeBounce  easeElastic easeLinear
		.attr("height",function(d,i){
			return y_size(d.total)
		})
		.attr("y", function(d,i){
			return y_size(max_size - d.total) // y_size(d.total) //y_size(d.total) // max_size - 
		})


	size.append("text")
		.text( function (d,i){
			return  d.size
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
		.call(d3.axisLeft(y_size_axis)
			.ticks(ticks)
		)

	plot.append("g")
		.attr("class", "axis axis-y")
		.attr("transform", "translate(-10," + (h+10) + ")")
		.call(d3.axisLeft(y_page)
			.ticks(ticks)
		)
}

// average page views
function dataviz_3(d){
	console.log(d)
	/*
	for(var i=0; i<months; i++){
		month++;
 		d.push({
			time: Number(month * i),
			value: Math.random() * 1000
		});
		
	};
	console.log(d)
	*/

	// set plot
	container = "#pageviews_container"

	var svg = d3.select(container)
		.append("svg")
		.attr("viewBox", "0 0 " + width + " " + height )

	var plot = svg.append("g")
		.attr("id", "d3_plot")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// parse data
	var parseTime = d3.timeParse("%Y/%m/%d")

	d.forEach(function(d) {
		d.date = parseTime(d.date)
		d.pageviews = +d.pageviews;
	});

	var max_pv = d3.max(d, function(d) {
		return +d.pageviews;
	});
	//console.log(max_pv)

	// range (output)
	var x = d3.scaleTime()
		.rangeRound([0, nomargin_w]);

	var y = d3.scaleLinear()
		.rangeRound([nomargin_h, 0]);

	//domain (original data)
	var max = d3.max(d, function(d) {
		return +d.pageviews;
	});

	x.domain(d3.extent(d, function(d) {
		return d.date; 
	}));
	/*y.domain(d3.extent(d, function(d) { 
		return d.pageviews; 
	}));*/
	y.domain([0,max]);


	//line generator
	var line = d3.line()
		.curve(d3.curveStepBefore) // curveCatmullRom
		.x(function(d) {
			return x(d.date);
		})
		.y(function(d) { 
			return y(d.pageviews);
		});

	// area generator
	/*var area = d3.area()
		.curve(d3.curveStepBefore)
		.x(function(d) {
			return x(d.date);
		})
		.y0(nomargin_h)
		.y1(function(d) { 
			return y(d.pageviews);
	});*/
	
	plot.append("path")
		.data([d]) // datum(d) 
		.attr("class", "line") // area line
		.attr("d", line) // area line
		.attr("stroke","red")
		.attr("fill","transparent")
		.attr("stroke-width","1px")

	// axis
	plot.append("g")
		//.attr("transform","translate(0,0)")
		.call(d3.axisLeft(y))

	plot.append("g")
		//.attr("transform","translate(0,0)")
		.attr("transform", "translate(0," + (height - 100) + ")")
		.call(d3.axisBottom(x)
			//.ticks(d3.timeDay.every(30))
		)

}

function dataviz_4(){
	//console.log("sigma")

	var data_path = "assets/data/category_network.gexf";

	$.ajax({
		//dataType: "json",
		url: data_path,
		success: function(data) {
			//console.log(data)

			var container = document.getElementById("category_network_container");

			sigma.parsers.gexf(data_path, {
 				container: container,
 				type: "svg", // canvas svg
 				settings: {
 					defaultNodeColor: "black",
 					defaultEdgeColor: "#999",
 					hideEdgesOnMove: false,
 					batchEdgesDrawing: true,
 					//zoomMin: 0.8,
 					//zoomMax: 5
 				}
			});

		}
	})


}
