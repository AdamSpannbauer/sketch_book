const canvas_w = 512;
const canvas_h = 512;

const n = 200;

const r = 1;
const d = r * 2;
const len = d * n;

const x1 = -len / 2 + r;
const y1 = -len / 2 + r;
const zs = [-d, 0, d];

const alpha = 100;
const colors = [
  [0, 0, 255, alpha],
  [0, 255, 0, alpha],
  [255, 0, 0, alpha],
];

const balls = [];

let logo;


function mode(a) {
  return Object.values(
    a.reduce((count, e) => {
      if (!(e in count)) {
        count[e] = [0, e];
      }

      count[e][0]++;
      return count;
    }, {}),
  ).reduce((a, v) => (v[0] < a[0] ? a : v), [0, null])[1];
}


function color_mode(img, x1, x2, y1, y2) {
  const colors = [];
  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      const i = (x + y * x2 - x1) * 4;
      const [r, g, b, a] = img.pixels.slice(i, i + 4);
      if (r + g + b > 0) {
        colors.push([r, g, b]);
      }
    }
  }

  if (colors.length == 0) {
    return [0, 0, 0];
  }
  return mode(colors);
}


function preload() {
  logo = loadImage('python_logo.png');
}


function setup() {
  createCanvas(canvas_w, canvas_h, WEBGL);

  logo.resize(len, len);
  logo.loadPixels();
  for (let k = 0; k < colors.length; k++) {
    const f = colors[k];
    const z = zs[k];

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const x = x1 + d * j;
        const y = y1 + d * i;
        const p = createVector(x, y, z);
        
        const im_x1 = x - r + len / 2;
        const im_x2 = x + r + len / 2;
        const im_y1 = y - r + len / 2;
        const im_y2 = y + r + len / 2;

        const mc = color_mode(logo, im_x1, im_x2, im_y1, im_y2);
        const ball_fill = [0, 0, 0, alpha];
        if (mc[2 - k] == 0) {
          ball_fill[3] = 0
        } else {
          ball_fill[2 - k] = mc[2 - k];
        }

        ball = new Ball(p, r, ball_fill);
        balls.push(ball);
      }
    }
  }
}


let a = 0;
const da = Math.PI / 200;
let turning = false;
function draw() {
  background(10);

  rotateX(a);
  rotateY(a);
  rotateZ(a);

  if (turning) {
    a += da;
  }

  for (const ball of balls) {
    ball.draw();
  }

  // image(logo, x1 - r, y1 - r, len, len);
}


function mousePressed() {
  turning = !turning;
}


class Ball {
  constructor(p, r, f) {
    this.p = p;
    this.r = r;
    this.fill = color(f);
  }

  draw() {
    push();
    translate(this.p.x, this.p.y, this.p.z);
    noStroke();
    fill(this.fill);
    sphere(this.r);
    pop();
  }
}
