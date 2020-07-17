const canvas_w = 512;
const canvas_h = 512;

const p_off = 0.001;
const a_off = 0.001;

let x;
let y;
let a;

let x_seed;
let y_seed;
let a_seed;

let line_color;

const line_w = 100;

function setup() {
  createCanvas(canvas_w, canvas_h);
  background(240);

  x_seed = random(100);
  y_seed = random(100);
  a_seed = random(100);

  line_color = random([
    [0, 0, 255],
    [0, 100, 0],
    [255, 0, 0]
  ]);

  line_color = color(line_color);
}


let x_shift = 0;
let y_shift = 0;
function draw() {
  translate(x_shift, y_shift);
  x_shift += 0.1;
  y_shift += 0.1;

  x = noise(x_seed) * width * 0.5;
  y = noise(y_seed) * height * 0.5;
  a = noise(a_seed) * TWO_PI * 2;

  x_seed += p_off;
  y_seed += p_off;
  a_seed += a_off;

  strokeWeight(2);
  const alpha = random(5, 20);
  line_color.setAlpha(alpha)

  push()
  translate(x, y);
  rotate(a);
  
  stroke(line_color);
  line(-line_w / 2, line_w / 2, 0, 0);
  pop()
}
