const canvas_w = 512;
const canvas_h = 512;

const yellow = [253, 227, 117];
const pink = [230, 132, 135];
const blue = [59, 98, 151];

let font;

const off = 8;
const y = -130;

// const display_text = 'eski';
// const display_text = 'skinny\ncircuits'
const display_text = 'froggo &\nda crew'
const speed = 0.3;

function preload() {
  // font = loadFont('assets/Republica_Minor_2_0.otf');
  font = loadFont('assets/VCR_OSD_MONO.ttf');
}


function setup() {
  createCanvas(canvas_w, canvas_h);
}


function writeText(display_text, max_x, y, c) {
  fill(c);
  const x = min([-off + frameCount * speed, max_x]);
  text(display_text, x, y);
}


function draw() {
  background(20);

  textFont(font);
  textSize(80);
  textAlign(CENTER);

  translate(width / 2, height / 2);
  noStroke();
  
  writeText(display_text, -off, y, blue);
  writeText(display_text, 0, y, pink);
  writeText(display_text, off, y, yellow);
}
