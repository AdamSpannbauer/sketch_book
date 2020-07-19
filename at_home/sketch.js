const canvas_w = 512;
const canvas_h = 512;

let circle_lines_1;
let circle_lines_2;

function setup() {
  createCanvas(canvas_w, canvas_h);

  circle_lines_1 = new CircleLines(width / 2, height / 2, 200, 0.1, [200, 100, 100]);
  circle_lines_2 = new CircleLines(width / 2, height / 2, 200, 0.2, [100, 200, 100]);
}


function draw() {
  background(20, 20, 90);

  circle_lines_1.update()
  circle_lines_1.draw();

  circle_lines_2.update()
  circle_lines_2.draw();
}


class CircleLines {
  constructor(x, y, r, dy, c) {
    this.p = createVector(x, y);
    this.r = r;

    this.a = 0;
    this.da = random(-0.01, 0.01);

    this.stroke = c;
    this.strokeWeight = 10;
    this.step = this.strokeWeight * 2.5;

    this.dy = dy;
    this.y_off = 0;
  }

  update() {
    this.y_off += this.dy;
    if (this.y_off >= this.step) {
      this.y_off = 0;
    }

    this.a += this.da;
  }

  draw() {
    push();
    translate(this.p.x, this.p.y);
    
    rotate(this.a);

    stroke(this.stroke);
    strokeWeight(this.strokeWeight);

    for (let y = -this.r + this.y_off; y < this.r; y += this.step) {
      const w = 2 * sqrt(this.r ** 2 - y ** 2);
      line(-w / 2, y, w / 2, y);
    }
    pop();
  }
}
