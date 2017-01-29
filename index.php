<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="author">
<meta name="viewport" content="width=device-width, minimum-scale=1.0, initial-scale=1.0, user-scalable=yes">
<meta name="mobile-web-app-capable" content="yes">
<meta id="theme-color" name="theme-color" content="#fff">


<title>Fan Funhouse - Freeform</title>

 <link rel='stylesheet prefetch' href='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min.css'>


<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.4/p5.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.4/addons/p5.dom.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.4/addons/p5.sound.min.js"></script>
<script src="libraries/seriously.js"></script>
<script src="libraries/effects/seriously.blur.js"></script>
<script src="libraries/effects/seriously.chroma.js"></script>
<script src="libraries/effects/seriously.checkerboard.js"></script>
<script src="libraries/effects/seriously.kaleidoscope.js"></script>
<script src="libraries/effects/seriously.nightvision.js"></script>
<script src="libraries/effects/seriously.noise.js"></script>
<script src="libraries/effects/seriously.tvglitch.js"></script>


<script src="libraries/effects/seriously.blend.js"></script>
<script src="libraries/effects/seriously.brightness-contrast.js"></script>
<script src="libraries/effects/seriously.crop.js"></script>
<script src="libraries/effects/seriously.exposure.js"></script>
<script src="libraries/effects/seriously.expression.js"></script>
<script src="libraries/effects/seriously.fader.js"></script>
<script src="libraries/effects/seriously.falsecolor.js"></script>
<script src="libraries/effects/seriously.filmgrain.js"></script>
<script src="libraries/effects/seriously.freeze.js"></script>
<script src="libraries/effects/seriously.fxaa.js"></script>
<script src="libraries/effects/seriously.gradientwipe.js"></script>
<script src="libraries/effects/seriously.hex.js"></script>
<script src="libraries/effects/seriously.highlights-shadows.js"></script>
<script src="libraries/effects/seriously.hue-saturation.js"></script>
<script src="libraries/effects/seriously.invert.js"></script>
<script src="libraries/effects/seriously.layers.js"></script>
<script src="libraries/effects/seriously.linear-transfer.js"></script>
<script src="libraries/effects/seriously.lumakey.js"></script>
<script src="libraries/effects/seriously.lut.js"></script>
<script src="libraries/effects/seriously.mirror.js"></script>
<script src="libraries/effects/seriously.repeat.js"></script>




<script src="https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/9.0.0/nouislider.min.js"></script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css"/>
<link rel="stylesheet" href="css/main.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/9.0.0/nouislider.css"/>

<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,600" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Source+Code+Pro" rel="stylesheet">
</head>





<body>

<div class="container">

<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 main">
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


<h1 class="freeform">Freeform</h1>
 
<div class="steps">
<p><span id="s1">record </span>&#10142; <span id="s2">edit </span>
</div> 


<div class="step1"> 

<div class="card card-s1">
<div id="clockdiv">

<div id="setDuration">Set Duration: <span class="seconds" id="duration">09</span>s
<div id="durationSlider"></div></div>
<div class="seconds" id="countdown" style="display:none;">09</div>
<div id="preCount" style="display:none;">
  <span id="three">3</span>
  <span id="two">2</span>
  <span id="one">1</span>
</div>

</div>

<video id="recordVid" controls autoplay muted="muted"></video><br>

<button id="rec" class="ui-button btn btn-primary" onclick="onBtnRecordClicked()">Record</button>
<!--<button id="rec" class="ui-button btn btn-primary" onclick="recordCountdown()">Record</button>-->
</div>

</div><!--END STEP 1-->

<div class="step2">

          
<div class="col-lg-6 col-md-7 col-sm-12 col-xs-12">

<div class="card card-s2B">
<div id="editStatus">
Status: Waiting for Recording
</div> 
<div id="editCol"></div>
<div id="toggles">
<button id="toggleVid" class="ui-button btn btn-primary" onclick="toggleVid()"><img src="css/pause.png" /></button>
<button id="muteVid" class="ui-button btn btn-primary" onclick="muteVid()"><img src="css/mute.png" /></button>
</div>
<!--</div>-->

<!--<div class="card card-s2B">-->
<div class="effectsButtons">
<button id="glitch" class="btn btn-danger glitch" draggable="true" onclick="glitchClick()" ondragend="glitchAdd(event)">Glitch</button>
<button id="saturate" class="btn btn-info saturate" draggable="true" onclick="saturateClick()" ondragend="saturateAdd(event)">Saturate</button>
<button id="slow" class="btn btn-warning slow" draggable="true" onclick="slowClick()" ondragend="slowAdd(event)">Slow</button>
<button id="freeze" class="btn btn-success freeze" style="display:none;">Great Job!</button>
<button id="stutter" class="btn btn-success stutter" draggable="true" onclick="stutterClick()" ondragend="stutterAdd(event)">Stutter</button>
</div>

<div class="effectsPanel" ondragover="allowDrop(event)">
<div class="effectPanel1" id="effectPanel1"><span class='effectName'>Effect 1</span></div>
<div class="effectPanel2" id="effectPanel2"><span class='effectName'>Effect 2</span></div>
<div class="effectPanel3" id="effectPanel3"><span class='effectName'>Effect 3</span></div>
</div><!--END EFFECTS PANEL-->   
</div>
        

<!-- <div id="editPlay"></div>-->  
</div><!--END COL-->

<div class="col-lg-6 col-md-5 col-sm-12 col-xs-12"> 

<div class="card card-s2C">
<div id="publish-box">
<p><b>Video Name:</b> <input id="vidName" type="text" placeholder="Enter video name..."/>
<p><b>Author Name:</b> <input id="authorName" type="text" placeholder="Enter author name..."/>
<p><b>Tags:</b> <input id="tags" type="text" placeholder="use,commas,to,separate"/> 
<br><br>
<button id="publish" class="ui-button btn btn-primary" data-toggle="tooltip" data-placement="bottom" title="Publish your video to the Fan Funhouse website!">Publish</button>

<div id="viewVideo1" style="display:none;">
<p><a id="viewLink1" target="_self">Submitted! View your video here.</a>
</div>

</div>
</div>

</div><!--END COL-->

</div><!--END STEP 2-->




<div class="step3">
<div class="col-md-6">
<br>
<div id="vidNameFinal"></div> 
<div id="authorNameFinal"></div>
<video id="recorded-final" autoplay loop></video>
<br><br><button id="redo" class="ui-button btn btn-primary">Edit</button>
<button id="submit" class="ui-button btn btn-success">Submit</button>

<br><br>
<div id="viewVideo" style="display:none;">
<p><a id="viewLink">Submitted! View your video here.</a>
</div>

</div><!--END COL-->
</div><!--END STEP 3-->





</div><!--END MAIN COL-->


</div><!--END MAIN ROW-->



<a id="downloadLink" download="mediarecorder.webm" name="mediarecorder.webm" href style="display:none;"></a> 


<audio id="countdownSound1">
<source src="css/countdownFinal.mp3" type="audio/mpeg">
</audio>


</div><!--END CONTAINER-->


<script src='https://code.jquery.com/jquery-2.2.4.min.js'></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js"></script>
<script src='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min.js'></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.4.1/velocity.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/wnumb/1.0.4/wNumb.min.js"></script>
<!--<script src="https://unpkg.com/draggabilly@2.1/dist/draggabilly.pkgd.min.js"></script>-->
<script src="js/main.js"></script>



</body>
</html>