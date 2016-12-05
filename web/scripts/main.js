require.config({
    baseUrl: "bower_components",
    paths : {
        "jquery": "jquery/dist/jquery.min",
        "angular": "angular/angular.min",
        "angular_ui_router" :"angular-ui-router/release/angular-ui-router.min",
        
        "app": "../app/app",
        "routes": "../app/routes",
        "main_ctr": "../app/controllers/main.ctr",

        "functions":"../app/scripts/functions"
    },
    shim : {
        "angular_ui_router": {
            "deps" :["angular"] 
        },
        "app" : {
            "deps" :["angular"] 
        },
        "routes" : {
            "deps" :["angular", "app"] 
        },
        "main_ctr" : {
            "deps" :["angular","routes"] 
        },
        "functions" : {
            "deps" :["jquery"] 
        }
    }
});

require([
    "jquery",
    "angular",
    "angular_ui_router",

    "app",
    "routes",
    "main_ctr"

    //"functions"
]);
