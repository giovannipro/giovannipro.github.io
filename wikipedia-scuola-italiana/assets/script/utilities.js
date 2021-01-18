function apply_color(subject){
	let color;

	if (subject == "Letteratura italiana"  || subject == "Letteratura latina" || subject == "Storia" || subject == "Storia dell'arte" || subject == "Filosofia" || subject == "Grammatica italiana" || subject == "Grammatica latina") {
		color = "violet";
	}
	else if (subject == "Informatica" || subject == "Tecnologia"){
		color = "blue";
	}
	else if (subject == "Geografia"  || subject == "Diritto e Economia" || subject == "Cittadinanza e costituzione"){
		color = "#00c2f5";
	}
	else { // Biologia Chimica Fisica Matematica Scienze della Terra Scienze
		color = "green";
	}
	return color;
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

const literature_ = [
	"it",
	"la"
]

function mobile_menu() {
 	let open = false;

	$("#mobile_menu_icon").click(function(){

		let display = $("#mobile_menu_icon").css('display')
		console.log(display)

		if (open == false) {
			$("#mobile_menu_icon").css("background","url(assets/img/close-menu.svg) center center no-repeat").css("background-size","55%");
			// $("#mobile_menu_box").css("top",45)
			$("#mobile_menu_box").show()
			open = true;
		}
		else {
			$("#mobile_menu_icon").css("background","url(assets/img/mobile-menu.svg) center center no-repeat").css("background-size","55%");			
			// $("#mobile_menu_box").css("top",-140)
			$("#mobile_menu_box").hide()
			open = false;
		}
	})
}

$(document).ready(function() {
	mobile_menu()
})