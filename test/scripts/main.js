require.config({
    baseUrl: "bower_components",
    paths : {
        "jquery": "jquery/dist/jquery.min",
        "bootstrap": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min",
        "d3": "d3/d3.min",
        "canvas-toBlob": "canvas-toBlob/canvas-toBlob",

        "react-dom":"react/react-dom",
        "react": "react/react-with-addons.min",
        "babel": "requirejs-react-jsx/babel-5.8.34.min",
        "jsx":"requirejs-react-jsx/jsx",
        "text":"requirejs-text/text",

        "functions":"../scripts/functions"
    },
    shim : { // dependencies
        "functions" : {
            "deps" :["jquery"] 
        },
        "react": {
            "exports": "React"
        }
    },
    config: {
        babel: {
            sourceMaps: "inline", // One of [false, "inline", "both"]. See https://babeljs.io/docs/usage/options/
            fileExtension: ".jsx" // Can be set to anything, like .es6 or .js. Defaults to .jsx
        }
    }
});

require([
    "react-dom",
    "functions"
]);

/*
require(["jsx!../scripts/app"], function(App){
    var app = new App();
    app.init();
});

*/
