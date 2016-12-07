<?php
// pull the raw binary data from the POST array
$data = substr($_POST['data'], strpos($_POST['data'], ",") + 1);
// decode it
$decodedData = base64_decode($data);
// print out the raw data, 
$fileNum = rand(10000,99999);
$filename = "test{$fileNum}.webm";
//echo ($filename);
//echo ($decodedData);
// write the data out to the file
$fp = fopen($filename, 'wb');
fwrite($fp, $decodedData);
fclose($fp);

$fURL = "{$fileNum}.html";
echo $fURL;

$title = ($_POST['title']);
$author = ($_POST['author']);

$fPage = fopen($fURL, 'w');
$txt = "

<html>
<head>
<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
<meta name='viewport' content='width=device-width, minimum-scale=1.0, initial-scale=1.0, user-scalable=yes'>
<meta name='mobile-web-app-capable' content='yes'>
<meta id='theme-color' name='theme-color' content='#fff'>

<base target='_blank'>

<title>{$title} - Fan Funhouse</title>

 <link rel='stylesheet prefetch' href='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min.css'>
 <link rel='stylesheet' href='css/main.css' />
</head>

<body>

<div class='container'>
<div class='row'>
<div class='col-md-6'>

<div id='vidNameFinal'>{$title}</div><div id='authorNameFinal'>Created By: {$author}</div>
<video id='myVideo' autoplay controls loop>
<source src='{$filename}' type='video/webm'>
</video><br><br>
<img src='https://www.digitalgov.gov/files/2015/04/400-x-72-fb-twitter-email-plus-sign.jpg' style='width:320px;'>

</div>
</div>
</div>

<script src='https://code.jquery.com/jquery-2.2.4.min.js'></script>
<script src='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min.js'></script>

</body>
</html>

";

fwrite($fPage, $txt);
fclose($fPage);


?>