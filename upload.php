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

$fPage = fopen($fURL, 'w');
$txt = "This is my video.<br><br>
<video id='myVideo' autoplay controls loop>
<source src='{$filename}' type='video/webm'>
</video><br><br>
<img src='https://www.digitalgov.gov/files/2015/04/400-x-72-fb-twitter-email-plus-sign.jpg' style='width:320px;'>";

fwrite($fPage, $txt);
fclose($fPage);


?>