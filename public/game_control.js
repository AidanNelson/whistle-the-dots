
// let levelOne = [dot, dot, dot, dot, dot];
// let levelOne = [{x,y},{x,y},{x,y}];

class Dot {
  constructor(x,y,d){
    this.x = x;
    this.y = y;
    this.d = d;
    this.upNext = false;
    this.isTagged = false;
  }

  isHit(px,py, pd){
    let d = dist(this.x,this.y,px,py);
    if (d < ((this.d + pd)/2)){
      return true;
    } else {
      return false;
    }
  }

  display(){
    if (this.isTagged){
      fill(255,0,0, 50);
    } else if (this.upNext){
      fill(255,0,0, 100);
    } else {
      fill(255,0,0,20);
    }
    // console.log("dot display function");
    ellipse(this.x,this.y,this.d,this.d);
  }
}

class Level {
  constructor(levelDots){
    this.picture = []; // [dot1, dot2, dot3]
    for (let i = 0; i< levelDots.length; i++){
      let x = levelDots[i].x;
      let y = levelDots[i].y;
      this.picture.push(new Dot(x,y,25));
    }
    this.upNext = 0;
    this.isWon = false;
  }

  update(px,py,pd){
    if (!this.isWon){
      // set the upNext dot to "upNext"
      // console.log(this.picture[this.upNext]);
      this.picture[this.upNext].upNext = true;
      // if the upNext dot is hit, set it to "tagged"

      if (this.picture[this.upNext].isHit(px,py,pd)) {
        console.log('hit!');
        // set upNext to "tagged"
        this.picture[this.upNext].isTagged = true;
        this.picture[this.upNext].upNext = false;
        // add 1 to upNext
        this.upNext += 1;

        if (this.upNext >= this.picture.length){
          this.isWon = true;
        }
      }
    }
  }

  display(){
    // console.log("level display function");
    // dots = [dot0, dot1, dot2, dot3(HIT), dot4(upnext), dot5, dot6]
    for (let i = 0; i < this.picture.length; i++){
      this.picture[i].display();
      if (i >= 1 && i < this.upNext){
        let pd = this.picture[i-1];
        let cd = this.picture[i];
        push();
        strokeWeight(1);
        stroke(255,0,0);
        line(pd.x,pd.y,cd.x,cd.y);
        pop();
      }
    }
  }
}
