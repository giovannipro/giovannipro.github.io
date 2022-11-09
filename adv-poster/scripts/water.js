/* -----------------------
main variables
------------------------- */

var w = window;
var width = w.outerWidth,
	h = w.outerHeight,
	height = h;
	// console.log(height);

var margin = {top: 50, right: 50, bottom: 50, left: 50},
	nomargin_w = width - (margin.left + margin.right),
	nomargin_h = width - (margin.top + margin.bottom);

/* -----------------------
sea variables
------------------------- */

if (width < 500) {
	var waves = 10,
		height = h/2,
		v_translation = ((height/1) / waves);
}
else {
	var waves = 20,
		v_translation = ((height/3) / waves),
		height = h;
}

/* -----------------------
set plot
------------------------- */

function water(data,value){
	console.log(data)

	var svg = d3.select("#svg_container")
		.append("svg")
		.attr("id", "svg")
		.attr("viewBox", "0 0 " + width + " " + (height) )
		.attr("fill","#1625B8");

	var plot = svg.append("g")
		.attr("id", "d3_plot");
		//.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	/* -----------------------
	scale
	------------------------- */

	var max_x = d3.max(data, function(d) { return +d.x ;} );
	var max_y = d3.max(data, function(d) { return +d.y ;} );

	var xScale = d3.scale.linear()
		.domain([0,max_x])
		//.range([0,width - margin.left - margin.right])
		.range([0,width]);

	var yScale = d3.scale.linear()
		.domain([0,max_y])
		.range([height - margin.top - margin.bottom,0]);

	/* -----------------------
	visualize elements
	------------------------- */

	var line = d3.svg.line()
		.interpolate("basis")
		.x(function(d){
			return xScale(d.x);
		})
		.y(function(d){
			return (d.y * ( ((Math.random() * value ) ) ) ) ;
		});

	var onde = plot.selectAll(".wave")
		.data(data)
		.enter()
		.append("g")
		.attr("transform",function(d,i){
			return "translate(0," +  ( v_translation * (Math.exp(i/3))) + ")"
		}) // i/3
		.attr("class",function(d,i){
			return i
		})
		.append("g")
		.attr("transform",function(d,i){
			return "scale(1," + ((i/10)) + ")"
		})
		.append("path")
		.attr("d", function(d,i){
			return line(data)
		})
		.attr("class", "line_a")
		//.attr("stroke-dasharray","1, 4")
		.attr("opacity","0.6")
		.style("stroke", "white" )
		.attr("stroke-width","2px")
		.attr("fill", "none")

	var horizon = plot.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", width)
		.attr("y2", 0)
		.attr("stroke", "white")
		.attr("opacity","0.2")
}

function wave_maker(index,min,max){
	var data = [];

	for (var i=0; i<waves; i++) { 
		data.push({
			x: i ,
			y: Math.random()
		});
	}
	
	//console.log(data)
	var value = (250/max) * index;
	water(data,value);
}

function get_data(param,cache){

	var baseurl =  window.location.protocol + "//" + window.location.host + "/" + "giovannipro.github.io/adv-poster/"
	// https://cors-anywhere.herokuapp.com/http://www.oasi.ti.ch/web/rest/measure?domain=air&resolution=h&locations=Nabel_LUG&parameter=pm10

	var api = "https://www.oasi.ti.ch/web/rest/measure?domain=air&resolution=h&locations=Nabel_LUG";
	  api_2 = "https://www.oasi.ti.ch/web/rest/measure?domain=air&resolution=d&locations=air_Nabel_LUG"; //parameter=no2&from=2021-01-21&to=2021-02-03&locations=air_Nabel_LUG"

	var oasi_proxy = baseurl + "assets/lib/proxy.php" +  "?url=" ,
		cross_origin = "http://crossorigin.me/",
		cors = "http://cors.io/?",
		benalman_proxy = "http://benalman.com/code/projects/php-simple-proxy/ba-simple-proxy.php?url=",
		my_proxy = "http://www.gprofeta.it/utilities/proxy.php" + "?url=",

		cors_api = "https://cors-anywhere.herokuapp.com/";

	function add_zero(x){
		if (x < 10) {
			return "0" + x 
		}
		else {
			return x
		}
	}

	var d = new Date(),
		year = d.getFullYear(),
		month_ = d.getMonth() + 1,
		day_ = d.getDate();
		hour_ = d.getHours();

		month = add_zero(month_);
		day = add_zero(day_);
		hour = add_zero(hour_);
		//console.log(hour)

	var time = year + month + day + "T" + hour,
		date = year + "-" + month + "-" + day + "&" + year + "-" + month + "-" + day,
		request =  api_2 + "&parameter=" + param + "&from=" + date;
		cors_request = request; // cors_api cors
	   // console.log(cors_request);
	   // req = oasi_proxy + request;
	   // req = "assets/data/data.json";
	   req = request;

	let headers = new Headers();
		headers.append("Access-Control-Allow-Origin","http://localhost:8000"); // https://www.oasi.ti.ch
	    headers.append('Access-Control-Allow-Credentials', true);
	    headers.append('Access-Control-Allow-Origin', '*');
	   	headers.append('Access-Control-Allow-Methods', 'GET');
	    headers.append('Origin','x-requested-with'); // 'http://localhost:8000
    // console.log(headers);

    fetch(req, {
	        mode: 'cors',
	        method: 'GET',
	        headers: headers
	    })
		.then(function (response) {
			console.log(request)

			response.json().then((data) => {
        		// console.log(data);

        		let values = data.locations[0].data;
        		// console.log(values);

				var found = (function search () { 
					for (var i = values.length - 1; i >= 0; i--) {
						// if(values[i].values[0].value !== null) {
						if(values[i].values[0].value !== undefined) {
							return values[i];
						}
					}
				})();

				let time = found.date,
				value = found.values[0].value;
				// console.log(found)
				// console.log(value)

				min = 0;

				match = year + "-" + month + "-" + day + hour;

				if (param == "pm10"){
					max =  75; // 100
				}
				if (param == "o3"){
					max =  150; // 300
				}
				if (param == "no2"){
					max =  100;
				}
				console.log(time, value + "/" + max);

				var dates = $(data.locations)[0].data;
				var x = $(data.locations)[0].data[0].date;
				var y = $(data.locations)[0].data[0].values[0].value;
				// //console.log(y)

				var index = 0;

				wave_maker(value,min,max);
				$('#no_data').empty();

				$.each( dates, function( a,b ) {

					index++;

					var interval = 1000;
					var date_string = b.date.toString().substring(0,13);

					if (date_string == match) {

						var value = b.values[0].value;
						//console.log(value);

						if (value !== null) {
						   //console.log(date_string + ' - ' + match + ' - ' + value)

							var percentage = (value * 100) / max;
							$('#no_data').empty();
							wave_maker(value,min,max);
							
							var load = 0
							
							console.log(/*b.date.toString() + ' - ' + */ param + ": " + value + "/" + max + " (" + percentage.toFixed(0) + "%)");
							return false; 
						}
						else {
							
							$('#no_data').empty();
							$('#no_data').append('<div style="height100%;">no data available <i class="fa fa-exclamation-triangle" aria-hidden="true"></i></div>');
							//wave_maker(0,min,max);
							
							load++

							console.log(request);
						}
					}
				});
				save(time);

	    	});
		})
		.catch(() => console.log("Can’t access " + cors_request + " response. Blocked by browser?"))

}

function save(time){
	$("#save").click(function () {

		var dataviz = $("#svg_container").html();
		//console.log(dataviz);
		download(dataviz, "pm10_lugano_" + time +".svg", "text/plain");
	});   
}

function buttons(){

	$("#pm10").click(function () {
		$(".param").addClass("param_no");
		$(this).removeClass("param_no");
		$("#svg_container").empty();
		//location.reload();
		get_data("pm10");
	})
	$("#no2").click(function () {
		$(".param").addClass("param_no");
		$(this).removeClass("param_no");
		$("#svg_container").empty();
		get_data("no2");
	})
	$("#o3").click(function () {
		$(".param").addClass("param_no");
		$(this).removeClass("param_no");
		$("#svg_container").empty();
		get_data("o3");
	})

	//$(".param").toggleClass("param_no");
	$("#pm10").toggleClass("param_no");
}

function accelerometer(){

	function check_orientation(){

		window.ondevicemotion = function(event) {
			var alpha = event.accelerationIncludingGravity.x;
			var beta = event.accelerationIncludingGravity.y;
			var gamma = event.accelerationIncludingGravity.z;

			var reduction = 3;
			var scale_x = 1;

			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				if (width < 500) {
					if (beta < 4 && beta > -4 ) {  // 
				// smartphone appoggiato - orizzonte alto
					var beta = Math.abs(beta);
					$("#svg_container")
						.css("-webkit-transform","scale(" + scale_x + "," + (scale_x * (5-beta) ) +")")
						.css("-ms-transform","scale(" + scale_x + "," + (scale_x * (5-beta) ) +")")
						.css("transform","scale(" + scale_x + "," + (scale_x * (5-beta)) +")")
					//console.log( alpha + ',' + beta + ',' + gamma);
				}
				else { //   if (beta < -1 )  
				// smartphone alzato - orizzonte basso
					$("#svg_container")
						.css("-webkit-transform","scale(" + scale_x + ",1)")
						.css("-ms-transform","scale(" + scale_x + ",1)")
						.css("transform","scale(" + scale_x + ",1)") 
					//console.log( alpha + ',' + beta + ',' + gamma);
				}
				//console.log( alpha + ',' + beta + ',' + gamma);
				}
			}
			else{
				if (beta > 4 ) {
					// computer abbassato - orizzonte alto
					$("#svg_container")
						.css("-webkit-transform","scale(" + scale_x + "," + (beta/reduction) +")")
						.css("-ms-transform","scale(" + scale_x + "," + (beta/reduction) +")")
						.css("transform","scale(" + scale_x + "," + (beta/reduction) +")")
					//
				}
				else if (beta < -1 ) {
					// computer alzato - orizzonte basso
					var beta = Math.abs(beta);
					$("#svg_container")
						.css("-webkit-transform","scale(" + scale_x + "," + (scale_x/beta) +")")
						.css("-ms-transform","scale(" + scale_x + "," + (scale_x/beta) +")")
						.css("transform","scale(" + scale_x + "," + (scale_x/beta) +")")
				}
				else {
					// computer appoggiato - orizzonte medio
					$("#svg_container")
						.css("-webkit-transform","scale(" + scale_x + ",1)")
						.css("-ms-transform","scale(" + scale_x + ",1)")
						.css("transform","scale(" + scale_x + ",1)") 
				}
				//console.log( alpha + ',' + beta + ',' + gamma);
			}
		}
	};
	setTimeout(check_orientation, 500);
}

get_data("pm10")
buttons();
accelerometer();
