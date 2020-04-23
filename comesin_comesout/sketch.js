const canvas_w = 512;
const canvas_h = 512;

let dude_im;
const im_w = 200;
let im_h;

let sun_im;
const sun_w = 150;
let sun_h;

function preload() {
  dude_im = loadImage('no_mouth.png');
  sun_im = loadImage('sun.png');
}


function setup() {
  createCanvas(canvas_w, canvas_h);
  imageMode(CENTER);

  im_h = dude_im.height * im_w / dude_im.width;
  sun_h = sun_im.height * sun_w / sun_im.width;
}


function draw() {
  background(200);
  translate(width / 2, height / 2);

  image(dude_im, 0, 130, im_w, im_h);

  const cyc_val = sin(frameCount * 0.005);

  const [r1, g1, b1] = [252, 211, 3];
  const [r2, g2, b2] = [10, 10, 10];
  const sun_rgb = [
    map(cyc_val, -1, 1, r2, r1),
    map(cyc_val, -1, 1, g2, g1),
    map(cyc_val, -1, 1, b2, b1),
  ];

  fill(sun_rgb);
  ellipse(-170, -170, sun_w * 0.95, sun_h * 0.95);
  image(sun_im, -170, -170, sun_w, sun_h);

  const y = 90;
  noFill();
  strokeWeight(4);
  beginShape();
  curveVertex(-10, y);
  curveVertex(-10, y);
  curveVertex(0, y + cyc_val * 3);
  curveVertex(10, y);
  curveVertex(10, y);
  endShape();
}
