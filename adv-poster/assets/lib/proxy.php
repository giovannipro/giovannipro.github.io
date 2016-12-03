<?php

	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);

	header('Content-Type', 'text/plain'); 
	header("Access-Control-Allow-Origin: *");
	//header('Content-Type: application/json');

	
	if (!isset($_GET['url'])) {
	    die(); // Don't do anything if we don't have a URL to work with
	}
	else{
		echo "Error!";	
	}

	$url = urldecode($_GET['url']);
	$url = 'http://' . str_replace('http://', '', $url); // Avoid accessing the file system

	echo file_get_contents($url);
	

	//$url = 'http'. ($_SERVER['HTTPS'] ? 's' : null) .'://'. $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
  	//echo('<p>This information has come from <a href="' . $url . '">' . $url . '</a></p>');

?>
