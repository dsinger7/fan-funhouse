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


<!--TITLE-->
<div class="row">
<div class="title-text">
<img class="title" src="css/title.png"/>
</div>
</div><!--END ROW-->

<br>
<!--NAVIGATION-->
<div class="row">
<div class="navigation">

<a href="create.php" target="_self"><div id="create" class="create-page">
create
</div></a>		

<a href="community.php" target="_self"><div id="community">
community
</div></a>
	
</div>
</div><!--END ROW-->

<br><br>
<!--CREATE CARDS-->
<div class="row">

<div class="col-md-6 col-sm-6 col-xs-12">
<div class="card">
<img class="card-img-top" src="css/freeform.png" alt="freeform"/>
<div class="card-block">
<h4 class="card-title">Freeform</h4>
<p class="card-text">Remix your video with classic Tim and Eric effects.</p>
<a href="index.php" class="btn btn-primary" target="_self">Get Started</a>
</div>
</div>
</div>

<div class="col-md-6 col-sm-6 col-xs-12">
<div class="card">
<img class="card-img-top" src="css/brule.png" alt="Brule's Rules"/>
<div class="card-block">
<h4 class="card-title">Brule's Rules</h4>
<p class="card-text">Step onto the Channel 5 set for a word of advice.</p>
<a href="#" class="btn btn-primary disabled" aria-disabled="true">Get Started</a>
</div>
</div>
</div>


</div><!--END ROW-->	


</div><!--END COL-->


</div><!--END MAIN CONTAINER-->







































<script src='https://code.jquery.com/jquery-2.2.4.min.js'></script>
<script type="text/javascript" src="js/home.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js"></script>
<script src='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min.js'></script>



</body>
</html>
