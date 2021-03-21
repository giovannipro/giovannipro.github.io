const inhabitants_range = [{
	"a": {
		"min": 0,
		"max": 3000
	},
	"b": {
		"min": 3001,
		"max": 20000
	},
	"c": {
		"min": 20001,
		"max": 50000
	},
	"d": {
		"min": 50001,
		"max": 3000000
	}
}]

function the_inhabitants(value){
	if (value == 0){
		p_min = inhabitants_range[0].a.min;
		p_max = inhabitants_range[0].d.max;
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
	return [p_min, p_max]
}

function mobile_menu() {
 	let open = false;
	let the_path = "";

	$("#mobile_menu_icon").click(function(){

		let path = window.location.pathname;
		let display = $("#mobile_menu_icon").css('display')
		// console.log(display)

		if (open == false) {

			if (path.indexOf("regioni") == -1){ 
				the_path = "";
				// console.log(path.indexOf("regioni"))
			}
			else {
				the_path = "../";
			}
			// console.log(path,the_path)

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

function mobile_filter() {
 	let open = false;
	let the_path = "";


	$("#mobile_filter_icon").click(function(){
		let path = window.location.pathname;
		
		if (open == false) {

			if (path.indexOf("regioni") == -1){ 
				the_path = "";
			}
			else {
				the_path = "../";
			}

			$("#mobile_filter_icon").css("background","url(" + the_path + "assets/img/arrow-up.svg) center center no-repeat").css("background-size","55%");
			$("#select_box").show()
			$("#select_box").css("display","flex")
			open = true;
		}
		else {
			$("#mobile_filter_icon").css("background","url(" + the_path + "assets/img/arrow-down.svg) center center no-repeat").css("background-size","55%");			
			$("#select_box").hide()
			open = false;
		}
	})
}

$(document).ready(function() {
	mobile_menu();
	mobile_filter();
})