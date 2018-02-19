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

let level = null;
let levelOne;

function setup() {
  // Listen for confirmation of connection
  socket.on('connect', function() {
    console.log("Connected");
  });

  socket.on('initialDots', function(data) {
    console.log('got initial dots!');
    console.log(data);
    level = new Level(data);
  });

  socket.on('volume', function(volume) {
    player.y = constrain(map(volume, 0, 1, height, 0), 0, height);
  });

  socket.on('pitch', function(pitch) {
    player.x = constrain(map(pitch, 0, 1, 0, width), 0, width);
  });

  //Yang edit: I wish canvas could adjust itself by browser/
  var canvas = createCanvas(500, 500);
  canvas.parent('canvasHolder');
  player.x = width / 2;
  player.y = height / 2;

  console.log('sending dot request');
  socket.emit('sendDots');


  // levelOne = [];
  // for (let i = 0; i< 10; i++){
  //   // let x = floor(random(width));
  //   // let y = floor(random(height));
  //   let newDot = {
  //     x: floor(random(width)),
  //     y: floor(random(height))
  //   }
  //   levelOne.push(newDot);
  // }


  mic = new p5.AudioIn()
  mic.start();

  //initial controller
  toggleControll();
}


function draw() {
  //check the result of adjustment
  // if ((frameCount % 60) == 1 ) {
  //   console.log(adjuster);
  // }
  // background('#898F97');
  // Yang edit: I moved this "if" inside the function so that I can debug easily.
  // which means, I read both pitch and volume, but I only "emit" one to server.
  getVolume();
  getPitch();

  if (mouseIsPressed){
    player.x = mouseX;
    player.y = mouseY;
  }

  if (level){
    level.update(player.x,player.y,50);
    level.display();
    if (level.isWon){
      background(255,255,255);
      textSize(32);
      textAlign(CENTER);
      text("YOU WON!!", width/2,height/2);
    }
  }

  noStroke();
  fill(0, 255, 0);
  ellipse(player.x, player.y, 50, 50);
}

//Yang edit: I changed the name to toggle controll;
function toggleControll() {
  let ImControlling;
  volumeControlOn = !volumeControlOn;
  pitchControlOn = !volumeControlOn;

  console.log("volume control on? ", volumeControlOn);
  console.log("pitch control on?",  pitchControlOn);
  if (volumeControlOn) {
    ImControlling = "You are now controlling \nthe Y axis (Volume) "
    document.getElementById('adjustVolume').style.display = "block";
    document.getElementById('adjustPitch').style.display = "none";
  }
  else {
    //Yang: if don't call this, the pitch won't work.
    toggleLiveInput();
    ImControlling = "You are now controlling \nthe X axis (Pitch) "
    document.getElementById('adjustVolume').style.display = "none";
    document.getElementById('adjustPitch').style.display = "block";
  }
  document.getElementById('whatImControlling').innerHTML = ImControlling;
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

  let mappedMic = constrain(map(averageMic, 0, adjuster.volumemax, 0, 1),0,1);
  // Yang edit: only emit this data to server when volumeControlOn
  if (volumeControlOn && frameCount %3 == 0) {
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
  let mappedPitch = constrain(map(averagePitch, adjuster.pitchmin, adjuster.pitchmax, 0, 1),0,1);
  // Yang edit: only emit this data to server when pitchControlOn
  if (pitchControlOn && frameCount %3 == 0) {
    socket.emit('pitch', mappedPitch);
  }
}
