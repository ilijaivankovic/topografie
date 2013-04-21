<?php
/////////////////////////////////////////////////////////
// Copyright © 2013 Vernon de Goede & Ilija Ivankovic  //
/////////////////////////////////////////////////////////

// Voorkom dat er foutmeldingen gegeven worden omdat de aanvraag niet van hetzelfde domein komen.
header('Access-Control-Allow-Origin: *'); 
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

$arr = array('Amsterdam' => 'Nederland', 'Groningen' => 'Nederland', 'Den Haag' => 'Nederland');

// $arr = array(
	//array("Amsterdam", "Nederland", "test"),
	//array("Groningen", "Nederland", "test"),
	//array("Den Haag", "Nederland", "test")
//);
echo json_encode($arr);
?>