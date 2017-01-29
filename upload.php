<?php
// pull the raw binary data from the POST array
$data = substr($_POST['data'], strpos($_POST['data'], ",") + 1);
// decode it
$decodedData = base64_decode($data);
// print out the raw data, 
$fileNum = rand(1000000,9999999);
$filename = "freeform/videos/test{$fileNum}.webm";
$fileLocation = "videos/test{$fileNum}.webm";
//echo ($filename);
//echo ($decodedData);
// write the data out to the file
$fp = fopen($filename, 'wb');
fwrite($fp, $decodedData);
fclose($fp);

$fURL = "freeform/{$fileNum}.php";
echo $fURL;

$title = ($_POST['title']);
$author = ($_POST['author']);
$tagList = ($_POST['tags']);

$fPage = fopen($fURL, 'w');
$txt = "

<!DOCTYPE html>
<html>
<head>
<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
<meta name='viewport' content='width=device-width, minimum-scale=1.0, initial-scale=1.0, user-scalable=yes'>
<meta name='mobile-web-app-capable' content='yes'>
<meta id='theme-color' name='theme-color' content='#fff'>
<meta name='title' content='{$title}'>
<meta name='author' content='{$author}'>
<meta name='keywords' content='{$tagList}'>


<title>{$title} - Fan Funhouse</title>

 <link rel='stylesheet prefetch' href='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min.css'>
 <link rel='stylesheet' href='../css/main.css' />
</head>

<body>

<div class='container'>
<div class='row'>

<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 main'>

<div class='search-bar'>

<div class='col-md-2 col-sm-2 col-xs-2'>
<a href='../create.php' target='_self'><img class='logo' src='../css/logo.png'/></a>
</div>

<div class='col-lg-8 col-md-8 col-sm-8 col-xs-8'>
	<form method='post' action='../search.php?go' id='searchform' target='_self'>
	<div class='input-group'>
  		<input type='text' name='name' id='search' class='form-control search-input' placeholder='Search for...''>
  		<span class='input-group-btn'>
    	<button class='btn btn-default' type='submit' name='submit'><img src='css/search.png'/></button>
  	</span>
</div><!-- /input-group --> 
</form>
</div>

<div class='col-md-2 col-sm-2 col-xs-2'>
<img class='avatar' src='../css/avatar.png'/>
</div>

</div>




<div class='col-md-6'>

<div id='vidNameFinal'>{$title}</div><div id='authorNameFinal'>Created By: {$author}</div>
<video id='myVideo' autoplay controls loop>
<source src='{$fileLocation}' type='video/webm'>
</video><br><br>
<img src='https://www.digitalgov.gov/files/2015/04/400-x-72-fb-twitter-email-plus-sign.jpg' style='width:320px;'>

</div>
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

<?php
/*
function queryDB($sqlAction) {
	$db_host = "db.iac.gatech.edu";
	$db_database = "dsinger_fanfun";
	$db_username = "dsinger_fanfun";
	$db_password = "YES"; 
	// put your DATABASE password (not tsquare pw!) here
	//the database, username, and password information will be automatically generated for you by http://db.iac.gatech.edu/databases/

	$connection = mysql_connect( $db_host, $db_username, $db_password );
	
	if(!$connection) {
		echo "database error, code: " . mysql_error();
		die();
	} 
	else
	//echo "working"; 
	{

		$db_select = mysql_select_db( $db_database );
		if( !$db_select ) {
			echo "could not select :( error was " . mysql_error();
			die();
		} else {
			$result = mysql_query($sqlAction) or
				die( "Error: [" . mysql_error() . "]:{".mysql_errno()."}" );
			mysql_close($connection);
			return $result;
		} // else - vs if( !$db_select )
	} // else - vs if(!$connection)
} // end of queryDB() 



queryDB("INSERT INTO FreeformVids (url_num, title, author,keywords)
VALUES ('{$fileNum}', '{$title}', '{$author}','{$tagList}')");
*/


?>