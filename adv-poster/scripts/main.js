require.config({
    baseUrl: "bower_components",
    paths : {
        "jquery": "jquery/dist/jquery.min",
        "d3": "d3/d3.min",
        "water": "../assets/lib/water"  
    },
    shim : {
        "water" : {
            "deps" :["d3"] 
        }
    }
});

require([
    "jquery",
    "d3",
	"water"
])