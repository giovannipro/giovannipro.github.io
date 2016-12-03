/* -----------------------
main variables
------------------------- */

var w = window;
var width = w.outerWidth,
height = width - (width / 3);

var margin = {top: 50, right: 50, bottom: 50, left: 50},
nomargin_w = width - (margin.left + margin.right),
nomargin_h = width - (margin.top + margin.bottom);

/* -----------------------
sea variables
------------------------- */

if (width < 500) {
    var waves = 10;
    var v_translation = ((height/3) / waves);  
}
else{
   var waves = 20;  
   var v_translation = ((height/10) / waves); 
}

/* -----------------------
set plot
------------------------- */

function water(data,value){
    //console.log(data)

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
    var value = (300/max) * index;
    water(data,value);
}

function get_data(param,cache){

    var baseurl =  window.location.protocol + "//" + window.location.host + "/" + "giovannipro.github.io/adv-poster/"
    
    var oasi_proxy = baseurl + "assets/lib/proxy.php" +  "?url=" ;
    var cross_origin = "http://crossorigin.me/";
    var cors = "http://cors.io/?";
    var cors_api = "https://cors-anywhere.herokuapp.com/"

    var api = "http://www.oasi.ti.ch/web/rest/measure?domain=air&resolution=h&locations=Nabel_LUG";

    var d = new Date(),
        year = d.getFullYear(),
        month = d.getMonth() + 1,
        day = d.getDate();
        hour = d.getHours();

    if (day < 10) {
        day = "0" + d.getDate()
    }
    else {
        d.getDate()
    }

    var time = year + month + day + "T" + hour,
        date = year + "-" + month + "-" + day + "&" + year + "-" + month + "-" + day,
        request =  api + "&parameter=" + param + "&from=" + date;
        cors_request = cors_api + request;
    //console.log(request);

    /*
    if (cache == 1){ // 0: cache; 1: no_cache
        cache = false
    }
    else {
        cache = true
    }
    */

    // match
    var anticipation = 2;
    if (day < 10){
        day = day;
        if (hour < 10) {
            if (hour == anticipation || hour < anticipation){
                day = "0" + (day - 1);
                hour = "T" + (23 - (anticipation-1) );
            }
            else {
                hour = "T0" + (hour - anticipation);
            }
        }
        else {
            hour = "T" + (hour - anticipation);  
        }
    }
    else {
        day = day;
        if (hour < 10) {
            if (hour == anticipation || hour < anticipation) {
                day = (day - 1);
                hour = "T" + (23 - (anticipation-1) );
            }
            else {
                hour = "T0" + (hour - anticipation);
            }
        }
        else{
            hour = "T" + (hour - anticipation);
        }
    }
    match = year + "-" + month + "-" + day + hour;
    //console.log(match); 
    
    $.ajax({
        url: cors_request,
        cache: cache,
        beforeSend: function(){
            $('#no_data').html(
                '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'
            );
            //console.log("loading")
        },
        success: function(data) {
            //console.log(data)

            min = 0;

            if (param == "pm10"){
                max =  100;
            }
            if (param == "o3"){
                max =  150;
            }
            if (param == "no2"){
                max =  100;
            }

            var dates = $(data.locations)[0].data;
            var x = $(data.locations)[0].data[0].date;
            var y = $(data.locations)[0].data[0].values[0].value;
            //console.log(y)

            if (hour < 10) {
                hour = "0" + (hour - 1);
            }

            var index = 0;

            jQuery.each( dates, function( a,b ) {

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
                        
                        console.log(b.date.toString() + ' - ' + param + ": " + value + "/" + max + " (" + percentage.toFixed(0) + "%)");
                        return false; 
                    }
                    else {
                        
                        $('#no_data').empty();
                        $('#no_data').append('<div style="height100%;">no data available <i class="fa fa-exclamation-triangle" aria-hidden="true"></i></div>');
                        wave_maker(0,min,max);
                        
                        load++

                        console.log(request);
                        console.log(b.date.toString() + ' - ' + param + ": " + b.values[0].value)
                        
                        //get_data(param,1) // 0: cache; 1: no_cache
                        //return false; 
                    }
                }
                else{
                    //console.log("no values error")
                    //console.log(date_string + ' - ' + match + ' - ' + value)

                    //clearInterval(interval);
                    //$('#no_data').empty();
                    //
                    //wave_maker(0,0,100);
                    //return false;
                }
            }) ;       
            save(time);
        },
        fail: function() {
            wave_maker(0,0,100);
            console.log("api error")
        }
    })
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
    $("#03").click(function () {
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

            // avanti-indietro
            if (beta > 4 ) { // || alpha < -3  || alpha > 3 

                $("#svg_container")
                    .css("-webkit-transform","scale(" + scale_x + "," + (beta/reduction) +")")
                    .css("-ms-transform","scale(" + scale_x + "," + (beta/reduction) +")")
                    .css("transform","scale(" + scale_x + "," + (beta/reduction) +")")
                //console.log( alpha + ',' + beta + ',' + gamma);

                /*
                $("#svg")
                    .css("-webkit-transform","rotate(-" + (alpha * (reduction*2) ) +"deg)")
                    .css("-ms-transform","rotate(-" + (alpha * (reduction*2) ) +"deg)")
                    .css("transform","rotate(-" + (alpha * (reduction*2) ) +"deg)");
                */
            }
            else {
                $("#svg_container")
                    .css("-webkit-transform","scale(" + scale_x + ",1)")
                    .css("-ms-transform","scale(" + scale_x + ",1)")
                    .css("transform","scale(" + scale_x + ",1)")
                
                /*
                $("#svg")
                    .css("-webkit-transform","rotate(0deg)")
                    .css("-ms-transform","rotate(0deg)")
                    .css("transform","rotate(0deg)");
                */    
            }
        }
    };

    setTimeout(check_orientation, 1000);
}

get_data("pm10")
buttons();
accelerometer();
