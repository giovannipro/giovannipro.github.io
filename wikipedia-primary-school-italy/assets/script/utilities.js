function compareStrings(a, b) {
	a = a.toLowerCase();
	b = b.toLowerCase();
	return (a < b) ? -1 : (a > b) ? 1 : 0;
}

function compareValues(a, b) {
	return b - a 
}

function no_underscore(item){
	let new_item = item.replaceAll("_"," ")
	return new_item
}

function apply_color(item){
	var color = "";

	if (item == "Biologia" || item == "Chimica" || item == "Fisica" || item == "Scienze della Terra"){ // scienze naturali
		color = "green";
	}
	else if (item == "Filosofia" || item == "Letteratura italiana" || item == "Storia" || item == "Storia dell'arte"){ // scienze umanistiche
		color =  "violet";
	}
	else if (item == "Matematica" || item == "Informatica"){ // scienze formali
		color =  "blue";
	}
	else { // scienze sociali
		color = "gray";
	}
	
	// if (item == "Geografia"){
	// 	color = "red";
	// }
	// else if (item == "Storia"){
	// 	color = "green";
	// }
	// else if (item == "Letteratura italiana"){
	// 	color =  "violet";
	// }
	// else if (item == "Matematica"){
	// 	color =  "orange";
	// }
	// else if (item == "Cittadinanza e costituzione"){
	// 	color =  "blue";
	// }
	// else if (item == "Storia dell'arte"){
	// 	color =  "yellow";
	// }
	// else {
	// 	color = "gray";
	// }
	return color;
}

function groupByKey(array, key) {
   return array
     .reduce((hash, obj) => {
       if(obj[key] === undefined) return hash; 
       return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
     }, {})
}

function sortByKey(array, key, order) {
	let I = 0;
	let II = 0;

	if (order == "desc") {
		I = 1
		II = -1
	} 
	else if (order == "asc") {
		I = -1
		II = 1
	}
	else {
		I = 1
		II = -1
	}

    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? I : ((x > y) ? II : 0));
    });
}

function randomPosNeg(min,max){
	var num = Math.floor(Math.random()*max) + min;
	num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
	return num
}

function cropText(text){
	let newText;
	let t = text.split(" ")
	const limit = 2;

	if (t.length > Math.floor(limit) ) {
		newText = t[0] + " " + t[1] + " " + t[2] + " ...";
	}
	else {
		newText = text;
	}
	return text;
}