require({
    baseUrl: 'assets/lib',
    paths : {
        'jquery': 'jquery-1.11.1.min',
        'd3': 'd3.min',
        'water': 'water'    
    },
    deps: [ // dependencies
    	"jquery",
    	"d3"
    ]
});
require([
    "water"
])