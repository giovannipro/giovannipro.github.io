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

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}