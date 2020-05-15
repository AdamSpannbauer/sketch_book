const canvas_w = 512;
const canvas_h = 512;

const trash = [];
const max_trash = 300;

const trash_ims = [];
const trash_im_names = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

let roomba;
let roomba_im;

let fps_p;

let font;
const text_size = 150;
const sample_factor = 0.06;


function im_h(im, w) {
  return im.height * w / im.width;
}


function preload() {
  font = loadFont('assets/Neoteric-32A8.ttf');
  roomba_im = loadImage('assets/roomba.png');
  for (trash_im_name of trash_im_names) {
    const trash_im = loadImage(`assets/trash/${trash_im_name}.png`);
    trash_ims.push(trash_im);
  }
}


function setup() {
  createCanvas(canvas_w, canvas_h);
  imageMode(CENTER);
  fps_p = createP();

  textFont(font);
  textAlign(CENTER);

  const text_pts = font.textToPoints(
    'it',
    75,
    height / 2 - text_size * 0.75,
    text_size,
    {
      sampleFactor: sample_factor,
    },
  );

  const b = font.textToPoints(
    'never',
    100,
    height / 2,
    text_size,
    {
      sampleFactor: sample_factor,
    },
  );

  const c = font.textToPoints(
    'ends',
    175,
    height / 2 + text_size * 0.75,
    text_size,
    {
      sampleFactor: sample_factor,
    },
  );

  text_pts.push(...b);
  text_pts.push(...c);

  for (const pt of text_pts) {
    const piece = new Trash(pt.x, pt.y);
    trash.push(piece);
  }

  roomba = new Roomba();
}


function draw() {
  background(175);

  fps_p.html(frameRate().toFixed(1));
  for (const piece of trash) {
    piece.draw();
    piece.update();
  }

  roomba.draw();
  roomba.update(trash);

  const n = max_trash - trash.length;
  for (let i = 0; i < n; i++) {
    const piece = new Trash(random(width), random(height));
    trash.push(piece);
  }
}
