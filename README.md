# fan-funhouse
A web-based application for creative video editing

Fan Funhouse is a application that allows users to record brief webcam videos and remix them with playful effects.
The initial release of this project is being designed with pop culture fandoms in mind, specifically the fandom
for the comedy due Tim & Eric and their various TV shows. When used in this context, Fan Funhouse seeks to open up the 
process of creative video editing to a wider audience and encourage fans who may lack video software or expertise
to create user-generated fan media. 

I'm working on this project at the Georgia Institute of Technology for my master's thesis. 

Fan Funhouse utilizes WebRTC's MediaRecorder API and getUserMedia() method to capture and record the user's webcam video.
The recording is then loaded into a p5.js canvas, where the user can apply real-time effects from the Seriously.js library.
When the user is ready to publish their video, WebRTC's MediaStream API and another instance of MediaRecorder are used to 
capture the video and audio from the p5 canvas and produce the final video. 

For the time being, Fan Funhouse only works properly in Chrome (Firefox support is forthcoming). Due to security issues 
regarding getUserMedia(), the application must run on a secure browser (either HTTPS or localhost). 
