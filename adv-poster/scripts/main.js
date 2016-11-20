require.config({
    baseUrl: 'assets/lib',
    paths : {
        'jquery': 'jquery-1.11.1.min',
        'd3': 'd3.min',
        'water': 'water'    
    },
    shim : {
        "water" : {
            "deps" :['d3'] // dependencies
        }
    }
});

require([
    "jquery",
    "d3",
	"water"
])