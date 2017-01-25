'use strict';

//This code is organized based on steps taken during the application.
//STEP 1: User's original video is captured.
//STEP 2: User's original video is edited and published.


//GLOBAL VARIABLES

//Slider (Step 1)
var timeInMinutes = 0.15;
var durationSlider = document.getElementById('durationSlider');

//Video (Step 1)
var videoURL;
var recBtn = document.querySelector('button#rec');
var stopBtn = document.querySelector('button#stop');
var videoElement = document.querySelector('#recordVid');
var dataElement = document.querySelector('#data');
var downloadLink = document.querySelector('a#downloadLink');
videoElement.controls = false;

//MediaRecorder (Step 1)
var preCountdown = true;
var mediaRecorder;
var chunks = [];
var count = 0;

//Recording state (Step 1)
var recording = false;

//p5 video setup and effects (Step 2)
var src;
var video;
var canvas;
var muted = false;
var playing = false;
var playButton;
var target;
var blur;
var addNoise;
var tv;
var repeat;
var crop;
var ripple;
var hueSaturation;
var reformat;
var greatJobAudio;
var framePreview;
var editCol = document.getElementById('editCol');
document.getElementById("toggleVid").disabled = true;
document.getElementById("publish").disabled = true;

//p5 video editing and duration (Step 2)
var editMode = false;
var timeReceived = false;
var duration = 0;
var timeCode = 0;

//Web Audio variables (Step 2)
var aStream;
var gainNode;
var greatJobPlayed1 = false;
var greatJobPlayed2 = false;
var greatJobPlayed3 = false;

//Stutter variables
var stutter1Counter = 0;
var stutter1On = true;
var stutter2Counter = 0;
var stutter2On = true;
var stutter3Counter = 0;
var stutter3On = true;

//Set up effect sliders
//NEW SLIDERS

var panel1Filled = false;
var panel2Filled = false;
var panel3Filled = false;
var panelFilledArray = [panel1Filled,panel2Filled,panel3Filled];


var panel1Effect = "";
var panel2Effect = "";
var panel3Effect = "";
var panelEffectArray = [panel1Effect,panel2Effect,panel3Effect];

var panel1Start = 0;
var panel1End = 0;
var panel2Start = 0;
var panel2End = 0;
var panel3Start = 0;
var panel3End = 0;
var panelStartArray = [panel1Start,panel2Start,panel3Start];
var panelEndArray = [panel1End,panel2End,panel3End];

var newSlider1;
var newSlider2;
var newSlider3;
var newSliderArray = [newSlider1,newSlider2,newSlider3];

var panel1StartEnd = [0,1];
var panel2StartEnd = [0,1];
var panel3StartEnd = [0,1];
var panelStartEndArray = [panel1StartEnd,panel2StartEnd,panel3StartEnd];

//Video title and author (Step 2)
var vidName = "My Video";
var authorName = "My Name";
var tags = "Tag";
var tagList = "Tag";

//MediaRecorder variables (Step 3)
var mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
var recordedBlobs;
var sourceBuffer;

//Publishing variables (Step 3)
var videoFinal = document.getElementById("recorded-final");
var publishButton = document.querySelector('button#publish');
publishButton.onclick = publish;
var myCanvas;
var canvasPublish;

//Redo state (Step 3)
var redoButton = document.querySelector('button#redo');
redoButton.onclick = redo;

var effect1, effect2, effect3;


///////////////////
//SECTION 1 BEGINS
///////////////////

//SECTION 1.1: Slider sets video duration. 
noUiSlider.create(durationSlider, {
  start: 9,
  step: 1,
  range: {
    'min': 1,
    'max': 10
  },
  format: wNumb({
    decimals: 0
  })
});

durationSlider.noUiSlider.on('slide', function(){
  var timerDuration2 = durationSlider.noUiSlider.get();
  //console.log(timerDuration2);
  timeInMinutes = timerDuration2/60;
  if(timerDuration2 < 10){
    $(".seconds").html("0" + timerDuration2); 
  } else {
    $(".seconds").html(timerDuration2); 
  }
});

//SECTION 1.2: Get browser name.
function getBrowser(){
  var nVer = navigator.appVersion;
  var nAgt = navigator.userAgent;
  var browserName  = navigator.appName;
  var fullVersion  = ''+parseFloat(navigator.appVersion);
  var majorVersion = parseInt(navigator.appVersion,10);
  var nameOffset,verOffset,ix;
  // In Opera, the true version is after "Opera" or after "Version"
  if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
   browserName = "Opera";
   fullVersion = nAgt.substring(verOffset+6);
   if ((verOffset=nAgt.indexOf("Version"))!=-1)
     fullVersion = nAgt.substring(verOffset+8);
 }
  // In MSIE, the true version is after "MSIE" in userAgent
  else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
   browserName = "Microsoft Internet Explorer";
   fullVersion = nAgt.substring(verOffset+5);
 }
  // In Chrome, the true version is after "Chrome"
  else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
   browserName = "Chrome";
   fullVersion = nAgt.substring(verOffset+7);
 }
  // In Safari, the true version is after "Safari" or after "Version"
  else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
   browserName = "Safari";
   fullVersion = nAgt.substring(verOffset+7);
   if ((verOffset=nAgt.indexOf("Version"))!=-1)
     fullVersion = nAgt.substring(verOffset+8);
 }
  // In Firefox, the true version is after "Firefox"
  else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
   browserName = "Firefox";
   fullVersion = nAgt.substring(verOffset+8);
 }
  // In most other browsers, "name/version" is at the end of userAgent
  else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
   (verOffset=nAgt.lastIndexOf('/')) )
  {
   browserName = nAgt.substring(nameOffset,verOffset);
   fullVersion = nAgt.substring(verOffset+1);
   if (browserName.toLowerCase()==browserName.toUpperCase()) {
    browserName = navigator.appName;
  }
}
  // trim the fullVersion string at semicolon/space if present
  if ((ix=fullVersion.indexOf(";"))!=-1)
  fullVersion=fullVersion.substring(0,ix);
  if ((ix=fullVersion.indexOf(" "))!=-1)
   fullVersion=fullVersion.substring(0,ix);

 majorVersion = parseInt(''+fullVersion,10);
 if (isNaN(majorVersion)) {
   fullVersion  = ''+parseFloat(navigator.appVersion);
   majorVersion = parseInt(navigator.appVersion,10);
 }
 return browserName;
}

//SECTION 1.3: Initiate getUserMedia().
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

if(getBrowser() == "Chrome"){
  var constraints = {"audio": true, "video": {  "mandatory": {  "minWidth": 320,  "maxWidth": 320, "minHeight": 240,"maxHeight": 240 }, "optional": [] } };//Chrome
  //var constraints = {"audio": false, "video": {  "mandatory": {  "minWidth": 320,  "maxWidth": 320, "minHeight": 240,"maxHeight": 240 }, "optional": [] } };//Chrome
}else if(getBrowser() == "Firefox"){
  var constraints = {audio: true,video: {  width: { min: 320, ideal: 320, max: 1280 },  height: { min: 240, ideal: 240, max: 720 }}}; //Firefox
}

function errorCallback(error){
  console.log('navigator.getUserMedia error: ', error);
}


function successCallback(stream) {
  window.stream = stream; // stream available to console
  if (window.URL) {
    videoElement.src = window.URL.createObjectURL(stream);
  } else {
    videoElement.src = stream;
  }
}

navigator.getUserMedia(constraints, successCallback, errorCallback);

//SECTION 1.4: Start MediaRecorder
function startRecording(stream) {
  if (typeof MediaRecorder.isTypeSupported == 'function')
  {
    /*
      MediaRecorder.isTypeSupported is a Chrome 49 function announced in https://developers.google.com/web/updates/2016/01/mediarecorder but it's not present in the MediaRecorder API spec http://www.w3.org/TR/mediastream-recording/
      */
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
       var options = {mimeType: 'video/webm;codecs=vp9'};
     } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
       var options = {mimeType: 'video/webm;codecs=vp8'};
     }
    //console.log('Using '+options.mimeType);
    mediaRecorder = new MediaRecorder(stream, options);
  }else{
    //console.log('Using default codecs for browser');
    mediaRecorder = new MediaRecorder(stream);
  }

//SECTION 1.4.1: Capture webcam stream and push MediaRecorder chunks to a blob. 
mediaRecorder.start(10);
durationSlider.setAttribute('disabled', true);
var track1 = stream.getTracks()[0];
var track2 = stream.getTracks()[1];

mediaRecorder.ondataavailable = function(e) {
  chunks.push(e.data);
};

mediaRecorder.onerror = function(e){
  console.log('Error: ', e);
};

//SECTION 1.4.2: Start timer
var currentTime = Date.parse(new Date());
var deadline = new Date(currentTime + timeInMinutes * 60 * 1000);
var t;
var editStatus = document.getElementById(editStatus);
var countdown = document.getElementById(countdown);

function getTimeRemaining(endtime) {
  t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  return {
    'total': t,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  var secondsSpan = document.getElementById('countdown');

  function updateClock() {
    var t = getTimeRemaining(endtime);
    if(editMode === false){
      secondsSpan.innerHTML = (('0' + t.seconds).slice(-2) + 's');
    }
    else{
      secondsSpan.innerHTML = ('00');
    }
    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }
  updateClock(); // run function once at first to avoid delay
  var timeinterval = setInterval(updateClock, 1000);
}

//SECTION 1.4.3: Actions when MediaRecorder starts and stops
mediaRecorder.onstart = function(){
  initializeClock('clockdiv', deadline);
  document.getElementById('preCount').style.display = "none";
  document.getElementById('countdown').style.display = "block";
  document.getElementById('countdown').style.fontSize = "26px";
  document.getElementById('setDuration').style.display = "none";


  var trackTimer = setInterval(function(){
    if(t === 0){
      clearInterval(trackTimer);
      if(editMode === false){
        onBtnStopClicked();
        document.getElementById("rec").innerHTML = ("Record");
        recording = false;
        recBtn.disabled = true;
        document.getElementById("toggleVid").disabled = false;
        document.getElementById("publish").disabled = false; 
      }
    }
  }, 100);
};

mediaRecorder.onstop = function(){
  var blob = new Blob(chunks, {type: "video/webm"});
  chunks = [];
  videoURL = window.URL.createObjectURL(blob);
  downloadLink.href = videoURL;
  videoElement.src = videoURL;
  downloadLink.innerHTML = 'Download video file';

  var rand =  Math.floor((Math.random() * 10000000));
  var name  = "video_"+rand+".webm" ;

  downloadLink.setAttribute( "download", name);
  downloadLink.setAttribute( "name", name);

  track1.stop();
  track2.stop();
  track2.enabled = false;
  console.log(track2);

  step2();
  toggleVid();
  getDuration();
};
}

//SECTION 1.5: Record button actions
function onBtnRecordClicked (){  
  if(recording === false){
    if(preCountdown){
      recordCountdown();
      preCountdown = false;
    }
    else{
      if (typeof MediaRecorder === 'undefined' || !navigator.getUserMedia) {
       alert('MediaRecorder not supported on your browser, use Firefox 30 or Chrome 49 instead.');
     } else {
       navigator.getUserMedia(constraints, startRecording, errorCallback);
       document.getElementById("rec").innerHTML = ("Stop");
       recording = true;
     }
   }
 }
 else{
  mediaRecorder.stop();
  videoElement.controls = true;
  document.getElementById("rec").innerHTML = ("Record");
  recording = false;
  recBtn.disabled = true;
  document.getElementById("toggleVid").disabled = false;
  document.getElementById("publish").disabled = false; 
}
}


function onBtnStopClicked(){
  mediaRecorder.stop();
  videoElement.controls = true;
}


function recordCountdown(){
  document.getElementById("rec").disabled = true; 
  document.getElementById('setDuration').style.display = "none";
  document.getElementById('preCount').style.display = "block";
  setTimeout(threeRed,1000);
  setTimeout(twoRed,2000);
  setTimeout(oneRed,3000);
  setTimeout(start,4000);
}

function threeRed(){
  document.getElementById('three').style.color = "red";
  document.getElementById('countdownSound1').volume = 0.3;
  document.getElementById('countdownSound1').play();
}

function twoRed(){
  document.getElementById('three').style.color = "white";
  document.getElementById('two').style.color = "red";
}

function oneRed(){
  document.getElementById('two').style.color = "white";
  document.getElementById('one').style.color = "red";   
}

function start(){
 document.getElementById("rec").disabled = false; 
 onBtnRecordClicked();
}

///////////////////
//SECTION 2 BEGINS
///////////////////

//SECTION 2.1: p5 video setup
function setup() {
  canvas = createCanvas(320,240, WEBGL);
  canvas.id('p5canvas');
  background(0);
  pixelDensity(1);
  canvas.parent('editCol');
  //canvas.hide();
}
//SECTION 2.1.1: Toggle Play/Pause button
function toggleVid() {
  if (playing) {
    video.pause();
    $("#toggleVid").html('<img src="css/play.png" />');
    //publishButton.disabled = true;
  } else {
    if(timeReceived){
      video.loop();
      //publishButton.disabled = false;
    } 
    else{
      video.autoplay();
    }
    $("#toggleVid").html('<img src="css/pause.png" />');   
  }
  playing = !playing;
}

//SECTION 2.1.2: Mute/Unmute Button
function muteVid(){
  if(muted === false){
    gainNode.gain.value = 0;
    muted = true;
    $("#muteVid").html('<img src="css/unmute.png" />');
  }
  else{
    gainNode.gain.value = 1;
    muted = false;
    $("#muteVid").html('<img src="css/mute.png" />');
  }
}


//SECTION 2.2: Set up p5 video, Seriously effects, and Web Audio
function step2(){
    if(editMode === false){
        editMode = true; 
    $("#s1").animate({'font-weight': "300"},300);
    $("#s2").animate({'font-weight': "600"},300);
    
    //$(".card-s1").velocity({ top: "400px" }, { duration: 500 });
    $(".step1").fadeOut();  
 
    $(".step2").delay(300).fadeIn();

    //$(".card-s2A").velocity({ left: "-500px" }, { duration: 300 });
    $(".card-s2B").velocity({ left: "-500px" }, { duration: 300 }); 
    $(".card-s2C").velocity({ left: "500px" }, { duration: 300 });  
    
    //$(".card-s2A").velocity({ left: "0px" }, { duration: 300 },"ease-in-out");
    $(".card-s2B").velocity({ left: "0px" }, { duration: 300 },"ease-in-out");
    $(".card-s2C").velocity({ left: "0px" }, { duration: 300 },"ease-in-out");


    $("#s1").mouseenter(function(){
      $(this).css({"color":"#dddddd","cursor":"pointer"});
    }).mouseleave(function(){
      $(this).css({"color":"#ffffff","cursor":"default"})
    }).click(function(){
      location.reload();
    });

    $('[data-toggle="tooltip"]').tooltip();

    $("clockdiv").hide();
    editStatus.innerHTML = ("Status: Analyzing for Time...<div class='spinner1'><div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div></div>");

    document.getElementById("toggleVid").disabled = true;
    document.getElementById("muteVid").disabled = true;
    document.getElementById("publish").disabled = true;
    document.getElementById("glitch").disabled = true;
    document.getElementById("saturate").disabled = true;
    document.getElementById("slow").disabled = true;
    document.getElementById("freeze").disabled = true;
    document.getElementById("stutter").disabled = true;
//SECTION 2.2.1: Set up p5 video and audio
    video = createVideo([videoURL]);
    video.size(320,240);
    video.id('p5video');
    video.hide();
    translate(320,0);
    scale(-1,1);

    //FRAME PREVIEW
    //framePreview = createVideo([videoURL]);
    //framePreview.size(200,150);
    //framePreview.parent('framePreview');
    //framePreview.play();

    greatJobAudio = createAudio("css/GreatJob.mp3");
    greatJobAudio.id('greatJob');
//SECTION 2.2.2: Set up Seriously effects
    var seriously = new Seriously();
    src = seriously.source('#p5video');
    target = seriously.target('#p5canvas');

    blur = seriously.effect('blur');
    blur.source = src;
    target.source = blur;
    blur.amount = 0;
    //addNoise = seriously.effect('noise');
    //addNoise.source = src;
    tv = seriously.effect('tvglitch');
    tv.source = src;
    repeat = seriously.effect('repeat');
    repeat.source = src;
    crop = seriously.effect('crop');
    crop.source = src;
    //ripple = seriously.effect('ripple');
    //ripple.source = src;
    hueSaturation = seriously.effect('hue-saturation');
    hueSaturation.source = src;
    //hueSaturation.source = tv;

    reformat = seriously.transform('reformat');
    reformat.source = src;

    seriously.go();   
//SECTION 2.2.3: Set up Web Audio and start MediaStream
    var audioCtx = new AudioContext();
    var dest = audioCtx.createMediaStreamDestination();
    gainNode = audioCtx.createGain();
    aStream = dest.stream;
    var myVid = document.getElementById("p5video");
    var sourceNode = audioCtx.createMediaElementSource(myVid);
    sourceNode.connect(dest);

    sourceNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);    
    //sourceNode.connect(audioCtx.destination);    

    //var gj = document.getElementById('greatJob'); 
    //var sourceNode2 = audioCtx.createMediaElementSource(gj);
    //sourceNode2.connect(dest);
    //sourceNode2.connect(audioCtx.destination);
    
    startStream();
  }
}

//SECTION 2.3: Get duration, turn on buttons, and configure progress bar
function getDuration(){
  video.onended(function(){
    console.log(video.time()); 
    duration = video.time();
    video.loop();

    timeReceived = true;
    editStatus.innerHTML = ("Status: Ready to Edit");
    document.getElementById("toggleVid").disabled = false;
    document.getElementById("muteVid").disabled = false;
    document.getElementById("publish").disabled = false;
    document.getElementById("glitch").disabled = false;
    document.getElementById("saturate").disabled = false;
    document.getElementById("slow").disabled = false;
    document.getElementById("freeze").disabled = false;
    document.getElementById("stutter").disabled = false;

//SECTION 2.3.1: Configure progress bar
/*var progress = document.getElementById("progress");
progress.setAttribute('max', duration);
document.getElementById("progress").disabled = false;    

/*
document.getElementById("p5video").addEventListener('timeupdate', function(){
  progress.value = document.getElementById("p5video").currentTime;
}); */

/*var colOffset = 113;

progress.addEventListener('click', function(e) {
  var mouseOffsetX = $(this).offset().left;
  var pos = (e.pageX - mouseOffsetX) / this.offsetWidth;
  document.getElementById("p5video").currentTime = pos * duration;
}); */



});
}

//SECTION 2.4: Apply Seriously effects using p5's draw() calls

function draw(){

  if(editMode === true){
    if(timeReceived === true){
    //progress.value = document.getElementById("p5video").currentTime;
    }

    timeCode = video.time();

    
    if(panel1Filled){
    document.getElementById('progress1').max = duration;
    document.getElementById('progress1').value = document.getElementById("p5video").currentTime;
     panel1StartEnd = newSlider1.noUiSlider.get();
     panel1Start = panel1StartEnd[0];
     panel1End = panel1StartEnd[1]; 
   }
   if(panel2Filled){
    document.getElementById('progress2').max = duration;
    document.getElementById('progress2').value = document.getElementById("p5video").currentTime;
     panel2StartEnd = newSlider2.noUiSlider.get();
     panel2Start = panel2StartEnd[0];
     panel2End = panel2StartEnd[1]; 
   }
   if(panel3Filled){
    document.getElementById('progress3').max = duration;
    document.getElementById('progress3').value = document.getElementById("p5video").currentTime;
     panel3StartEnd = newSlider3.noUiSlider.get();
     panel3Start = panel3StartEnd[0];
     panel3End = panel3StartEnd[1]; 
   }



  //SECTION 2.4.1: Seriously "Glitch" effect
  if(panel1Effect === "Glitch"){
    if(timeCode >= panel1Start && timeCode <= panel1End){
      target.source = tv;
      tv.distortion = 0.2;
      //hueSaturation.source = tv;
      //reformat.source = hueSaturation;
    }
  } 
  if(panel2Effect === "Glitch"){
    if(timeCode >= panel2Start && timeCode <= panel2End){
      target.source = tv;
      tv.distortion = 0.2;
    }
  } 
  if(panel3Effect === "Glitch"){
    if(timeCode >= panel3Start && timeCode <= panel3End){
      target.source = tv;
      tv.distortion = 0.2;
    }
  } 
  //SECTION 2.4.2: Seriously "Saturate" effect
  if(panel1Effect === "Saturate"){
    if(timeCode >= panel1Start && timeCode <= panel1End){
      target.source = hueSaturation;
      hueSaturation.saturation = 0.85;
      hueSaturation.hue = 0;
    } 
  } 
  if(panel2Effect === "Saturate"){
    if(timeCode >= panel2Start && timeCode <= panel2End){
      target.source = hueSaturation;
      hueSaturation.saturation = 0.85;
      hueSaturation.hue = 0;
    } 
  } 
  if(panel3Effect === "Saturate"){
    if(timeCode >= panel3Start && timeCode <= panel3End){
      target.source = hueSaturation;
      hueSaturation.saturation = 0.85;
      hueSaturation.hue = 0;
    } 
  } 
  //SECTION 2.4.3: Seriously "Slow" effect
  if(panel1Effect === "Slow"){
    if(timeCode >= panel1Start && timeCode <= panel1End){
      document.getElementById("p5video").playbackRate = 0.5;
      reformat.mode = 'contain';
      target.source = reformat;
      reformat.width = 500;
      reformat.height = 3000;           
    } 
  } 
  if(panel2Effect === "Slow"){
    if(timeCode >= panel2Start && timeCode <= panel2End){
      document.getElementById("p5video").playbackRate = 0.5;
      reformat.mode = 'contain';
      target.source = reformat;
      reformat.width = 500;
      reformat.height = 3000;      
    } 
  } 
  if(panel3Effect === "Slow"){
    if(timeCode >= panel3Start && timeCode <= panel3End){
      document.getElementById("p5video").playbackRate = 0.5;
      reformat.mode = 'contain';
      target.source = reformat;
      reformat.width = 500;
      reformat.height = 3000;      
    } 
  } 

  //SECTION 2.4.4: Seriously "Stutter" effect 
  if(panel1Effect === "Stutter"){  
  if(stutter1On === false){
    if(timeCode > 0 && timeCode < 0.05){
       stutter1On = true;  
    }
  }
  if(stutter1On){
    if(timeCode >= panel1StartEnd[1]){       
      stutter1Counter = stutter1Counter + 1;
      video.time(eval(panel1StartEnd[0]));
      //console.log(stutter1Counter);
    } 
    if(stutter1Counter > 4){
      stutter1Counter = 0;
      stutter1On = false;
    }
  } 
}
if(panel2Effect === "Stutter"){  
  if(stutter2On === false){
    if(timeCode > 0 && timeCode < 0.05){
       stutter2On = true;  
    }
  }
  if(stutter2On){
    if(timeCode >= panel2StartEnd[1]){       
      stutter2Counter = stutter2Counter + 1;
      video.time(eval(panel2StartEnd[0]));
      //console.log(stutter2Counter);
    } 
    if(stutter2Counter > 4){
      stutter2Counter = 0;
      stutter2On = false;
    }
  } 
}
if(panel3Effect === "Stutter"){  
  if(stutter3On === false){
    if(timeCode > 0 && timeCode < 0.05){
       stutter3On = true;  
    }
  }
  if(stutter3On){
    if(timeCode >= panel3StartEnd[1]){       
      stutter3Counter = stutter3Counter + 1;
      video.time(eval(panel3StartEnd[0]));
      //console.log(stutter3Counter);
    } 
    if(stutter3Counter > 4){
      stutter3Counter = 0;
      stutter3On = false;
    }
  } 
} 


  //SECTION 2.4.6: No Seriously effects
  if(timeCode <= panel1Start || timeCode >= panel1End || timeCode >= eval(panel1StartEnd)){
    if(timeCode <= panel2Start || timeCode >= panel2End || timeCode >= eval(panel2StartEnd)){
      if(timeCode <= panel3Start || timeCode >= panel3End || timeCode >= eval(panel3StartEnd)){
        target.source = crop;
        tv.source = src;
        hueSaturation.source = src;
        reformat.source = src;

        hueSaturation.saturation = 0;
        reformat.mode = 'contain';
        hueSaturation.hue = 0.4;
        video.speed(1);
        reformat.width = 0;
        reformat.height = 0;
        repeat.repeat = 0;
        greatJobAudio.pause();
        greatJobAudio.time(0);
        greatJobPlayed1 = false;
        greatJobPlayed2 = false;
        greatJobPlayed3 = false;
        document.getElementById("p5video").muted = false;

      }
    }
  }


  //FRAME PREVIEWING AND DURATION DISPLAY
  if(panel1Filled){
    newSlider1.noUiSlider.on('slide',function(values,handle){  
      if(handle === 0){
        if(panel1Effect === "Stutter"){
          //framePreview.time(panel1StartEnd);
        }
        else{
          //framePreview.time(panel1Start);
        }
      }
      else if(handle === 1){
        //framePreview.time(panel1End);
      }
    });
    newSlider1.noUiSlider.on('slide',function(values,handle){
      if(handle === 0){
        $('.start-1').html("Start: " + Math.round(100*panel1Start)/100);
      }
      else if(handle === 1){
        $('.end-1').html("End: " + Math.round(100*panel1End)/100);
      }
    }); 
  }

  if(panel2Filled){
    newSlider2.noUiSlider.on('slide',function(values,handle){  
      if(handle === 0){
        if(panel2Effect === "Stutter"){
          //framePreview.time(panel2StartEnd);
        }
        else{
          //framePreview.time(panel2Start);
        }
      }
      else if(handle === 1){
        //framePreview.time(panel2End);
      }
    });
    newSlider2.noUiSlider.on('slide',function(values,handle){
      if(handle === 0){
        $('.start-2').html("Start: " + Math.round(100*panel2Start)/100);
      }
      else if(handle === 1){
        $('.end-2').html("End: " + Math.round(100*panel2End)/100);
      }
    }); 
  }

  if(panel3Filled){
    newSlider3.noUiSlider.on('slide',function(values,handle){  
      if(handle === 0){
        if(panel3Effect === "Stutter"){
          //framePreview.time(panel3StartEnd);
        }
        else{
          //framePreview.time(panel3Start);
        }
      }
      else if(handle === 1){
        //framePreview.time(panel3End);
      }
    });
    newSlider3.noUiSlider.on('slide',function(values,handle){
      if(handle === 0){
        $('.start-3').html("Start: " + Math.round(100*panel3Start)/100);
      }
      else if(handle === 1){
        $('.end-3').html("End: " + Math.round(100*panel3End)/100);
      }
    }); 
  }
  

  }//If editmode true
}//END DRAW

//SECTION 2.5: Set up sliders
function allowDrop(ev) {
    ev.preventDefault();
    ev.stopPropagation();
}

//ADD WITH CLICKING AND DRAGGING
//SECTION 2.5.1: Glitch effect sliders
function glitchAdd(event){
  event.preventDefault();  
  event.stopPropagation();
  var dropStatus = event.dataTransfer.dropEffect;
  if(dropStatus === "copy"){

  if(panel1Filled === false){
    panel1Filled = true;
    panel1Effect = "Glitch";
    $(".effectPanel1").html("<span class='effectName'>Glitch</span> <span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider1'></div><progress id='progress1' value='0' min='0'></progress></div><span class='timelineStart start-1'>Start: 0.00</span><span class='timelineEnd end-1'>End: " + 0.5 + "</span>");
    newSlider1 = document.getElementById('newSlider1');
    noUiSlider.create(newSlider1, {
      start:[0,0.5],
      tooltips: [ false, false ],
      step:0.01,
      connect:true,
      orientation:'horizontal',
      behaviour:'tap-drag',
      range:{
        'min':0,
        'max':duration
      }
    });
    $("#newSlider1 .noUi-connect").css("background","#c0392b");
    panel1StartEnd = newSlider1.noUiSlider.get();
  } else{
    if(panel2Filled === false){
      panel2Filled = true;
      panel2Effect = "Glitch";
      $(".effectPanel2").html("<span class='effectName'>Glitch</span> <span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider2'></div><progress id='progress2' value='0' min='0'></progress></div><span class='timelineStart start-2'>Start: 0.00</span><span class='timelineEnd end-2'>End: " + 0.5 + "</span>");
      newSlider2 = document.getElementById('newSlider2');
      noUiSlider.create(newSlider2, {
        start:[0,0.5],
        tooltips: [ false, false ],
        step:0.01,
        connect:true,
        orientation:'horizontal',
        behaviour:'tap-drag',
        range:{
          'min':0,
          'max':duration
        }
      });
      $("#newSlider2 .noUi-connect").css("background","#c0392b");
      panel2StartEnd = newSlider2.noUiSlider.get();
    } else{
      if(panel3Filled === false){
        panel3Filled = true;
        panel3Effect = "Glitch";
        $(".effectPanel3").html("<span class='effectName'>Glitch</span> <span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider3'></div><progress id='progress3' value='0' min='0'></progress></div><span class='timelineStart start-3'>Start: 0.00</span><span class='timelineEnd end-3'>End: " + 0.5 + "</span>");
        newSlider3 = document.getElementById('newSlider3');
        noUiSlider.create(newSlider3, {
          start:[0,0.5],
          tooltips: [ false, false ],
          step:0.01,
          connect:true,
          orientation:'horizontal',
          behaviour:'tap-drag',
          range:{
            'min':0,
            'max':duration
          }
        });
        $("#newSlider3 .noUi-connect").css("background","#c0392b");
        panel3StartEnd = newSlider3.noUiSlider.get();
      }
      else{
        alert("Please delete an existing effect to add a new one.");
  }//ELSE for Panel 3
  }//ELSE for Panel 2
  }//ELSE for Panel 1
}
}
function glitchClick(){
  if(panel1Filled === false){
    panel1Filled = true;
    panel1Effect = "Glitch";
    $(".effectPanel1").html("<span class='effectName'>Glitch</span> <span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider1'></div><progress id='progress1' value='0' min='0'></progress></div><span class='timelineStart start-1'>Start: 0.00</span><span class='timelineEnd end-1'>End: " + 0.5 + "</span>");
    newSlider1 = document.getElementById('newSlider1');
    noUiSlider.create(newSlider1, {
      start:[0,0.5],
      tooltips: [ false, false ],
      step:0.01,
      connect:true,
      orientation:'horizontal',
      behaviour:'tap-drag',
      range:{
        'min':0,
        'max':duration
      }
    });
    $("#newSlider1 .noUi-connect").css("background","#c0392b");
    panel1StartEnd = newSlider1.noUiSlider.get();
  } else{
    if(panel2Filled === false){
      panel2Filled = true;
      panel2Effect = "Glitch";
      $(".effectPanel2").html("<span class='effectName'>Glitch</span> <span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider2'></div><progress id='progress2' value='0' min='0'></progress></div><span class='timelineStart start-2'>Start: 0.00</span><span class='timelineEnd end-2'>End: " + 0.5 + "</span>");
      newSlider2 = document.getElementById('newSlider2');
      noUiSlider.create(newSlider2, {
        start:[0,0.5],
        tooltips: [ false, false ],
        step:0.01,
        connect:true,
        orientation:'horizontal',
        behaviour:'tap-drag',
        range:{
          'min':0,
          'max':duration
        }
      });
      $("#newSlider2 .noUi-connect").css("background","#c0392b");
      panel2StartEnd = newSlider2.noUiSlider.get();
    } else{
      if(panel3Filled === false){
        panel3Filled = true;
        panel3Effect = "Glitch";
        $(".effectPanel3").html("<span class='effectName'>Glitch</span> <span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider3'></div><progress id='progress3' value='0' min='0'></progress></div><span class='timelineStart start-3'>Start: 0.00</span><span class='timelineEnd end-3'>End: " + 0.5 + "</span>");
        newSlider3 = document.getElementById('newSlider3');
        noUiSlider.create(newSlider3, {
          start:[0,0.5],
          tooltips: [ false, false ],
          step:0.01,
          connect:true,
          orientation:'horizontal',
          behaviour:'tap-drag',
          range:{
            'min':0,
            'max':duration
          }
        });
        $("#newSlider3 .noUi-connect").css("background","#c0392b");
        panel3StartEnd = newSlider3.noUiSlider.get();
      }
      else{
        alert("Please delete an existing effect to add a new one.");
  }//ELSE for Panel 3
  }//ELSE for Panel 2
  }//ELSE for Panel 1
}

//SECTION 2.5.2: Saturate effect sliders
function saturateAdd(event){
  event.preventDefault();  
  event.stopPropagation();
  var dropStatus = event.dataTransfer.dropEffect;
  if(dropStatus === "copy"){

  if(panel1Filled === false){
    panel1Filled = true;
    panel1Effect = "Saturate";
    $(".effectPanel1").html("<span class='effectName'>Saturate</span> </span><span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider1'></div><progress id='progress1' value='0' min='0'></progress></div><span class='timelineStart start-1'>Start: 0.00</span><span class='timelineEnd end-1'>End: " + 0.5 + "</span>");
    newSlider1 = document.getElementById('newSlider1');
    noUiSlider.create(newSlider1, {
      start:[0,0.5],
      tooltips: [ false, false ],
      step:0.01,
      connect:true,
      orientation:'horizontal',
      behaviour:'tap-drag',
      range:{
        'min':0,
        'max':duration
      }
    });
    $("#newSlider1 .noUi-connect").css("background","#8e44ad");
    panel1StartEnd = newSlider1.noUiSlider.get();
  } else{
    if(panel2Filled === false){
      panel2Filled = true;
      panel2Effect = "Saturate";
      $(".effectPanel2").html("<span class='effectName'>Saturate</span> <span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider2'></div><progress id='progress2' value='0' min='0'></progress></div><span class='timelineStart start-2'>Start: 0.00</span><span class='timelineEnd end-2'>End: " + 0.5 + "</span>");
      newSlider2 = document.getElementById('newSlider2');
      noUiSlider.create(newSlider2, {
        start:[0,0.5],
        tooltips: [ false, false ],
        step:0.01,
        connect:true,
        orientation:'horizontal',
        behaviour:'tap-drag',
        range:{
          'min':0,
          'max':duration
        }
      });
      $("#newSlider2 .noUi-connect").css("background","#8e44ad");
      panel2StartEnd = newSlider2.noUiSlider.get();
    } else{
      if(panel3Filled === false){
        panel3Filled = true;
        panel3Effect = "Saturate";
        $(".effectPanel3").html("<span class='effectName'>Saturate</span> <span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider3'></div><progress id='progress3' value='0' min='0'></progress></div><span class='timelineStart start-3'>Start: 0.00</span><span class='timelineEnd end-3'>End: " + 0.5 + "</span>");
        newSlider3 = document.getElementById('newSlider3');

        noUiSlider.create(newSlider3, {
          start:[0,0.5],
          tooltips: [ false, false ],
          step:0.01,
          connect:true,
          orientation:'horizontal',
          behaviour:'tap-drag',
          range:{
            'min':0,
            'max':duration
          }
        });
        $("#newSlider3 .noUi-connect").css("background","#8e44ad");
        panel3StartEnd = newSlider3.noUiSlider.get();
      }
      else{
        alert("Please delete an existing effect to add a new one.");
}//ELSE for Panel 3
}//ELSE for Panel 2
}//ELSE for Panel 1
}
}
function saturateClick(){
  if(panel1Filled === false){
    panel1Filled = true;
    panel1Effect = "Saturate";
    $(".effectPanel1").html("<span class='effectName'>Saturate</span> </span><span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider1'></div><progress id='progress1' value='0' min='0'></progress></div><span class='timelineStart start-1'>Start: 0.00</span><span class='timelineEnd end-1'>End: " + 0.5 + "</span>");
    newSlider1 = document.getElementById('newSlider1');
    noUiSlider.create(newSlider1, {
      start:[0,0.5],
      tooltips: [ false, false ],
      step:0.01,
      connect:true,
      orientation:'horizontal',
      behaviour:'tap-drag',
      range:{
        'min':0,
        'max':duration
      }
    });
    $("#newSlider1 .noUi-connect").css("background","#8e44ad");
    panel1StartEnd = newSlider1.noUiSlider.get();
  } else{
    if(panel2Filled === false){
      panel2Filled = true;
      panel2Effect = "Saturate";
      $(".effectPanel2").html("<span class='effectName'>Saturate</span> <span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider2'></div><progress id='progress2' value='0' min='0'></progress></div><span class='timelineStart start-2'>Start: 0.00</span><span class='timelineEnd end-2'>End: " + 0.5 + "</span>");
      newSlider2 = document.getElementById('newSlider2');
      noUiSlider.create(newSlider2, {
        start:[0,0.5],
        tooltips: [ false, false ],
        step:0.01,
        connect:true,
        orientation:'horizontal',
        behaviour:'tap-drag',
        range:{
          'min':0,
          'max':duration
        }
      });
      $("#newSlider2 .noUi-connect").css("background","#8e44ad");
      panel2StartEnd = newSlider2.noUiSlider.get();
    } else{
      if(panel3Filled === false){
        panel3Filled = true;
        panel3Effect = "Saturate";
        $(".effectPanel3").html("<span class='effectName'>Saturate</span> <span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider3'></div><progress id='progress3' value='0' min='0'></progress></div><span class='timelineStart start-3'>Start: 0.00</span><span class='timelineEnd end-3'>End: " + 0.5 + "</span>");
        newSlider3 = document.getElementById('newSlider3');

        noUiSlider.create(newSlider3, {
          start:[0,0.5],
          tooltips: [ false, false ],
          step:0.01,
          connect:true,
          orientation:'horizontal',
          behaviour:'tap-drag',
          range:{
            'min':0,
            'max':duration
          }
        });
        $("#newSlider3 .noUi-connect").css("background","#8e44ad");
        panel3StartEnd = newSlider3.noUiSlider.get();
      }
      else{
        alert("Please delete an existing effect to add a new one.");
}//ELSE for Panel 3
}//ELSE for Panel 2
}//ELSE for Panel 1
}

//SECTION 2.5.3: Slow effect sliders
function slowAdd(event){
  event.preventDefault();  
  event.stopPropagation();
  var dropStatus = event.dataTransfer.dropEffect;
  if(dropStatus === "copy"){

  if(panel1Filled === false){
    panel1Filled = true;
    panel1Effect = "Slow";
    $(".effectPanel1").html("<span class='effectName'>Slow</span> <span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider1'></div><progress id='progress1' value='0' min='0'></progress></div><span class='timelineStart start-1'>Start: 0.00</span><span class='timelineEnd end-1'>End: " + 0.5 + "</span>");
    newSlider1 = document.getElementById('newSlider1');
    noUiSlider.create(newSlider1, {
      start:[0,0.5],
      tooltips: [ false, false ],
      step:0.01,
      connect:true,
      orientation:'horizontal',
      behaviour:'tap-drag',
      range:{
        'min':0,
        'max':duration
      }
    });
    $("#newSlider1 .noUi-connect").css("background","#e67e22");
    panel1StartEnd = newSlider1.noUiSlider.get();
  } else{
    if(panel2Filled === false){
      panel2Filled = true;
      panel2Effect = "Slow";
      $(".effectPanel2").html("<span class='effectName'>Slow</span> <span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider2'></div><progress id='progress2' value='0' min='0'></progress></div><span class='timelineStart start-2'>Start: 0.00</span><span class='timelineEnd end-2'>End: " + 0.5 + "</span>");
      newSlider2 = document.getElementById('newSlider2');
      noUiSlider.create(newSlider2, {
        start:[0,0.5],
        tooltips: [ false, false ],
        step:0.01,
        connect:true,
        orientation:'horizontal',
        behaviour:'tap-drag',
        range:{
          'min':0,
          'max':duration
        }
      });
      $("#newSlider2 .noUi-connect").css("background","#e67e22");
      panel2StartEnd = newSlider2.noUiSlider.get();
    } else{
      if(panel3Filled === false){
        panel3Filled = true;
        panel3Effect = "Slow";
        $(".effectPanel3").html("<span class='effectName'>Slow</span> <span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider3'></div><progress id='progress3' value='0' min='0'></progress></div><span class='timelineStart start-3'>Start: 0.00</span><span class='timelineEnd end-3'>End: " + 0.5 + "</span>");
        newSlider3 = document.getElementById('newSlider3');

        noUiSlider.create(newSlider3, {
          start:[0,0.5],
          tooltips: [ false, false ],
          step:0.01,
          connect:true,
          orientation:'horizontal',
          behaviour:'tap-drag',
          range:{
            'min':0,
            'max':duration
          }
        });
        $("#newSlider3 .noUi-connect").css("background","#e67e22");
        panel3StartEnd = newSlider3.noUiSlider.get();
      }
      else{
        alert("Please delete an existing effect to add a new one.");
}//ELSE for Panel 3
}//ELSE for Panel 2
}//ELSE for Panel 1
}
}
function slowClick(){
  if(panel1Filled === false){
    panel1Filled = true;
    panel1Effect = "Slow";
    $(".effectPanel1").html("<span class='effectName'>Slow</span> <span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider1'></div><progress id='progress1' value='0' min='0'></progress></div><span class='timelineStart start-1'>Start: 0.00</span><span class='timelineEnd end-1'>End: " + 0.5 + "</span>");
    newSlider1 = document.getElementById('newSlider1');
    noUiSlider.create(newSlider1, {
      start:[0,0.5],
      tooltips: [ false, false ],
      step:0.01,
      connect:true,
      orientation:'horizontal',
      behaviour:'tap-drag',
      range:{
        'min':0,
        'max':duration
      }
    });
    $("#newSlider1 .noUi-connect").css("background","#e67e22");
    panel1StartEnd = newSlider1.noUiSlider.get();
  } else{
    if(panel2Filled === false){
      panel2Filled = true;
      panel2Effect = "Slow";
      $(".effectPanel2").html("<span class='effectName'>Slow</span> <span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider2'></div><progress id='progress2' value='0' min='0'></progress></div><span class='timelineStart start-2'>Start: 0.00</span><span class='timelineEnd end-2'>End: " + 0.5 + "</span>");
      newSlider2 = document.getElementById('newSlider2');
      noUiSlider.create(newSlider2, {
        start:[0,0.5],
        tooltips: [ false, false ],
        step:0.01,
        connect:true,
        orientation:'horizontal',
        behaviour:'tap-drag',
        range:{
          'min':0,
          'max':duration
        }
      });
      $("#newSlider2 .noUi-connect").css("background","#e67e22");
      panel2StartEnd = newSlider2.noUiSlider.get();
    } else{
      if(panel3Filled === false){
        panel3Filled = true;
        panel3Effect = "Slow";
        $(".effectPanel3").html("<span class='effectName'>Slow</span> <span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider3'></div><progress id='progress3' value='0' min='0'></progress></div><span class='timelineStart start-3'>Start: 0.00</span><span class='timelineEnd end-3'>End: " + 0.5 + "</span>");
        newSlider3 = document.getElementById('newSlider3');

        noUiSlider.create(newSlider3, {
          start:[0,0.5],
          tooltips: [ false, false ],
          step:0.01,
          connect:true,
          orientation:'horizontal',
          behaviour:'tap-drag',
          range:{
            'min':0,
            'max':duration
          }
        });
        $("#newSlider3 .noUi-connect").css("background","#e67e22");
        panel3StartEnd = newSlider3.noUiSlider.get();
      }
      else{
        alert("Please delete an existing effect to add a new one.");
}//ELSE for Panel 3
}//ELSE for Panel 2
}//ELSE for Panel 1
}

//SECTION 2.5.4: Stutter effect sliders
function stutterAdd(event){
  event.preventDefault();  
  event.stopPropagation();
  var dropStatus = event.dataTransfer.dropEffect;
  if(dropStatus === "copy"){

  if(panel1Filled === false){
    panel1Filled = true;
    panel1Effect = "Stutter";
    $(".effectPanel1").html("<span class='effectName'>Stutter</span> <span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider1'></div><progress id='progress1' value='0' min='0'></progress></div><span class='timelineStart start-1'>Start: 0.00</span><span class='timelineEnd end-1'>End: " + 0.5 + "</span>");
    newSlider1 = document.getElementById('newSlider1');
    noUiSlider.create(newSlider1, {
      start:[0, 0.5],
      tooltips: [false, false],
      step:0.01,
      connect:true,
      orientation:'horizontal',
      behaviour:'tap-drag',
      range:{
        'min':0.05,
        'max':duration
      }
    });
    $("#newSlider1 .noUi-connect").css("background","#27ae60");
    panel1StartEnd = newSlider1.noUiSlider.get();
  } else{
    if(panel2Filled === false){
      panel2Filled = true;
      panel2Effect = "Stutter";
      $(".effectPanel2").html("<span class='effectName'>Stutter</span> <span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider2'></div><progress id='progress2' value='0' min='0'></progress></div><span class='timelineStart start-2'>Start: 0.00</span><span class='timelineEnd end-2'>End: " + 0.5 + "</span>");
      newSlider2 = document.getElementById('newSlider2');
      noUiSlider.create(newSlider2, {
        start:[0, 0.5],
        tooltips: [ false, false ],
        step:0.01,
        connect:true,
        orientation:'horizontal',
        behaviour:'tap-drag',
        range:{
          'min':0.05,
          'max':duration
        }
      });
      $("#newSlider2 .noUi-connect").css("background","#27ae60");
      panel2StartEnd = newSlider2.noUiSlider.get();
    } else{
      if(panel3Filled === false){
        panel3Filled = true;
        panel3Effect = "Stutter";
        $(".effectPanel3").html("<span class='effectName'>Stutter</span> <span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider3'></div><progress id='progress3' value='0' min='0'></progress></div><span class='timelineStart start-3'>Start: 0.00</span><span class='timelineEnd end-3'>End: " + 0.5 + "</span>");
        newSlider3 = document.getElementById('newSlider3');
        noUiSlider.create(newSlider3, {
          start:[0, 0.5],
          tooltips: [ false, false ],
          step:0.01,
          connect:true,
          orientation:'horizontal',
          behaviour:'tap-drag',
          range:{
            'min':0.05,
            'max':duration
          }
        });
        $("#newSlider3 .noUi-connect").css("background","#27ae60");
        panel3StartEnd = newSlider3.noUiSlider.get();
      }
      else{
        alert("Please delete an existing effect to add a new one.");
}//ELSE for Panel 3
}//ELSE for Panel 2
}//ELSE for Panel 1
}
}
function stutterClick(event){
  if(panel1Filled === false){
    panel1Filled = true;
    panel1Effect = "Stutter";
    $(".effectPanel1").html("<span class='effectName'>Stutter</span> <span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider1'></div><progress id='progress1' value='0' min='0'></progress></div><span class='timelineStart start-1'>Start: 0.00</span><span class='timelineEnd end-1'>End: " + 0.5 + "</span>");
    newSlider1 = document.getElementById('newSlider1');
    noUiSlider.create(newSlider1, {
      start:[0,0.5],
      tooltips: [false,false],
      step:0.01,
      connect:true,
      orientation:'horizontal',
      behaviour:'tap-drag',
      range:{
        'min':0.05,
        'max':duration
      }
    });
    $("#newSlider1 .noUi-connect").css("background","#27ae60");
    panel1StartEnd = newSlider1.noUiSlider.get();
  } else{
    if(panel2Filled === false){
      panel2Filled = true;
      panel2Effect = "Stutter";
      $(".effectPanel2").html("<span class='effectName'>Stutter</span> <span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider2'></div><progress id='progress2' value='0' min='0'></progress></div><span class='timelineStart start-2'>Start: 0.00</span><span class='timelineEnd end-2'>End: " + 0.5 + "</span>");
      newSlider2 = document.getElementById('newSlider2');
      noUiSlider.create(newSlider2, {
        start:[0,0.5],
        tooltips: [ false, false ],
        step:0.01,
        connect:true,
        orientation:'horizontal',
        behaviour:'tap-drag',
        range:{
          'min':0.05,
          'max':duration
        }
      });
      $("#newSlider2 .noUi-connect").css("background","#27ae60");
      panel2StartEnd = newSlider2.noUiSlider.get();
    } else{
      if(panel3Filled === false){
        panel3Filled = true;
        panel3Effect = "Stutter";
        $(".effectPanel3").html("<span class='effectName'>Stutter</span> <span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div class='effect-timeline'><div id='newSlider3'></div><progress id='progress3' value='0' min='0'></progress></div><span class='timelineStart start-3'>Start: 0.00</span><span class='timelineEnd end-3'>End: " + 0.5 + "</span>");
        newSlider3 = document.getElementById('newSlider3');
        noUiSlider.create(newSlider3, {
          start:[0,0.5],
          tooltips: [ false, false ],
          step:0.01,
          connect:true,
          orientation:'horizontal',
          behaviour:'tap-drag',
          range:{
            'min':0.05,
            'max':duration
          }
        });
        $("#newSlider3 .noUi-connect").css("background","#27ae60");
        panel3StartEnd = newSlider3.noUiSlider.get();
      }
      else{
        alert("Please delete an existing effect to add a new one.");
}//ELSE for Panel 3
}//ELSE for Panel 2
}//ELSE for Panel 1
}

//SECTION 2.5.6: Delete any effect
$(document).on("click",".deleteEffect",function(){
  if($(this).parent().attr("id") === "effectPanel1"){
    panel1Filled = false;
    panel1Effect = "";
    $(".effectPanel1").html("<span class='effectName'>Effect 1</span>");
  }
  else if($(this).parent().attr("id") === "effectPanel2"){
    panel2Filled = false;
    panel2Effect = "";
    $(".effectPanel2").html("<span class='effectName'>Effect 2</span>");
  }
  else if($(this).parent().attr("id") === "effectPanel3"){
    panel3Filled = false;
    panel3Effect = "";
    $(".effectPanel3").html("<span class='effectName'>Effect 3</span>");
  }
  $(this).parent().empty();  
});
//SECTION 2.6: Set video title/author/tags
$("#vidName").on("input",function(){
vidName = document.getElementById('vidName').value;
});
$("#authorName").on("input",function(){
authorName = document.getElementById('authorName').value;
});


$("#tags").on("input",function(){
tags = document.getElementById('tags').value;
tagList = tags.split(",");

  for(var i=1;i<=tagList.length;i++){
    tagList[i-1] = tagList[i-1].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  } 

//console.log(tagList);
});


///////////////////
//SECTION 3 BEGINS
///////////////////

//SECTION 3.1: Start MediaStream
function startStream(){
  if(editMode === true){
     myCanvas = document.getElementById("p5canvas");
    canvasPublish = myCanvas.captureStream();
    canvasPublish.addTrack(aStream.getAudioTracks()[0]);
    console.log('Started stream capture from canvas element: ', canvasPublish);
  }
}

//SECTION 3.2: Initiate publishing
function publish(){
  if (publishButton.textContent === 'Publish') { 
    video.time(0);
    if(!playing){
      video.play();
      $("#toggleVid").html('<img src="css/pause.png" />');
      playing = true;  
    }  
    document.getElementById("p5video").loop = false;  
    $("#publish").tooltip('hide');
    startRecordingPublish();
    //publishButton.textContent = 'Publishing';
    editStatus.innerHTML = ("Status: Publishing...<div class='spinner1'><div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div></div>");
    document.getElementById("toggleVid").disabled = true;
    document.getElementById("muteVid").disabled = true;
    document.getElementById("publish").disabled = true;
    document.getElementById("glitch").disabled = true;
    document.getElementById("saturate").disabled = true;
    document.getElementById("slow").disabled = true;
    document.getElementById("freeze").disabled = true;
    document.getElementById("stutter").disabled = true;
    finish();
  } else {
    //stopRecordingPublish();
    //var superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
    //videoFinal.src = window.URL.createObjectURL(superBuffer);
    //publishButton.textContent = 'Published';
  }
}
//SECTION 3.2.1: Start MediaRecorder
function startRecordingPublish() {
  var options = {mimeType: 'video/webm'};
  recordedBlobs = [];
  try {
    mediaRecorder = new MediaRecorder(canvasPublish, options);
  } catch (e0) {
    console.log('Unable to create MediaRecorder with options Object: ', e0);
    try {
      options = {mimeType: 'video/webm,codecs=vp9'};
      mediaRecorder = new MediaRecorder(canvasPublish, options);
    } catch (e1) {
      console.log('Unable to create MediaRecorder with options Object: ', e1);
      try {
        options = 'video/vp8'; // Chrome 47
        mediaRecorder = new MediaRecorder(canvasPublish, options);
      } catch (e2) {
        alert('MediaRecorder is not supported by this browser.\n\n' +
          'Try Firefox 29 or later, or Chrome 47 or later, with Enable experimental Web Platform features enabled from chrome://flags.');
        console.error('Exception while creating MediaRecorder:', e2);
        return;
      }
    }
  }
  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  //publishButton.textContent = 'Publishing';
  mediaRecorder.onstop = handleStop;
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start(100); // collect 100ms of data
  console.log('MediaRecorder started', mediaRecorder);
}
//SECTION 3.2.2: Push recorded blobs to new video
function handleSourceOpen(event) {
  console.log('MediaSource opened');
  sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
  console.log('Source buffer: ', sourceBuffer);
}

function handleDataAvailable(event) {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function handleStop(event) {
  console.log('Recorder stopped: ', event);
}


var superBuffer;
//SECTION 3.3: Stop MediaRecorder and load final edited video
function finish(){
  //document.getElementById("p5video").loop = false;
  document.getElementById("p5video").onended = function(){
    //gainNode.gain.value = 0;
    //video.pause();
    mediaRecorder.stop();
    console.log('Recorded Blobs: ', recordedBlobs);
    videoFinal.controls = true;
    superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
    videoFinal.src = window.URL.createObjectURL(superBuffer);
    videoFinal.pause();
    //publishButton.textContent = 'Published';
    editStatus.innerHTML = ("Status: Published");
    publishButton.disabled = true;
    
    //$("#toggleVid").html('Play');
    //$("#s2").animate({'font-weight': "400"},300);
    //$("#s3").animate({'font-weight': "600"},300);
    //$(".step2").fadeOut();    
    //$(".step3").fadeIn();
    //$("#vidNameFinal").html(vidName);
    //$("#authorNameFinal").html("Created By: " + authorName);
    uploadBlob();
    console.log(window.URL.createObjectURL(superBuffer));
  };
}

/*function stopRecordingPublish() {
  mediaRecorder.stop();
  console.log('Recorded Blobs: ', recordedBlobs);
  videoFinal.controls = true;
}*/

//SECTION 3.4: Initiate redo state if user wants to redo their edits
function redo(){
  $("#s3").animate({'font-weight': "400"},300);
  $("#s2").animate({'font-weight': "600"},300);
  $(".step3").fadeOut();    
  $(".step2").fadeIn();
  document.getElementById("toggleVid").disabled = false;
  document.getElementById("muteVid").disabled = false;
  document.getElementById("publish").disabled = false;
  document.getElementById("glitch").disabled = false;
  document.getElementById("saturate").disabled = false;
  document.getElementById("slow").disabled = false;
  document.getElementById("freeze").disabled = false;
  document.getElementById("stutter").disabled = false;
  document.getElementById("submit").disabled = false;
  editStatus.innerHTML = ("Status: Ready to Edit"); 
  publishButton.innerHTML = ('Publish');
  $("#toggleVid").html('<img src="css/pause.png" />');
  videoFinal.pause();
  videoFinal.src = "";
  video.play();
  video.loop();
  startStream();
}

//SECTION 4.0: Uploading to server
$("#submit").on("click",function(){
uploadBlob();
console.log("uploaded");
document.getElementById("redo").disabled = true;
document.getElementById("submit").disabled = true;
});


var viewLink = "";

// javascript function that uploads a blob to upload.php
function uploadBlob(){
    // create a blob here for testing
    //var blob = new Blob(["i am a poo poo blast"]);  
    var reader = new FileReader();
    // this function is triggered once a call to readAsDataURL returns
    reader.onload = function(event){
        var fd = new FormData();
        fd.append('fname', 'test.webm');
        fd.append('data', event.target.result);
        fd.append('title', vidName);
        fd.append('author', authorName);
        fd.append('tags', tagList);
        $.ajax({
            type: 'POST',
            url: 'upload.php',
            data: fd,
            processData: false,
            contentType: false
        }).done(function(data) {
            // print the output from the upload.php script
            console.log(data);
            viewLink = data;
            document.getElementById("viewVideo1").style.display = "block";
            document.getElementById("viewLink1").href = viewLink;
        });
    };      
    // trigger the read from the reader...
    reader.readAsDataURL(superBuffer);

}
