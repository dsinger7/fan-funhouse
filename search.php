<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="author">
<meta name="viewport" content="width=device-width, minimum-scale=1.0, initial-scale=1.0, user-scalable=yes">
<meta name="mobile-web-app-capable" content="yes">
<meta id="theme-color" name="theme-color" content="#fff">


<title>Fan Funhouse</title>



 <link rel='stylesheet prefetch' href='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min.css'>
 <link rel="stylesheet" href="css/home.css" />

 <link href="https://fonts.googleapis.com/css?family=Source+Code+Pro" rel="stylesheet">
 <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,600" rel="stylesheet">

</head>

<body>

<div class="container">

<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 main">

<!--SEARCH BAR-->
<div class="row">

<div class="search-bar">

<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
<a href="create.php" target="_self"><img class="logo" src="css/logo.png"/></a>
</div>

<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">
	<form method="post" action="search.php?go" id="searchform" target="_self">
	<div class="input-group">
  		<input type="text" name="name" id="search" class="form-control search-input" placeholder="Search for...">
  		<span class="input-group-btn">
    	<button class="btn btn-default" type="submit" name="submit"><img src="css/search.png"/></button>
  	</span>
</div><!-- /input-group --> 
</form>
</div>


<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
<img class="avatar" src="css/avatar.png"/>
</div>

</div>


</div><!--END ROW-->




<?php 
if(isset($_POST['submit'])){ 
if(isset($_GET['go'])){ 
if(preg_match("/^[  a-zA-Z]+/", $_POST['name'])){ 
	//echo  "<p>yes3</p>";
	$name = $_POST['name'];
	//connect to the database
	$db = mysqli_connect ("db.iac.gatech.edu",  "dsinger_fanfun", "EuICYOFGYFVuvMmv","dsinger_fanfun") or die ('I cannot connect to the database because: ' . mysql_error()); 
	//select database
	//query the database table
	
	//SELECT * FROM FreeformWeb for server
	$sql = "SELECT * FROM FreeformVids
 	WHERE author LIKE '%{$name}%'
 	OR title LIKE '%{$name}%' 
 	OR keywords LIKE '%{$name}%' ";
 	//$sql = "SELECT * FROM FreeformVids";
 	//run the query
 	$result = mysqli_query($db,$sql);
 	echo "<div class='featured'>Results for '{$name}'</div><br>";
 	//create while loop and loop through result set
 	while($row = mysqli_fetch_assoc($result)){
 		$urlnum = $row['url_num'];
 		$title = $row['title'];
 		$author = $row['author'];
 	//display the result of the array
 	echo "


	<div class='search-result col-lg-6 col-md-6 col-sm-12 col-xs-12'>
	<div class='search-result card'>
	  	<video class='searchVid' controls loop>
		<source src='freeform/videos/test{$urlnum}.webm' type='video/webm'>
		</video>
	  <div class='search-result card-block'>
	    <a href='freeform/{$urlnum}.php' target='_self'><h4 class='search-result card-title'>{$title}</h4></a>
	    <p class='search-result card-text'>{$author}
	    </p>
	  </div>
	</div>
	</div>


 	";

 	}
} 
else{ 
	//echo  "<p>Please enter a search query</p>"; 
} 
}
} 
?> 










</div><!--END COL-->


</div><!--END MAIN CONTAINER-->











<script src='https://code.jquery.com/jquery-2.2.4.min.js'></script>
<script type="text/javascript" src="js/home.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js"></script>
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
