<?php

$address = urlencode($_GET['q']);
$request = file_get_contents("http://maps.google.com/maps/api/geocode/json?address=" . $address . "&sensor=false");
$json = json_decode($request, true);

?>