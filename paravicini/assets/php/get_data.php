<?php
	ini_set("display_errors", 1);
	ini_set("display_startup_errors", 1);
	error_reporting(E_ALL);

	require_once("config.php"); 

	// query db
	// --------------------------------------------

	$query_a = "SELECT * 
		FROM buildings
	";

	// get data
	// --------------------------------------------
	
	$result_a = $conn->query($query_a);
	$data = array();

	$items = $result_a->num_rows;

	if ($result_a->num_rows > 0) {
		$data_a = array();
		
		echo "id" . "\t" . "category" . "\t" . "subcategory" . "\t" . "lat" . "\t" . "lon" . "\t" . "name" . "\t" . "place" . "\t"  . "reference" . "\t" . "description" . "\t" . "link" . "\n";

		// echo "id" . "\t" . "lat" . "\t" . "lon" . "\t" . "name" . "\t" . "link" . "\n";

		while($row = $result_a->fetch_assoc()) {
			echo (int)$row["id"] . "\t" . $row["category"] . "\t" . $row["subcategory"] . "\t" . (float)$row["lat"] . "\t" . (float)$row["lon"] . "\t" . $row["name"] . "\t" . $row["place"] . "\t" . $row["reference"] . "\t" . $row["description"] . "\t" . $row["link"] . "\n";

			// echo (int)$row["id"] . "\t" . (float)$row["lat"] . "\t" . (float)$row["lon"] . "\t" . $row["name"] . "\t" . $row["link"] . "\n";
		}
	} 
	else {
		echo "0 results";
	}

	$conn->close();
?>