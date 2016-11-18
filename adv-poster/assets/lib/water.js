function get_data(){

    var cross_origin = 'https://crossorigin.me/'
    var API = 'http://www.oasi.ti.ch/web/rest/measure?domain=air&resolution=d&parameter=pm10&from=2016-11-05&to=2016-11-18&locations=Nabel_LUG'

    $.ajax({
        url: cross_origin + API,
    })
    .done(function(data) {
        console.log(data)

        pm10_min = 0;
        pm10_max =  75;
        pm10 =  $(data.locations)[0].data[12].values[0].value;

        console.log(pm10,pm10_min,pm10_max)

        water(pm10,pm10_min,pm10_max);
        save();
    });

}


/* -----------------------
main variables
------------------------- */

var w = window;
var width = w.outerWidth,
height = width - (width / 2);

var margin = {top: 50, right: 50, bottom: 50, left: 50},
nomargin_w = width - (margin.left + margin.right),
nomargin_h = width - (margin.top + margin.bottom);

/* -----------------------
sea variables
------------------------- */

var waves = 20,
v_translation = ((height/10) / waves);

/* -----------------------
set plot
------------------------- */

function water(index,min,max){

    var value = (500/max) * index // 0 - 500
    console.log(value)

    var svg = d3.select("#svg_container")
        .append("svg")
        .attr("id", "svg")
        .attr("viewBox", '0 0 ' + width + ' ' + (height) )

    var plot = svg.append("g")
        .attr("id", "d3_plot")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    /* -----------------------
    get data
    ------------------------- */

    var data = [];
    for (var i=0; i<waves; i++) { 
    	data.push({
    		x: i ,
    		y: Math.random(0, value)
    	})
    }
    //console.log(data)

    /* -----------------------
    scale
    ------------------------- */

    var max_x = d3.max(data, function(d) { return +d.x ;} );
    var max_y = d3.max(data, function(d) { return +d.y ;} );

    var xScale = d3.scale.linear()
    	.domain([0,max_x])
    	.range([0,width - margin.left - margin.right])

    var yScale = d3.scale.linear()
    	.domain([0,max_y])
    	.range([height - margin.top - margin.bottom,0])

    /* -----------------------
    visualize elements
    ------------------------- */

    var line = d3.svg.line()
    	.interpolate('basis')
        .x(function(d){
        	return xScale(d.x)
        })
        .y(function(d){
        	return (d.y * ( ((Math.random() * value) ) ) ) 
        });

    var onde = plot.selectAll('.wave')
        .data(data)
        .enter()
        .append('g')
        .attr('transform',function(d,i){
        	return 'translate(0,' +  ( v_translation * (Math.exp(i/3) ) ) + ')'
        }) // i/3
        .attr('class',function(d,i){
        	return i
        })
        .append('g')
        .attr('transform',function(d,i){
        	return 'scale(1,' + ((i/10)) + ')'
        })
        .append("path")
        .attr("d", function(d,i){
        	return line(data)
        })
        .attr("class", "line_a")
        .attr("stroke-dasharray","1, 4")
        .style("stroke", "white" )
        .attr('stroke-width','2px')
        .attr('fill', 'none')
}

function save(){
    $('#save').click(function () {
                
        var dataviz = $('#svg_container').html();
        console.log(dataviz);
        download(dataviz, "water.svg", "text/plain");
    });   
}

get_data();

