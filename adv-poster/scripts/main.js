require.config({
    baseUrl: "bower_components",
    paths : {
        "jquery": "jquery/dist/jquery.min",
        "d3": "d3/d3.min",
        "water": "../scripts/water"  
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