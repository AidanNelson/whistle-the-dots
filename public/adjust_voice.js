//Results will be stored in this object, just use it whenever you need

class ADJUSTER {
  constructor() {
    this.pitchmin = 200;
    this.pitchmax = 1800;
    this.volumemin = 0.05;
    this.volumemax = 0.6
    this.reads = [];
  }

  AdjustPitch() {
    // CreateDomForAdjust();
    CreateDom();
    document.getElementById('adjTitle').innerHTML = "<br><br>At your comfortable level, <br> please keeping making voicefor about 2 seconds, <br> please make sure including <br> your low pitch voice and hight pitch voice ";
    document.getElementById('adjCountDown').innerHTML = "will begin in 2 seconds";
    // starting in 2 seconds;
    setTimeout(
      function() {
        document.getElementById('adjCountDown').innerHTML = "Now Please Make Voice...";
        this.reads = [];
        //keep geting data samples every 20ms
        let accquireData = setInterval(
          function() {
            this.reads.push(gamePitch)
          },
          20);
        //stop collecting and analyze data after 2 seconds
        setTimeout(function() {
          clearInterval(accquireData);
          document.getElementById('adjCountDown').innerHTML = "Successfully adjusted. \n Thanks!";
          let tem = MaxMinToAverage(this.reads, 20);
          //this.pitchmax = tem[1];
          adjuster.pitchmax = tem[1];
          console.log(tem);
          adjuster.pitchmin = tem[0];
          this.reads = [];
          setTimeout(function() {
            ClearAllDom();
          }, 1000);
        }, 3000);
      },
      3000);
  }

  AdjustVolume() {
    CreateDom();
    document.getElementById('adjTitle').innerHTML = "<br><br>At your comfortable level, <br> please keeping making voicefor about 2 seconds, <br> please make sure including <br> your low volume voice and high volume voice ";
    document.getElementById('adjCountDown').innerHTML = "will begin in 2 seconds";
    // starting in 2 seconds;
    setTimeout(
      function() {
        document.getElementById('adjCountDown').innerHTML = "Now Please Make Voice...";
        this.reads = [];
        //keep geting data samples every 20ms
        let accquireData = setInterval(
          function() {
            this.reads.push(mic.getLevel())
          },
          20);
        //stop collecting and analyze data after 2 seconds
        setTimeout(function() {
          clearInterval(accquireData);
          document.getElementById('adjCountDown').innerHTML = "Successfully adjusted. \n Thanks!";
          let tem = MaxMinToAverage(this.reads, 20);
          adjuster.volumemax = tem[1];
          console.log(tem);
          adjuster.volumemin = tem[0];
          this.reads = [];
          setTimeout(function() {
            ClearAllDom();
          }, 1000);
        }, 3000);
      },
      3000);

  }

}

// make a instance
var adjuster = new ADJUSTER();

function MaxMinToAverage(array, howmany) {
  array.sort(function(a, b) {
    return a - b
  });
  console.log(array);

  let max20 = 0;
  let min20 = 0;

  for (var i = 0; i <= howmany; i++) {
    max20 += array[array.length - 11 - i];
    min20 += array[i + 11];
  }

  let minAndMax = [min20 / howmany, max20 / howmany, ];
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

  containerDiv.appendChild(title);
  containerDiv.appendChild(countDown);
}

function ClearAllDom() {
  let adjustersDom = document.getElementsByClassName('adjusters');
  adjustersDom[0].parentNode.removeChild(adjustersDom[0]);
}
