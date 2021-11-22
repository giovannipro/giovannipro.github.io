<!DOCTYPE HTML>
<html lang="it">
<head>
	<title>Paravicini</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0">
	<meta name="description" content="Mappa degli edifici disegnati da Paravicini e di quelli neorinascimentali">
	
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script>
    
	<link rel="stylesheet" type="text/css" href="assets/style.css">
	<script type="text/javascript" src="assets/script.js"></script>
</head>
<body>
	<header>
		<div id="logo_line">
			<div id="logo">
				<a href="https://neorenaissance.supsi.ch/cms/" title="neorenaissance">
					<img src="assets/img/supsi-logo.png" alt="Logo SUPSI" width="284" height="92">
				</a>
			</div>
			<div id="title_line">
				<a href="https://neorenaissance.supsi.ch/cms/mappa-interattiva" title="neorenaissance">
					<strong>neorenaissance</strong>
				</a> 
			</div>
		</div>
		<div>
			<a href="https://neorenaissance.supsi.ch/cms/mappa-interattiva/" title="neorenaissance">X</a>
		</div>
	</header>
	<div id="filter_box">
		<div>
			<select name="category" id="filter_category" class="filter">
			    <option value="paravicini" selected>edifici disegnati da Paravicini</option>
			    <option value="rinascimentale">edifici rinascimentali</option>
			    <option value="neorinascimentale">edifici neo-rinascimentali</option>
			</select>
		</div>
		<div>
			<select name="subcategory" id="filter_subcategory" class="filter">
				<option value="tutti" selected>tutti gli edifici</option>
			    <option value="religioso">edifici religiosi</option>
			    <option value="civile">edifici civili</option>
			</select>
			
		</div>
	</div>
	<div id="info_bar"></div>
	<div id="my_map"></div>
</body>

