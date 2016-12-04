app.config(function ($stateProvider, $urlRouterProvider) {  

	$urlRouterProvider.otherwise("/");

	$stateProvider
	.state("home",{
 		url : "/",
	    views:  { 
	      	"main": {
	      		templateUrl: "app/templates/index.tpl",
				controller: "main_controller",
	      	}
	    }
	})
	
	.state("notes",{
 		url : "/notes",
	    views:  { 
	      	"main": {
	      		templateUrl: "app/templates/notes.tpl",
				controller: "note_controller",
	      	}
	    }
	})

});