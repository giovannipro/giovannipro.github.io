function compareStrings(a, b) {
	a = a.toLowerCase();
	b = b.toLowerCase();
	return (a < b) ? -1 : (a > b) ? 1 : 0;
}

function compareValues(a, b) {
	return b - a 
}