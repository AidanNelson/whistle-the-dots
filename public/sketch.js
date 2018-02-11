// Open and connect input socket
let socket = io();

let mic;
let volArray = [];

let pitchArray = [];
let w, h;

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

  //Yang edit: I wish canvas could adjust itself by browser/
  var canvas = createCanvas(windowWidth * 0.58, windowWidth * 0.58, );
  canvas.parent('canvasHolder');
  player.x = width / 2;
  player.y = height / 2;

  mic = new p5.AudioIn()
  mic.start();

  fft = new p5.FFT();
  fft.setInput(mic);
  //initial controller
  toggleControll();
}


function draw() {
  //check the result of adjustment
  // if ((frameCount % 60) == 1 ) {
  //   console.log(adjuster);
  // }
  background('#898F97');
  // Yang edit: I moved this "if" inside the function so that I can debug easily.
  // which means, I read both pitch and volume, but I only "emit" one to server.
  getVolume();
  getPitch();

  noStroke();
  fill(0, 255, 0);
  ellipse(player.x, player.y, 100, 100);
}

//Yang edit: I changed the name to toggle controll;
function toggleControll() {
  let ImControlling;
  volumeControlOn = !volumeControlOn;
  console.log(volumeControlOn, pitchControlOn);
  pitchControlOn = !volumeControlOn;
  console.log(volumeControlOn, pitchControlOn);
  if (volumeControlOn) {
    ImControlling = "Now Controlling \nThe Y axis (Volume) "
    document.getElementById('adjustVolume').style.display = "block";
    document.getElementById('adjustPitch').style.display = "none";
  }
  else {
    //Yang: if don't call this, the pitch won't work.
    toggleLiveInput();
    ImControlling = "Now Controlling \nThe X axis (Pitch) "
    document.getElementById('adjustVolume').style.display = "none";
    document.getElementById('adjustPitch').style.display = "block";
  }
  document.getElementById('whatImControlling').innerHTML = ImControlling;
}

function getVolume() {
  let micLevel = mic.getLevel();
  console.log(micLevel);
  volArray.unshift(micLevel);

  averageMic = 0;
  if (volArray.length > 50) {
    for (let i = 0; i < volArray.length; i++) {
      averageMic += volArray[i];
    }
    averageMic *= (1 / volArray.length);
    volArray.pop();
  }

  let mappedMic = map(averageMic, 0, adjuster.volumemax, 0, 1);
  // Yang edit: only emit this data to server when volumeControlOn
  if (volumeControlOn) {
    socket.emit('volume', mappedMic);
  }
}


function getPitch() {
  pitchArray.unshift(gamePitch);
  averagePitch = 0;
  if (pitchArray.length > 50) {
    for (let i = 0; i < pitchArray.length; i++) {
      averagePitch += pitchArray[i];
    }
    averagePitch *= (1 / pitchArray.length);
    pitchArray.pop();
  }
  let mappedPitch = map(averagePitch, adjuster.pitchmin, adjuster.pitchmax, 0, 1);
  // Yang edit: only emit this data to server when pitchControlOn
  if (pitchControlOn) {
    socket.emit('pitch', mappedPitch);
  }
}
