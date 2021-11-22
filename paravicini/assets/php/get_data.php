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
		
		echo "id" . "\t" . "category" . "\t" . "subcategory" . "\t" . "lat" . "\t" . "lon" . "\t" . "name" . "\t" . "ref" . "\t" . "description" . "\t" . "link";
		echo "\n";

		while($row = $result_a->fetch_assoc()) {
			echo $row["id"] . "\t" . $row["category"] . "\t" . $row["subcategory"] . "\t" . (float)$row["lat"] . "\t" . (float)$row["lon"] . "\t" . $row["name"] . "\t" . $row["ref"] . "\t" . $row["description"] . "\t" . $row["link"] . "\n";
		}
	} 
	else {
		echo "0 results";
	}

	$conn->close();
?>