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
 <link rel='stylesheet' href='../css/home.css' />
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
  		<input type='text' name='name' id='search' class='form-control search-input' placeholder='Search for...'>
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



<div class='card card-published'>
	<video class='published' id='myVideo' controls loop>
	<source src='{$fileLocation}' type='video/webm'>
	</video>
  <div class='published card-block'>
    <h4 class='published card-title'>{$title}</h4>
    <p class='published card-text'>{$author}
    </p>

    <a 
    href='mailto:?subject=Check out this video I made with Fan Funhouse!&amp;body=https://fanfunhouse.lmc.gatech.edu/{$fURL}%0D%0A%0D%0AMake your own videos inspired by Tim and Eric at https://fanfunhouse.lmc.gatech.edu' 
    target='_self'>
    <img src='../css/email.png' width='40'/>
    </a>

    <a class='social-share'
    target='_blank' OnClick='window.open(this.href,&quot;targetWindow&quot;,&quot;toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250&quot;); return false;' 
    href='https://www.facebook.com/sharer/sharer.php?u=https://fanfunhouse.lmc.gatech.edu/{$fURL}'
    target='_self'>
    <img src='../css/facebook.png' width='40'/>
    </a>

    <a class='social-share' 
    href='https://twitter.com/home?status=Check out this video I made with Fan Funhouse: https://fanfunhouse.lmc.gatech.edu/{$fURL}'
    target='_blank' OnClick='window.open(this.href,&quot;targetWindow&quot;,&quot;toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250&quot;); return false;'>
    <img src='../css/twitter.png' width='40'/>
    </a>

    <a class='social-share' 
    href='http://www.tumblr.com/share/link?url=https://fanfunhouse.lmc.gatech.edu/{$fURL}'
    target='_blank' OnClick='window.open(this.href,&quot;targetWindow&quot;,&quot;toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250&quot;); return false;'>
    <img src='../css/tumblr.png' width='40'/>
    </a>
 
  </div>
</div>


</div>
</div>
</div>

<script src='https://code.jquery.com/jquery-2.2.4.min.js'></script>
<script src='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min.js'></script>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-91405786-1', 'auto');
  ga('send', 'pageview');

</script>

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
	$db_password = "EuICYOFGYFVuvMmv"; 
	//fanfun2: R7tCF87nVZwoKzDf
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