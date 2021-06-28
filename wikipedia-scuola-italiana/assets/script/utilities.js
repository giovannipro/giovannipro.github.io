function apply_color(subject){
	let color;

	if (subject == "Letteratura italiana"  || subject == "Letteratura latina" || subject == "Storia" || subject == "Storia dell'arte" || subject == "Filosofia" || subject == "Grammatica italiana" || subject == "Grammatica latina") {
		color = "violet";
	}
	else if (subject == "Informatica" || subject == "Tecnologia"){
		color = "blue";
	}
	else if (subject == "Geografia"  || subject == "Diritto e Economia" || subject == "Cittadinanza e costituzione"){
		color = "#00b2ff";
	}
	else { // Biologia Chimica Fisica Matematica Scienze della Terra Scienze
		color = "green";
	}
	return color;
}

function variation_perc(now,prev,parameter){
	let variation = now - prev;
	let perc; 
	let output;
    if (variation > 0){
    	perc = (((now/prev)-1)*100)
	}
	else {
		perc = (100-(now*100)/prev)
	}

	if (perc <= 0.5 && perc >=-0.5){
		output = perc.toFixed(1) + "%";
	}
	else if (variation == 0){
		output = "-"
	}
	else {
		output = Math.floor(perc).toLocaleString() + "%";
	}

	if (variation > 0){
		output = "+" + output; 
	}
	else if (variation == 0){
		output = output
	}
	else {
		output = "-" + output; 
	}
    return output;
}

const subjects = [
	"Tutte le materie",
	"Biologia",
	"Chimica",
	"Cittadinanza e costituzione",
	"Diritto e Economia",
	"Filosofia",
	"Fisica",
	"Geografia",
	"Grammatica italiana",
	"Grammatica latina",
	"Informatica",
	"Letteratura italiana",
	"Letteratura latina",
	"Matematica",
	"Scienze della Terra",
	"Scienze",
	"Storia",
	"Tecnologia"
]

// const literature_ = [
// 	"it",
// 	"la"
// ]

function mobile_menu() {
 	let open = false;
 	let the_path = "";

	$("#mobile_menu_icon").click(function(){

		let display = $("#mobile_menu_icon").css('display')
		// console.log(display)

		if (open == false) {

			let path = window.location.pathname;
			
			if (path.indexOf("autori") == -1 || path.indexOf("avvisi") == -1){
				the_path = "";
			}
			else {
				the_path = "../";
			}

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

			if (path.indexOf("avvisi") == -1 || path.indexOf("autori") == -1){ 
				the_path = "../";
			}
			else {
				the_path = "";
			}
			// console.log(the_path)

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