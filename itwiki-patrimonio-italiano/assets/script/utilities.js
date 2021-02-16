const inhabitants_range = [{
	"a": {
		"min": 0,
		"max": 1000
	},
	"b": {
		"min": 1001,
		"max": 3000
	},
	"c": {
		"min": 3001,
		"max": 5000
	},
	"d": {
		"min": 5001,
		"max": 10000
	},
	"e": {
		"min": 10001,
		"max": 50000
	},
	"f": {
		"min": 50001,
		"max": 3000000
	}
}]

function the_inhabitants(value){
	if (value == 0){
		p_min = inhabitants_range[0].a.min;
		p_max = inhabitants_range[0].f.max;
	}
	else if (value == 1){
		p_min = inhabitants_range[0].a.min;
		p_max = inhabitants_range[0].a.max;
	}
	else if (value == 2){
		p_min = inhabitants_range[0].b.min;
		p_max = inhabitants_range[0].b.max;
	}
	else if (value == 3){
		p_min = inhabitants_range[0].c.min;
		p_max = inhabitants_range[0].c.max;
	}
	else if (value == 4){
		p_min = inhabitants_range[0].d.min;
		p_max = inhabitants_range[0].d.max;
	}
	else if (value == 5){
		p_min = inhabitants_range[0].e.min;
		p_max = inhabitants_range[0].e.max;
	}
	else {
		p_min = inhabitants_range[0].f.min;
		p_max = inhabitants_range[0].f.max;
	}
	return [p_min, p_max]
}

function mobile_menu() {
 	let open = false;
	let the_path = "";

	$("#mobile_menu_icon").click(function(){

		let display = $("#mobile_menu_icon").css('display')
		// console.log(display)

		if (open == false) {

			const path = window.location.pathname;

			if (path == ""){
				the_path = "";
			}
			else {
				the_path = "../";
			}
			console.log(path,the_path)

			$("#mobile_menu_icon").css("background","url(" + the_path + "assets/img/close-menu.svg) center center no-repeat").css("background-size","55%");
			$("#mobile_menu_box").show()
			open = true;
		}
		else {
			$("#mobile_menu_icon").css("background","url(" + the_path + "assets/img/mobile-menu.svg) center center no-repeat").css("background-size","55%");			
			$("#mobile_menu_box").hide()
			open = false;
		}
	})
}

$(document).ready(function() {
	mobile_menu();
})