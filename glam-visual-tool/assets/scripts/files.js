$(document).ready(function(){
	d3.json("assets/data/data_1.json", dataviz_2);
	//d3.json("assets/data/user_file_count_1.json", dataviz_3); //  
	download_1();
	sidebar();
	//buttons();
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

/*
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

	plot.append("g")
		.attr("class", "axis axis-y")
		.call(d3.axisLeft(y))

	plot.append("path")
		.datum(d)
		.attr("class", "area") // area line
		.attr("d", area) // area line
		.attr("fill","black")
		.attr("stroke","transparent")
		.attr("stroke-width","2px")
}
*/

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
	
	/*
	date = []
	d.forEach(function(d) {
		time = d._id//.year
		date.push(time)//
	})
	//console.log(date)
	*/

	d.forEach(function(d) {
		d.date = parseTime(d.date);
		d.count = +d.count;
		//console.log(d.date + "-" + d.total);
	});

	// range
	var x = d3.scaleTime()
		.rangeRound([0, nomargin_w])

	var y = d3.scaleLinear()
		.rangeRound([nomargin_h, 0]);

	/*var	y_axis = d3.scaleLinear()
		.rangeRound([nomargin_h, 0]); //*/

	// domain
	x.domain(d3.extent(d, function(d) {
		return d.date; 
	}));

	// estensione dati
	/*y.domain(d3.extent(d, function(d) {  //
		return d.count; 
	}));*/
	// da 0 a max
	y.domain([0, d3.max(d, function(d) {
		return d.count; 
	})]);

	plot.append("g")
		.attr("class", "axis axis-x")
		.attr("transform", "translate(0," + (height - (margin.left*2) ) + ")")
		.call(d3.axisBottom(x))
		.selectAll("text")
			.attr("y", 5)
			.attr("x", 5)
			.style("text-anchor", "start");

	plot.append("g")
		.attr("class", "axis axis-y")
		.call(d3.axisLeft(y))

	var max = d3.max(d, function(d) {
		return +d.count;
	});
	//console.log(max)

	plot.append("g")
		.attr("class","bars")
		.attr("y",0)
		.attr("x",0)

		.selectAll(".bars")
		.data(d)
		.enter()
		.append("rect")
		.attr("y", function(d) { 
			return y(d.count) // y(max - d.count)
		})
		.attr("x", function(d,i) { 
			return x(d.date) //- (width/d.length)/2;
			//return ((nomargin_w) / 9) * i
		})
		.attr("height", function(d) { 
			return nomargin_h - y(d.count) //; y(d.count)
		})
		.attr("class", function(d,i){
			return d.date + " " + d.count
		})
		.attr("width", nomargin_w / d.length)
		.style("fill", "steelblue")

	d3.selectAll(".tick > text")
  		.style("font-family", "verdana");
}

function dataviz_3(d){
	console.log(d)

	container = "#files_upload_container"

	var svg = d3.select(container)
		.append("svg")		
		.attr("width",width)
		.attr("height",height)
		.attr("viewBox", "0 0 " + width + " " + height)

	var plot = svg.append("g")
		.attr("id", "d3_plot")
		//.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var parseTime = d3.timeParse("%Y/%m") // /%d

	// nest 
  	users = d3.nest()
    	.key(function(d) {
    		return d.user;
    	})
    	.entries(d);
    
	users.forEach(function(d) {
		d.values.forEach(function(d) { 
			d.date = parseTime(d.date); //parse(d.date); 
			d.count = +d.count;
		});
    	d.max = d3.max(d.values, function(d) {
    		return d.count; 
    	});

		/*d.user = d.user
		d.date = parseTime(d.date);
		d.count = +d.count;*/
	});

	users.sort(function(a, b) { 
    	return a.count - b.count; 
    });
    console.log(users)

	// range
	var x = d3.scaleTime()
		.rangeRound([0, nomargin_w])

	var y = d3.scaleLinear()
		.rangeRound([nomargin_h, 0]);

	/*var	y_axis = d3.scaleLinear()
		.rangeRound([nomargin_h, 0]); //*/

	// domain
	x.domain(d3.extent(d, function(d) {
		return d.date; 
	}));
	y.domain([0, d.max]);

	user = plot.selectAll("g")
		.data(users)
		.enter()
		.append("g")
		.attr("class",function (d,i){
			return d.values[0].user
		})
		.attr("transform", function (d,i) {
			return "translate(0," + (nomargin_h / users.length) * i + ")"
		})

	bars = user.append("g")
		.attr("class","bars")
		.attr("y",0)
		.attr("x",0)

	var g = svg.selectAll(".bars");

	g.each(function(p, j) {
		d3.select(this).selectAll("rect")
			.data(function(d) { return d.values; })
			.enter()
			.append("rect")
			.attr("x", function(d) { 
				return x(d.date) ; 
			})
        	.attr("y", function(d) { 
        		return 10 //y(d.count); 
        	})
       		.attr("width", width / d.length )
        	.attr("height", function(d,i) { 
        		return (nomargin_h / 4) // y(d.count) //(nomargin_h / d.length) - (nomargin_h - y(d.count)); 
        	})
        	.attr("fill", function(d,i){
        		if (d.user == "ETH-Bibliothek"){
        			return "red"
        		}
        		else {
        			return "black"
        		}
        	})		
	})
	console.log(users[0].values[0].user)
	console.log(users[0].values.length)

	plot.append("g")
		.attr("class", "axis axis-x")
		.attr("transform", "translate(0," + (height- (margin.left*2) ) + ")")
		.call(d3.axisBottom(x)
			.ticks(5)
		)	

	plot.append("g")
		.attr("class", "axis axis-y")
		.call(d3.axisLeft(y))
		.style("text-anchor", "middle")

	/*
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
  	*/


}

function download_1(){
	// save svg
	
    $("#save").click(function () {
        var dataviz = $(".dataviz").html();  // #category_network_cont
        download(dataviz, "files.svg", "text/plain");
        console.log(dataviz); 
            
    });  
}

function sidebar() {

	
	// overall
	var template_source = 'assets/templates/files.tpl';
	var data_source = 'assets/data/data_1.json';
	var target = '#sidebar';

	$.get( template_source , function(tpl) {
		$.getJSON( data_source , function(data) {

			//data.nodes.sort( function(a,b) { 
			//	return b.files - a.files; 
			//});
			//console.log(data)

			var template = Handlebars.compile(tpl); 
			$(target).html(template(data));

			//highlight()
		});
	});
	

	/*
	// per user
	var template_source = 'assets/templates/users_file.tpl';
	var data_source = 'assets/data/users_file.json';
	var target = '#sidebar';

	$.get( template_source , function(tpl) {
		$.getJSON( data_source , function(data) {

			var template = Handlebars.compile(tpl); 
			$(target).html(template(data));

			//highlight()
		});
	});
	*/
}

function buttons(){
	$("#overall").click(function () {
		$("#files_upload_container").empty();
		d3.json("assets/data/data_1.json", dataviz_2);
		//console.log("overall")
	})
	$("#users").click(function () {
		$("#files_upload_container").empty();
		d3.json("assets/data/users_file_count.json", dataviz_3);
	})
}



