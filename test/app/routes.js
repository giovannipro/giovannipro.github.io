app.config(function ($stateProvider, $urlRouterProvider) {  

	$urlRouterProvider.otherwise("/");

	$stateProvider
	.state("home",{
 		url : "/",
 		//abstract: true,
	    views:  { 
	      	"main": {
	      		templateUrl: "app/templates/index.tpl",
				controller: "main_controller",
	      	}
	    }
	})
	
	.state("note",{
 		url : "/note",
	    views:  { 
	      	"main": {
	      		templateUrl: "app/templates/index.tpl",
				controller: "main_controller",
	      	}
	    }
	})

	//$urlRouterProvider.otherwise('/');
});
/*

app.config(function ($stateProvider, $urlRouterProvider) {  

	$urlRouterProvider.otherwise('index');

	$stateProvider
	.state('ricette',{
 		url : "/index",
	    views:  { 
	      	'main': {
	      		templateUrl: 'app/templates/index.tpl',
				controller: 'main_controller',
	      	}
	    }
	})

	.state('note',{
 		url : "/note",
	    views:  { 
	      	'main': {
	      		templateUrl: 'app/templates/notes.tpl',
				controller: 'notes_controller',
	      	}
	    }
	})
});
*/