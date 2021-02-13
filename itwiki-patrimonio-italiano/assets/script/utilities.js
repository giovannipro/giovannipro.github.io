function mobile_menu() {
 	let open = false;

	$("#mobile_menu_icon").click(function(){

		let display = $("#mobile_menu_icon").css('display')
		// console.log(display)

		if (open == false) {

			const path = window.location.pathname;
			let the_path = "";

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
	// mobile_menu();
	dv1();
})