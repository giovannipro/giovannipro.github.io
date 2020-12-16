function apply_color(subject){
	let color;

	if (subject == "Letteratura italiana"  || subject == "Letteratura latina" || subject == "Storia" || subject == "Storia dell'arte" || subject == "Filosofia" || subject == "Grammatica italiana" || subject == "Grammatica latina") {
		color = "violet";
	}
	else if (subject == "Informatica" || subject == "Tecnologia"){
		color = "blue";
	}
	else if (subject == "Geografia"  || subject == "Diritto e Economia" || subject == "Cittadinanza e costituzione"){
		color = "gray";
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