const canvas_w = 512;
const canvas_h = 512;


function setup() {
  createCanvas(canvas_w, canvas_h);
}


function draw() {
  background(200);
  translate(width / 2, height / 2);
  ellipse(0, 0, 300, 300);
}
