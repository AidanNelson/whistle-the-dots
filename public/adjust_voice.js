//Results will be stored in this object, just use it whenever you need

class ADJUSTER {
  constructor() {
    this.pitchmin = 300;
    this.pitchmax = 1800;
    this.volumemin = 0.05;
    this.volumemax = 0.6
    this.reads = [];
  }

  AdjustPitch(stage) {
    if (stage == 1) {
      CreateDom();
      document.getElementById('adjTitle').innerHTML = "<br><br>At your comfortable level, <br> please record both <br> your lowest pitch and your highest pitch.<br>";
      document.getElementById('adjCountDown').innerHTML = "Click Button to Start";
      document.getElementById('adjusterControlButton').innerHTML = "Start Recording";
      document.getElementById('adjusterControlButton').onclick = function () {
        adjuster.AdjustPitch(2);
      }
    }

    if (stage == 2) {
      document.getElementById('adjCountDown').innerHTML = ">> RECORDING NOW <<";
      this.reads = [];
      //keep geting data samples every 20ms
      var accquireData = setInterval(
        function() {
          adjuster.reads.push(gamePitch)
        },
        20);
      document.getElementById('adjusterControlButton').innerHTML = 'Stop Recording';

      document.getElementById('adjusterControlButton').onclick = function () {
        adjuster.AdjustPitch(3);
      };
    }

    if (stage == 3) {
      document.getElementById('adjusterControlButton').style.display = 'none';
      clearInterval(accquireData);
      document.getElementById('adjCountDown').innerHTML = "Successfully Adjusted!";
      let tem = MaxMinSmooth(adjuster.reads, 20);
      adjuster.pitchmax = tem[1];
      console.log(tem);
      adjuster.pitchmin = tem[0];
      if (adjuster.pitchmin < this.pitchmin) {
        adjuster.pitchmin = 400;
      }
      if (adjuster.pitchmax > this.pitchmax) {
        adjuster.pitchmax = 1600;
      }
      adjuster.reads = [];
      setTimeout(function() {
        ClearAllDom();
      }, 1500);
    }
  }

  AdjustVolume(stage) {
    if (stage == 1) {
      CreateDom();
      document.getElementById('adjTitle').innerHTML = "<br><br>At your comfortable level, <br> please record both <br> your softest volume & your loudest volume.<br>";
      document.getElementById('adjCountDown').innerHTML = "Click Button to Start";
      document.getElementById('adjusterControlButton').innerHTML = "Start Recording";
      document.getElementById('adjusterControlButton').onclick = function () {
        adjuster.AdjustVolume(2);
      }
    }

    if (stage == 2) {
      document.getElementById('adjCountDown').innerHTML = ">> RECORDING NOW <<";
      this.reads = [];
      //keep geting data samples every 20ms
      var accquireData = setInterval(
        function() {
          adjuster.reads.push(mic.getLevel())
        },
        20);
      document.getElementById('adjusterControlButton').innerHTML = 'Stop Recording';

      document.getElementById('adjusterControlButton').onclick = function () {
        adjuster.AdjustVolume(3);
      };
    }

    if (stage == 3) {
      document.getElementById('adjusterControlButton').style.display = 'none';
      clearInterval(accquireData);
      document.getElementById('adjCountDown').innerHTML = "Successfully Adjusted!";
      let tem = MaxMinSmooth(adjuster.reads, 20);
      adjuster.volumemax = tem[1];
      console.log(tem);
      adjuster.volumemin = tem[0];
      adjuster.reads = [];
      setTimeout(function() {
        ClearAllDom();
      }, 1500);
    }
  }
}

// make a instance
var adjuster = new ADJUSTER();

function MaxMinSmooth(array, percentToSample) {
  //abandoned 10%
  let abandoned = Math.floor(array.length / 5);
  //get 20% percent
  let howmany = Math.floor((array.length / 100) * percentToSample);
  array.sort(function(a, b) {
    return a - b
  });
  console.log(array);

  let maxSum = 0;
  let minSum = 0;

  for (var i = 0; i <= howmany; i++) {
    maxSum += array[array.length - abandoned - i];
    minSum += array[i + abandoned];
  }

  let minAndMax = [minSum / howmany, maxSum / howmany,];
  console.log(minAndMax);
  return minAndMax;
}


function CreateDom() {
  let containerDiv = document.createElement('div');
  containerDiv.className = 'adjusters';
  document.body.appendChild(containerDiv);

  let title = document.createElement('h3');
  title.id = 'adjTitle';

  let countDown = document.createElement('h1');
  countDown.id = 'adjCountDown';


  let startButton = document.createElement('button');
  startButton.id = 'adjusterControlButton';

  //adding a start button

  containerDiv.appendChild(title);
  containerDiv.appendChild(countDown);
  containerDiv.appendChild(startButton);
}

function ClearAllDom() {
  let adjustersDom = document.getElementsByClassName('adjusters');
  adjustersDom[0].parentNode.removeChild(adjustersDom[0]);
}
