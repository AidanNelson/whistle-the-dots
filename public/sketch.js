// Open and connect input socket
let socket = io();

let mic;
let volArray = [];

let pitchArray = [];

let player = {
  x: 0,
  y: 0
};

let gamePitch = 0;

let volumeControlOn = false;
let pitchControlOn = true;

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected");
});

socket.on('volume', function(volume) {
  player.y = constrain(map(volume, 0, 1, height, 0), 0, height);
});

socket.on('pitch', function(pitch) {
  player.x = constrain(map(pitch, 0, 1, 0, width), 0, width);
});


function setup() {
  createCanvas(1000, 1000);
  player.x = width/2;
  player.y = height/2;

  mic = new p5.AudioIn()
  mic.start();

  fft = new p5.FFT();
  fft.setInput(mic);
}


function draw(){
  background(200);

  if (volumeControlOn) {
      getVolume();
  }

  if (pitchControlOn) {
      getPitch();
  }

  noStroke();
  fill(0,255,0);
  ellipse(player.x, player.y, 100, 100);
}

function setVolumeControl(){
  volumeControlOn = !volumeControlOn;
  console.log("volume is on? :"+ volumeControlOn);
  pitchControlOn = !volumeControlOn;
}

function getVolume() {
  let micLevel = mic.getLevel();
  // console.log(micLevel);
  volArray.unshift(micLevel);

  averageMic = 0;
	if (volArray.length > 50) {
		for (let i = 0; i < volArray.length; i++) {
			averageMic += volArray[i];
		}
		averageMic *= (1 / volArray.length);
		volArray.pop();
	}
  let maxVolume = 0.6;
  let mappedMic = map(averageMic, 0, maxVolume, 0, 1);

  socket.emit('volume', mappedMic);
}


function getPitch() {
  pitchArray.unshift(gamePitch);
  // console.log(gamePitch);

  averagePitch = 0;
	if (pitchArray.length > 50) {
		for (let i = 0; i < pitchArray.length; i++) {
			averagePitch += pitchArray[i];
		}
		averagePitch *= (1 / pitchArray.length);
		pitchArray.pop();
	}
  let minPitch = 200;
  let maxPitch = 1800;
  let mappedPitch = map(averagePitch, minPitch, maxPitch, 0, 1);

  socket.emit('pitch', mappedPitch);
}
