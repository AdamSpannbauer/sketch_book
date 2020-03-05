const canvas_w = 400;
const canvas_h = 400;

const ooze = [];
const n_ooze = 50;
const max_ooze = 150;

const box_w = 200;
const no_min_x = canvas_w / 2 - box_w / 2;
const no_min_y = canvas_h / 2 - box_w / 2;
const no_max_x = canvas_w / 2 + box_w / 2;
const no_max_y = canvas_h / 2 + box_w / 2;


function new_ooze() {
  const scl = random(10, 50);
  const x = random(width);
  const y = -4 * scl;

  return new Ooze(x, y, scl);
}

function setup() {
  createCanvas(canvas_w, canvas_h);
  pixelDensity(1);
  ooze.push(new_ooze());
}


function draw() {
  background(0);
  colorMode(RGB);

  if (ooze.length < n_ooze) {
    ooze.push(new_ooze());
  }

  for (const o of ooze) {
    o.update();
    o.draw();

    if (!o.oozing && ooze.length < max_ooze && !o.parent) {
      o.parent = true;
      ooze.push(new_ooze());
    }
  }

  colorMode(HSB);
  transform_pixels();

  const im = get(no_min_x, no_min_y, box_w / 2, box_w / 2);
  image(im, no_min_x, no_min_y, box_w, box_w);
}


function transform_pixels() {
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // if (x >= no_min_x && x <= no_max_x && y >= no_min_y && y <= no_max_y) { continue; }
      // if (!(x >= no_min_x && x <= no_max_x && y >= no_min_y && y <= no_max_y)) { continue; }

      const index = (x + y * width) * 4;
      const v = pixels[index + 0];

      if (v < 20) {
        set(x, y, color(v, v, v));
      } else {
        set(x, y, color(v * 2, 255, 255));
      }
    }
  }
  updatePixels();
}
