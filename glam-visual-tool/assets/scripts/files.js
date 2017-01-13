$(document).ready(function(){
	d3.json("assets/data/data_1.json", dataviz_2);
	download_1();
	sidebar();
})

/* -----------------------
main variables
------------------------- */

var w = window;
var width = 700, ///w.outerWidth,
height = 500//Math.round(width - (width / 3));

var margin = {top: 50, right: 50, bottom: 50, left: 50},
nomargin_w = width - (margin.left + margin.right),
nomargin_h = height - (margin.top + margin.bottom);

/* -----------------------
dataviz
------------------------- */

function dataviz_1(d){
	//console.log(d);

	container = "#files_upload_container"
	
	var svg = d3.select(container)
		.append("svg")
		.attr("viewBox", "0 0 " + width + " " + height)
		.attr("width",width)
		.attr("height",height)

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
			return y(d.count);
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
	console.log(d)
	container = "#files_upload_container"
	
	var svg = d3.select(container)
		.append("svg")		
		.attr("width",width)
		.attr("height",height)
		.attr("viewBox", "0 0 " + width + " " + height)

	var plot = svg.append("g")
		.attr("id", "d3_plot")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var parseTime = d3.timeParse("%Y/%m") // /%d
	
	date = []
	d.forEach(function(d) {
		time = d._id//.year
		date.push(time)//
	})
	//console.log(date)

	d.forEach(function(d) {
		d.date = parseTime(d.date);
		d.count = +d.count;
		//console.log(d.date + "-" + d.total);
	});

	// range
	var x = d3.scaleTime()
		.rangeRound([0, nomargin_w]);

	var y = d3.scaleLinear()
		.rangeRound([0, nomargin_h]);

	var	y_axis = d3.scaleLinear()
		.rangeRound([nomargin_h, 0]); //

	// domain
	x.domain(d3.extent(d, function(d) {
		return d.date; 
	}));
	y.domain(d3.extent(d, function(d) { 
		return d.count; 
	}));

	y_axis.domain(d3.extent(d, function(d) { 
		return d.count; 
	}));

	/*
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom")
	    //.tickFormat(d3.time.format("%Y-%m"));

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    //.ticks(10);*/

	plot.append("g")
		.attr("class", "axis axis-x")
		.attr("transform", "translate(0," + (height- (margin.left*2) ) + ")")
		.call(d3.axisBottom(x))	

	plot.append("g")
		.attr("class", "axis axis-y")
		.call(d3.axisLeft(y_axis))
		.style("text-anchor", "middle")

	var max = d3.max(d, function(d) {
		return +d.count;
	});
	//console.log(max)

	plot.append("g").attr("class","bars")
		.selectAll(".bars")
		.data(d)
		.enter()
		.append("rect")
		.attr("y", function(d) { 
			return y(max - d.count)
		})
		.attr("x", function(d,i) { 
			return x(d.date) //- (width/d.length)/2;
			//return ((nomargin_w) / 9) * i
		})
		.attr("height", function(d) { 
			return y(d.count);
		})
		.attr("class", function(d,i){
			return d.date + " " + d.count
		})
		.attr("width", nomargin_w / d.length)
		.style("fill", "steelblue")

	d3.selectAll(".tick > text")
  		.style("font-family", "verdana");
}

function download_1(){
	// save svg
	//setTimeout(function(){ 
	
	    $("#save").click(function () {
	        var dataviz = $(".dataviz").html();  // #category_network_cont
	        download(dataviz, "files.svg", "text/plain");
	        console.log(dataviz); 
	            
	    });  
	//}, 3000);
}

function sidebar() {

	var template_source = 'assets/templates/files.tpl';
	var data_source = 'assets/data/data_1.json';
	var target = '#sidebar';

	$.get( template_source , function(tpl) {
		$.getJSON( data_source , function(data) {

			/*data.nodes.sort( function(a,b) { 
				return b.files - a.files; 
			});*/
			//console.log(data)

			var template = Handlebars.compile(tpl); 
			$(target).html(template(data));

			//highlight()
		});
	});
}





