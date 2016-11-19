require.config({
    baseUrl: 'bower_components',
    paths : {
        'jquery': 'jquery/dist/jquery.min',
        'bootstrap': 'bootstrap/dist/js/bootstrap.min',
        'd3': 'd3/d3.min',

        'functions':'../scripts/functions'      
    }
});
require([
    'jquery',
    'bootstrap',
    'd3',

    'functions'
]);