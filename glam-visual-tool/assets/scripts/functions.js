$(document).ready(function(){
	d3.json("assets/data/data_1.json", dataviz_1);
	d3.json("assets/data/data_2.json", dataviz_2);
	d3.json("assets/data/data_3.json", dataviz_3);
	//dataviz_4();
	dataviz_5();
	//d3.json("assets/data/category_network.json", dataviz_4);
	//dataviz_5();
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
	//console.log(d);

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
	//console.log(d);
	
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
	//console.log(d)
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
	var proxy_ext = "http://crossorigin.me/";
	var proxy = "http://localhost:8000/Dropbox/Public/glam-visual-tool/assets/scripts/proxy.php" + "?url="; 
	
	var network = "assets/data/category_network.json";

	//var request = proxy_ext + nodes;
	var request = data_path;

	$.ajax({
		//dataType: "json",
		url: data_path, // data_path nodes
		//crossOrigin: true,
		//cache :false,
		//username: user,
   	 	//password: pswd,
		//headers: {Authorization: "'Bearer REDACTED"},
		//xhrFields: {
		//	withCredentials: true
		//},
		//headers: {
		//	"Authorization": "Basic " + btoa(user + ":" + pswd)
  		//},
		success: function(data) {
			//console.log(data)

			var container = document.getElementById("category_network_container");

			sigma.parsers.gexf(data_path, { // gexf json
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
		},
		fail: function(data, errorThrown,status) {
			console.log("error");
			console.log(data);
			console.log(errorThrown);
			console.log(status);
		}
		
	})
}

function dataviz_5(){
	// https://bl.ocks.org/mbostock/4062045

	var network = "assets/data/category_network.json"; // category_network category_network_test
	var container = "#category_network_cont";
	
	//var width = 1060,
	//	height = 1000;

	var svg = d3.select(container) //.append("svg")
		width = +svg.attr("width"),
		height = +svg.attr("height");   

	var plot = svg.append("g")
		//.attr("transform","translate(20,100)")

	var color = d3.scaleOrdinal(d3.schemeCategory20);

	d3.json(network, function(error, graph) {
		if (error) throw error;
		console.log(graph)

		var files = [];
  		graph.nodes.forEach(function(node) {
    		files.push(
    			node.files
    		);
    	})
  		var max_file = d3.max(files)
  		//console.log(max_file)

		var simulation = d3.forceSimulation()
			.force("link", d3.forceLink().id(function(d) { 
					return d.id; 
				})
				.distance(function(d,i){
					return max_file * 3.5
				})
				.strength(1)
			)
			//.force("link", d3.forceLink().distance(10).strength(0.5))
			.force("charge", d3.forceManyBody())
			.force("center", d3.forceCenter(width / 2, height / 2))
		
		var edges = plot.append("g")
			.attr("class", "links")
			.selectAll("line")
			.data(graph.edges)
			.enter()
			.append("line")

		var nodes = plot.append("g")
      		.attr("class", "nodes")
    		.selectAll(".node")
    		.data(graph.nodes)
    		.enter()
    		.append("g")
    		.attr("class",function(d,i){
    			return d.id
    		})  	
      		.call(d3.drag()
	          	.on("start", dragstarted)
	          	.on("drag", dragged)
	          	.on("end", dragended)
            )

      	var node_circle = nodes.append("circle")
			.attr("r", function(d,i){
				if (d.files == 0 || d.files == undefined ){
					return 5
				}
				else {
					if (d.files < 10) {
						return d.files + 10
					}
					else {
						return d.files
					}
				}	
			})
			.attr("fill", function(d) { 
				return  color(d.group); 
			})
			.attr("class","circle")

      	var label = nodes.append("text")
      		.attr("class", "labels")
      		.text(function(d) { 
      			return d.id;
      		})
      		.attr("text-anchor", "left")

		simulation
			.nodes(graph.nodes)
			.on("tick", ticked);

		simulation.force("link")
			.links(graph.edges);

		function ticked() {
			var x = 1
			edges
				.attr("x1", function(d) { return d.source.x * x; }) 
				.attr("y1", function(d) { return d.source.y * x; }) 
				.attr("x2", function(d) { return d.target.x * x; })
				.attr("y2", function(d) { return d.target.y * x; });

			nodes
				.attr("transform", function(d,i){
					return "translate(" + (d.x * x) + "," + (d.y* x) + ")"
				})

			var q = d3.quadtree(nodes),
      			i = 0,
      			n = nodes.length;
		}

		function dragstarted(d) {
			if (!d3.event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		}

		function dragged(d) {
		  	d.fx = d3.event.x;
		  	d.fy = d3.event.y;
		}

		function dragended(d) {
		  	if (!d3.event.active) simulation.alphaTarget(0);
		  	d.fx = null;
		  	d.fy = null;
		}

	});

}

function sidebar() {

	var template_source = 'assets/templates/category-network.tpl';
	var data_source = 'assets/data/category_network.json';
	var target = '#sidebar';

	$.get( template_source , function(tpl) {
		$.getJSON( data_source , function(data) {

			data.nodes.sort( function(a,b) { 
				return b.files - a.files; 
			});
			//console.log(data)

			var template = Handlebars.compile(tpl); 
			$(target).html(template(data));

			highlight()
		});
	});

	function highlight(){
		$(".list").on("click", "li" , function(){

			/*
			node = $(".nodes").find("g").find("circle")
			//node.css("transform","scale(1,1)")
			node.css("stroke","white")
			$(".list > li").find(".id").css("color","black");
			*/

			$(".list > li").removeClass("selected_list_item");
			$("#category_network_cont .circle").removeClass("selected_circle");

			element = $(this).find(".id").attr("id"); //.text() //.toString();
    		//console.log(element);

    		var scale = 2;

    		node_selected = $("#category_network_cont").find("." + element).children(".circle")
    		//console.log(node_selected)
    		
    		//node_selected.css("transform","scale(" + scale + "," + scale + ")")
    		node_selected.toggleClass("selected_circle");
    		$(this).toggleClass("selected_list_item");

		});
	}

}
sidebar();