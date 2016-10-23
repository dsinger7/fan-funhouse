'use strict';

//This code is organized based on steps taken during the application.
//STEP 1: User's original video is captured.
//STEP 2: User's original video is edited.
//STEP 3: User's edited video is published. 

//GLOBAL VARIABLES

//Slider (Step 1)
var timeInMinutes = 0.25;
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
var mediaRecorder;
var chunks = [];
var count = 0;

//Recording state (Step 1)
var recording = false;

//p5 video setup and effects (Step 2)
var video;
var canvas;
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


///////////////////
//SECTION 1 BEGINS
///////////////////

//SECTION 1.1: Slider sets video duration. 
noUiSlider.create(durationSlider, {
  start: 15,
  step: 1,
  range: {
    'min': 1,
    'max': 15
  },
  format: wNumb({
    decimals: 0
  })
});

durationSlider.noUiSlider.on('change', function(){
  var timerDuration2 = durationSlider.noUiSlider.get();
  console.log(timerDuration2);
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

var url = window.URL || window.webkitURL;
videoElement.src = url ? url.createObjectURL(stream) : stream;
videoElement.play();

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
  var secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    var t = getTimeRemaining(endtime);
    if(editMode === false){
      secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
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

  step2();
  toggleVid();
  getDuration();
};
}

//SECTION 1.5: Record button actions
function onBtnRecordClicked (){
  if(recording === false){
    if (typeof MediaRecorder === 'undefined' || !navigator.getUserMedia) {
     alert('MediaRecorder not supported on your browser, use Firefox 30 or Chrome 49 instead.');
   } else {
     navigator.getUserMedia(constraints, startRecording, errorCallback);
     document.getElementById("rec").innerHTML = ("Stop");
     recording = true;
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
    $("#toggleVid").html('Play');
    publishButton.disabled = true;
  } else {
    if(timeReceived){
      video.loop();
    } 
    else{
      video.autoplay();
    }
    $("#toggleVid").html('Pause');
    publishButton.disabled = false;
  }
  playing = !playing;
}

//SECTION 2.2: Set up p5 video, Seriously effects, and Web Audio
function step2(){
    if(editMode === false){
        editMode = true; 
    $(".step1").fadeOut();    
    $(".step2").fadeIn();
    $("clockdiv").hide();
    editStatus.innerHTML = ("Status: Analyzing for Time...");

    document.getElementById("toggleVid").disabled = true;
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

    greatJobAudio = createAudio("css/GreatJob.mp3");
    greatJobAudio.id('greatJob');
//SECTION 2.2.2: Set up Seriously effects
    var seriously = new Seriously();
    var src = seriously.source('#p5video');
    target = seriously.target('#p5canvas');

    blur = seriously.effect('blur');
    blur.source = src;
    target.source = blur;
    blur.amount = 0;
    addNoise = seriously.effect('noise');
    addNoise.source = src;
    tv = seriously.effect('tvglitch');
    tv.source = src;
    repeat = seriously.effect('repeat');
    repeat.source = src;
    crop = seriously.effect('crop');
    crop.source = src;
    ripple = seriously.effect('ripple');
    ripple.source = src;
    hueSaturation = seriously.effect('hue-saturation');
    hueSaturation.source = src;

    reformat = seriously.transform('reformat');
    reformat.source = src;

    seriously.go();   
//SECTION 2.2.3: Set up Web Audio and start MediaStream
    var audioCtx = new AudioContext();
    var dest = audioCtx.createMediaStreamDestination();
    aStream = dest.stream;
    var myVid = document.getElementById("p5video");
    var sourceNode = audioCtx.createMediaElementSource(myVid);
    sourceNode.connect(dest);
    sourceNode.connect(audioCtx.destination);    

    var gj = document.getElementById('greatJob'); 
    var sourceNode2 = audioCtx.createMediaElementSource(gj);
    sourceNode2.connect(dest);
    sourceNode2.connect(audioCtx.destination);
    
    startStream();
  }
}

//SECTION 2.3: Get duration, turn on buttons, and configure Remix Bar 
function getDuration(){
  video.onended(function(){
    console.log(video.time()); 
    duration = video.time();
    video.loop();

    timeReceived = true;
    editStatus.innerHTML = ("Status: Ready to Edit");
    document.getElementById("toggleVid").disabled = false;
    document.getElementById("publish").disabled = false;
    document.getElementById("glitch").disabled = false;
    document.getElementById("saturate").disabled = false;
    document.getElementById("slow").disabled = false;
    document.getElementById("freeze").disabled = false;
    document.getElementById("stutter").disabled = false;

//SECTION 2.3.1: Configure Remix Bar

/*
$("#remix-marker").draggabilly({
axis: 'x',
containment: '#progress'
});

$('#remix-marker').on('dragMove',function(event,pointer){
  markerPos = $("#remix-marker").position();
  markerPosX = markerPos.left;
  //console.log(markerPosX);
  stutterStart = (markerPosX/320) * duration;
});


var progress = document.getElementById("progress");
progress.setAttribute('max', duration);
document.getElementById("progress").disabled = false;    

document.getElementById("p5video").addEventListener('timeupdate', function(){
  progress.value = document.getElementById("p5video").currentTime;
});
*/

//var colOffset = 113;

/* progress.addEventListener('click', function(e) {
  var mouseOffsetX = $(this).offset().left;
  var pos = (e.pageX z - mouseOffsetX) / this.offsetWidth;
  document.getElementById("p5video").currentTime = pos * duration;
      var markerPos = String((pos*320)-3) + "px";//-3 centers the bar
      $("#remix-marker").css("left", markerPos);
    }); */

});
}

//SECTION 2.4: Apply Seriously effects using p5's draw() calls

function draw(){
  if(editMode === true){

    timeCode = video.time();

    
    if(panel1Filled){
     panel1StartEnd = newSlider1.noUiSlider.get();
     panel1Start = panel1StartEnd[0];
     panel1End = panel1StartEnd[1]; 
   }
   if(panel2Filled){
     panel2StartEnd = newSlider2.noUiSlider.get();
     panel2Start = panel2StartEnd[0];
     panel2End = panel2StartEnd[1]; 
   }
   if(panel3Filled){
     panel3StartEnd = newSlider3.noUiSlider.get();
     panel3Start = panel3StartEnd[0];
     panel3End = panel3StartEnd[1]; 
   }


  //SECTION 2.4.1: Seriously "Glitch" effect
  if(panel1Effect === "Glitch"){
    if(timeCode >= panel1Start && timeCode <= panel1End){
      target.source = tv;
      tv.distortion = 0.2;
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
  //SECTION 2.4.4: Seriously "Great Job" effect
  if(panel1Effect === "Great Job!"){
    if(timeCode >= panel1Start && timeCode < panel1End){
      video.speed(1);
      target.source = repeat;
      repeat.repeat += 1;
      greatJobPlayed1 = false;
      if(greatJobPlayed1 === false){
        document.getElementById("p5video").muted = true;
        document.getElementById("greatJob").loop = false;
          greatJobAudio.play(); //.13 seconds before end, issue related to Chrome bug
          greatJobPlayed1 = true;
        }      
      } 
    } 
    if(panel2Effect === "Great Job!"){
      if(timeCode >= panel2Start && timeCode <= panel2End){
        video.speed(1);
        target.source = repeat;
        repeat.repeat += 1;
        greatJobPlayed2 = false;
        if(greatJobPlayed2 === false){
          document.getElementById("p5video").muted = true;
          document.getElementById("greatJob").loop = false;
          greatJobAudio.play(); //.13 seconds before end, issue related to Chrome bug
          greatJobPlayed2 = true; 
        }       
      } 
    } 
    if(panel3Effect === "Great Job!"){
      if(timeCode >= panel3Start && timeCode <= panel3End){
        video.speed(1);
        target.source = repeat;
        repeat.repeat += 1;
        greatJobPlayed3 = false;
        if(greatJobPlayed3 === false){
          document.getElementById("p5video").muted = true;
          document.getElementById("greatJob").loop = false;
          greatJobAudio.play(); //.13 seconds before end, issue related to Chrome bug
          greatJobPlayed3 = true;
        }        
      } 
    } 
  //SECTION 2.4.5: Seriously "Stutter" effect 
  if(panel1Effect === "Stutter"){  
  if(stutter1On === false){
    if(timeCode > 0 && timeCode < 0.05){
       stutter1On = true;  
    }
  }
  if(stutter1On){
    if(timeCode >= eval(panel1StartEnd) + 0.1){       
      stutter1Counter = stutter1Counter + 1;
      video.time(eval(panel1StartEnd));
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
    if(timeCode >= eval(panel2StartEnd) + 0.1){       
      stutter2Counter = stutter2Counter + 1;
      video.time(eval(panel2StartEnd));
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
    if(timeCode >= eval(panel3StartEnd) + 0.1){       
      stutter3Counter = stutter3Counter + 1;
      video.time(eval(panel3StartEnd));
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
        hueSaturation.saturation = 0;
        hueSaturation.hue = 0.4;
        video.speed(1);
        reformat.mode = 'contain';
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
  }
}//END DRAW

//SECTION 2.5: Set up sliders

//SECTION 2.5.1: Glitch effect sliders
$(".glitch").on("click",function(){
  if(panel1Filled === false){
    panel1Filled = true;
    panel1Effect = "Glitch";
    $(".effectPanel1").html("<span class='effectName'>Glitch</span> <span><img class='effectImg' src='css/Glitch.png'/></span><span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div id='newSlider1'></div><span class='timelineStart'>Start</span><span class='timelineEnd'>End</span>");
    newSlider1 = document.getElementById('newSlider1');
    noUiSlider.create(newSlider1, {
      start:[0,0.5],
      tooltips: [ true, true ],
      step:0.01,
      connect:true,
      orientation:'horizontal',
      behaviour:'tap-drag',
      range:{
        'min':0,
        'max':duration
      }
    });
    $("#newSlider1 .noUi-connect").css("background","#d9534f");
    panel1StartEnd = newSlider1.noUiSlider.get();
  } else{
    if(panel2Filled === false){
      panel2Filled = true;
      panel2Effect = "Glitch";
      $(".effectPanel2").html("<span class='effectName'>Glitch</span> <span><img class='effectImg' src='css/Glitch.png'/></span><span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div id='newSlider2'></div><span class='timelineStart'>Start</span><span class='timelineEnd'>End</span>");
      newSlider2 = document.getElementById('newSlider2');
      noUiSlider.create(newSlider2, {
        start:[0,0.5],
        tooltips: [ true, true ],
        step:0.01,
        connect:true,
        orientation:'horizontal',
        behaviour:'tap-drag',
        range:{
          'min':0,
          'max':duration
        }
      });
      $("#newSlider2 .noUi-connect").css("background","#d9534f");
      panel2StartEnd = newSlider2.noUiSlider.get();
    } else{
      if(panel3Filled === false){
        panel3Filled = true;
        panel3Effect = "Glitch";
        $(".effectPanel3").html("<span class='effectName'>Glitch</span> <span><img class='effectImg' src='css/Glitch.png'/></span><span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div id='newSlider3'></div><span class='timelineStart'>Start</span><span class='timelineEnd'>End</span>");
        newSlider3 = document.getElementById('newSlider3');
        noUiSlider.create(newSlider3, {
          start:[0,0.5],
          tooltips: [ true, true ],
          step:0.01,
          connect:true,
          orientation:'horizontal',
          behaviour:'tap-drag',
          range:{
            'min':0,
            'max':duration
          }
        });
        $("#newSlider3 .noUi-connect").css("background","#d9534f");
        panel3StartEnd = newSlider3.noUiSlider.get();
      }
      else{
        alert("Please delete an existing effect to add a new one.");
}//ELSE for Panel 3
}//ELSE for Panel 2
}//ELSE for Panel 1
});
//SECTION 2.5.2: Saturate effect sliders
$(".saturate").on("click",function(){
  if(panel1Filled === false){
    panel1Filled = true;
    panel1Effect = "Saturate";
    $(".effectPanel1").html("<span class='effectName'>Saturate</span> <span><img class='effectImg' src='css/Saturate.png'/></span><span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div id='newSlider1'></div><span class='timelineStart'>Start</span><span class='timelineEnd'>End</span>");
    newSlider1 = document.getElementById('newSlider1');
    noUiSlider.create(newSlider1, {
      start:[0,0.5],
      tooltips: [ true, true ],
      step:0.01,
      connect:true,
      orientation:'horizontal',
      behaviour:'tap-drag',
      range:{
        'min':0,
        'max':duration
      }
    });
    $("#newSlider1 .noUi-connect").css("background","#5bc0de");
    panel1StartEnd = newSlider1.noUiSlider.get();
  } else{
    if(panel2Filled === false){
      panel2Filled = true;
      panel2Effect = "Saturate";
      $(".effectPanel2").html("<span class='effectName'>Saturate</span> <span><img class='effectImg' src='css/Saturate.png'/></span><span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div id='newSlider2'></div><span class='timelineStart'>Start</span><span class='timelineEnd'>End</span>");
      newSlider2 = document.getElementById('newSlider2');
      noUiSlider.create(newSlider2, {
        start:[0,0.5],
        tooltips: [ true, true ],
        step:0.01,
        connect:true,
        orientation:'horizontal',
        behaviour:'tap-drag',
        range:{
          'min':0,
          'max':duration
        }
      });
      $("#newSlider2 .noUi-connect").css("background","#5bc0de");
      panel2StartEnd = newSlider2.noUiSlider.get();
    } else{
      if(panel3Filled === false){
        panel3Filled = true;
        panel3Effect = "Saturate";
        $(".effectPanel3").html("<span class='effectName'>Saturate</span> <span><img class='effectImg' src='css/Saturate.png'/></span><span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div id='newSlider3'></div><span class='timelineStart'>Start</span><span class='timelineEnd'>End</span>");
        newSlider3 = document.getElementById('newSlider3');

        noUiSlider.create(newSlider3, {
          start:[0,0.5],
          tooltips: [ true, true ],
          step:0.01,
          connect:true,
          orientation:'horizontal',
          behaviour:'tap-drag',
          range:{
            'min':0,
            'max':duration
          }
        });
        $("#newSlider3 .noUi-connect").css("background","#5bc0de");
        panel3StartEnd = newSlider3.noUiSlider.get();
      }
      else{
        alert("Please delete an existing effect to add a new one.");
}//ELSE for Panel 3
}//ELSE for Panel 2
}//ELSE for Panel 1
});
//SECTION 2.5.3: Slow effect sliders
$(".slow").on("click",function(){
  if(panel1Filled === false){
    panel1Filled = true;
    panel1Effect = "Slow";
    $(".effectPanel1").html("<span class='effectName'>Slow</span> <span><img class='effectImg' src='css/Slow.png'/></span><span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div id='newSlider1'></div><span class='timelineStart'>Start</span><span class='timelineEnd'>End</span>");
    newSlider1 = document.getElementById('newSlider1');
    noUiSlider.create(newSlider1, {
      start:[0,0.5],
      tooltips: [ true, true ],
      step:0.01,
      connect:true,
      orientation:'horizontal',
      behaviour:'tap-drag',
      range:{
        'min':0,
        'max':duration
      }
    });
    $("#newSlider1 .noUi-connect").css("background","#ff9900");
    panel1StartEnd = newSlider1.noUiSlider.get();
  } else{
    if(panel2Filled === false){
      panel2Filled = true;
      panel2Effect = "Slow";
      $(".effectPanel2").html("<span class='effectName'>Slow</span> <span><img class='effectImg' src='css/Slow.png'/></span><span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div id='newSlider2'></div><span class='timelineStart'>Start</span><span class='timelineEnd'>End</span>");
      newSlider2 = document.getElementById('newSlider2');
      noUiSlider.create(newSlider2, {
        start:[0,0.5],
        tooltips: [ true, true ],
        step:0.01,
        connect:true,
        orientation:'horizontal',
        behaviour:'tap-drag',
        range:{
          'min':0,
          'max':duration
        }
      });
      $("#newSlider2 .noUi-connect").css("background","#ff9900");
      panel2StartEnd = newSlider2.noUiSlider.get();
    } else{
      if(panel3Filled === false){
        panel3Filled = true;
        panel3Effect = "Slow";
        $(".effectPanel3").html("<span class='effectName'>Slow</span> <span><img class='effectImg' src='css/Slow.png'/></span><span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div id='newSlider3'></div><span class='timelineStart'>Start</span><span class='timelineEnd'>End</span>");
        newSlider3 = document.getElementById('newSlider3');

        noUiSlider.create(newSlider3, {
          start:[0,0.5],
          tooltips: [ true, true ],
          step:0.01,
          connect:true,
          orientation:'horizontal',
          behaviour:'tap-drag',
          range:{
            'min':0,
            'max':duration
          }
        });
        $("#newSlider3 .noUi-connect").css("background","#ff9900");
        panel3StartEnd = newSlider3.noUiSlider.get();
      }
      else{
        alert("Please delete an existing effect to add a new one.");
}//ELSE for Panel 3
}//ELSE for Panel 2
}//ELSE for Panel 1
});
//SECTION 2.5.4: Great Job effect sliders
$(".freeze").on("click",function(){
  if(panel1Filled === false){
    panel1Filled = true;
    panel1Effect = "Great Job!";
    $(".effectPanel1").html("<span class='effectName'>Great Job!</span> <span><img class='effectImg' src='css/GreatJob.png'/></span><span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div id='newSlider1'></div><span class='timelineStart'>Start</span><span class='timelineEnd'>End</span>");
    newSlider1 = document.getElementById('newSlider1');
    noUiSlider.create(newSlider1, {
      start:[0,2.55],
      tooltips: [ true, true ],
      step:0.01,
      connect:true,
      orientation:'horizontal',
      behaviour:'drag-fixed',
      range:{
        'min':0,
        'max':duration-0.13
      }
    });
    $("#newSlider1 .noUi-connect").css("background","#4caf50");
    panel1StartEnd = newSlider1.noUiSlider.get();
  } else{
    if(panel2Filled === false){
      panel2Filled = true;
      panel2Effect = "Great Job!";
      $(".effectPanel2").html("<span class='effectName'>Great Job!</span> <span><img class='effectImg' src='css/GreatJob.png'/></span><span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div id='newSlider2'></div><span class='timelineStart'>Start</span><span class='timelineEnd'>End</span>");
      newSlider2 = document.getElementById('newSlider2');
      noUiSlider.create(newSlider2, {
        start:[0,2.55],
        tooltips: [ true, true ],
        step:0.01,
        connect:true,
        orientation:'horizontal',
        behaviour:'drag-fixed',
        range:{
          'min':0,
          'max':duration-0.13
        }
      });
      $("#newSlider2 .noUi-connect").css("background","#4caf50");
      panel2StartEnd = newSlider2.noUiSlider.get();
    } else{
      if(panel3Filled === false){
        panel3Filled = true;
        panel3Effect = "Great Job!";
        $(".effectPanel3").html("<span class='effectName'>Great Job!</span> <span><img class='effectImg' src='css/GreatJob.png'/></span><span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div id='newSlider3'></div><span class='timelineStart'>Start</span><span class='timelineEnd'>End</span>");
        newSlider3 = document.getElementById('newSlider3');

        noUiSlider.create(newSlider3, {
          start:[0,2.55],
          tooltips: [ true, true ],
          step:0.01,
          connect:true,
          orientation:'horizontal',
          behaviour:'drag-fixed',
          range:{
            'min':0,
            'max':duration-0.13
          }
        });
        $("#newSlider3 .noUi-connect").css("background","#4caf50");
        panel3StartEnd = newSlider3.noUiSlider.get();
      }
      else{
        alert("Please delete an existing effect to add a new one.");
}//ELSE for Panel 3
}//ELSE for Panel 2
}//ELSE for Panel 1
});
//SECTION 2.5.5: Stutter effect sliders
$(".stutter").on("click",function(){
  if(panel1Filled === false){
    panel1Filled = true;
    panel1Effect = "Stutter";
    $(".effectPanel1").html("<span class='effectName'>Stutter</span> <span><img class='effectImg' src='css/Stutter.png'/></span><span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div id='newSlider1'></div><span class='timelineStart'>Start</span><span class='timelineEnd'>End</span>");
    newSlider1 = document.getElementById('newSlider1');
    noUiSlider.create(newSlider1, {
      start:[0.5],
      tooltips: [true],
      step:0.01,
      range:{
        'min':0.05,
        'max':duration
      }
    });
    $("#newSlider1 .noUi-handle").css("background","#0275d8");
    panel1StartEnd = newSlider1.noUiSlider.get();
  } else{
    if(panel2Filled === false){
      panel2Filled = true;
      panel2Effect = "Stutter";
      $(".effectPanel2").html("<span class='effectName'>Stutter</span> <span><img class='effectImg' src='css/Stutter.png'/></span><span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div id='newSlider2'></div><span class='timelineStart'>Start</span><span class='timelineEnd'>End</span>");
      newSlider2 = document.getElementById('newSlider2');
      noUiSlider.create(newSlider2, {
        start:[0.5],
        tooltips: [ true ],
        step:0.01,
        range:{
          'min':0.05,
          'max':duration
        }
      });
      $("#newSlider2 .noUi-handle").css("background","#0275d8");
      panel2StartEnd = newSlider2.noUiSlider.get();
    } else{
      if(panel3Filled === false){
        panel3Filled = true;
        panel3Effect = "Stutter";
        $(".effectPanel3").html("<span class='effectName'>Stutter</span> <span><img class='effectImg' src='css/Stutter.png'/></span><span class='deleteEffect'><i class='icon ion-ios-close'></i></span><div id='newSlider3'></div><span class='timelineStart'>Start</span><span class='timelineEnd'>End</span>");
        newSlider3 = document.getElementById('newSlider3');
        noUiSlider.create(newSlider3, {
          start:[0.5],
          tooltips: [ true ],
          step:0.01,
          range:{
            'min':0.05,
            'max':duration
          }
        });
        $("#newSlider3 .noUi-handle").css("background","#0275d8");
        panel3StartEnd = newSlider3.noUiSlider.get();
      }
      else{
        alert("Please delete an existing effect to add a new one.");
}//ELSE for Panel 3
}//ELSE for Panel 2
}//ELSE for Panel 1
});
//SECTION 2.5.6: Delete any effect
$(document).on("click",".deleteEffect",function(){
  if($(this).parent().attr("id") === "effectPanel1"){
    panel1Filled = false;
    panel1Effect = "";
  }
  else if($(this).parent().attr("id") === "effectPanel2"){
    panel2Filled = false;
    panel2Effect = "";
  }
  else if($(this).parent().attr("id") === "effectPanel3"){
    panel3Filled = false;
    panel3Effect = "";
  }
  $(this).parent().empty();
});
//SECTION 2.6: Set video title/author
$("#vidName").on("input",function(){
vidName = document.getElementById('vidName').value;
});
$("#authorName").on("input",function(){
authorName = document.getElementById('authorName').value;
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
    //video.noLoop();
    video.time(0);   
    startRecordingPublish();
    publishButton.textContent = 'Publishing';
    editStatus.innerHTML = ("Status: Publishing...");
    document.getElementById("toggleVid").disabled = true;
    document.getElementById("publish").disabled = true;
    document.getElementById("glitch").disabled = true;
    document.getElementById("saturate").disabled = true;
    document.getElementById("slow").disabled = true;
    document.getElementById("freeze").disabled = true;
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
  publishButton.textContent = 'Publishing';
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
  document.getElementById("p5video").loop = false;
  document.getElementById("p5video").onended = function(){
    mediaRecorder.stop();
    console.log('Recorded Blobs: ', recordedBlobs);
    videoFinal.controls = true;
    superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
    videoFinal.src = window.URL.createObjectURL(superBuffer);
    publishButton.textContent = 'Published';
    editStatus.innerHTML = ("Status: Published");
    publishButton.disabled = true;
    video.pause();
    $("#toggleVid").html('Play');
    $(".step2").fadeOut();    
    $(".step3").fadeIn();
    $("#vidNameFinal").html("<p><b>" + vidName + "</b>");
    $("#authorNameFinal").html("<p><b>Created By: " + authorName + "</b>");
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
  $(".step3").fadeOut();    
  $(".step2").fadeIn();
  document.getElementById("toggleVid").disabled = false;
  document.getElementById("publish").disabled = false;
  document.getElementById("glitch").disabled = false;
  document.getElementById("saturate").disabled = false;
  document.getElementById("slow").disabled = false;
  document.getElementById("freeze").disabled = false;
  document.getElementById("stutter").disabled = false;
  document.getElementById("submit").disabled = false;
  editStatus.innerHTML = ("Status: Ready to Edit"); 
  publishButton.innerHTML = ('Publish');
  $("#toggleVid").html('Pause');
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
            document.getElementById("viewVideo").style.display = "block";
            document.getElementById("viewLink").href = viewLink;
        });
    };      
    // trigger the read from the reader...
    reader.readAsDataURL(superBuffer);

}
