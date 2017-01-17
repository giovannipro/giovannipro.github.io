$(document).ready(function(){
	dataviz();
	sidebar();
	download();
})

function dataviz(){
	// https://bl.ocks.org/mbostock/4062045

	var network = "data/category_network.json"; // category_network category_network_test
	var container = "#category_network_container";
	
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
    			return d.id + " node"
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
			.on("click",selection)

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

		function selection(d){
			//console.log(d)
		}
	});
}

function download(){
	// save svg
    $("#save").click(function () {
        var dataviz = $(".dataviz").html();  // #category_network_cont
        download(dataviz, "category_network.svg", "text/plain");
        console.log(dataviz);
    });  
    //console.log(2)
}

function sidebar() {

	var template_source = "tpl/category-network.tpl";
	var data_source = "data/category_network.json";
	var target = "#sidebar";

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

		// from sidebar to dataviz
		$(".list").on("click", "li" , function(){
			element = $(this).find(".id")
			id = element.attr("id");
			console.log(element);
			console.log(id);

			// reset dataviz - sidebar
			$("#category_network_cont .circle").removeClass("selected_circle");
			$("#sidebar .list li .id").removeClass("selected_list_item");			

			// sidebar
			element.toggleClass("selected_list_item");
    	
    		// dataviz
    		node_selected = $("#category_network_cont").find("." + id).children(".circle")		
    		node_selected.toggleClass("selected_circle");
   		});

		// from dataviz to sidebar 
		$(".node").on("click", function(){
			node = $(this).attr("class");
			element = node.split(" ",1).toString();

			// reset dataviz - sidebar
			$("#category_network_cont .circle").removeClass("selected_circle");
			$("#sidebar .list li .id").removeClass("selected_list_item");

			// dataviz
			node_selected = $(this).children(".circle")
			node_selected.toggleClass("selected_circle");
			//console.log(element)
			
			// sidebar
			selected = $("#sidebar").find("#" + element)
			selected.toggleClass("selected_list_item");
			//console.log(selected)
		})
	}

}
