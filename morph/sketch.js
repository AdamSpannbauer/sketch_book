const canvas_w = 512;
const canvas_h = 512;

let pts;

const max_pts = 30;
const min_pts = 1;
let delta_pts = -1;
let n_pts = max_pts;

let angle = 0;
const delta_angle = 1;

let morph;

function setup() {
  createCanvas(canvas_w, canvas_h);
  angleMode(DEGREES);

  morph = new Morph();

  morph.pts_a = circle_points(200, n_pts);
  morph.pts_b = circle_points(200, n_pts + delta_pts);
  morph.find_closest();
  morph.morphing = true;

  pts = morph.pts_a;
}


function draw() {
  background(185, 130, 60);

  translate(width / 2, height / 2);
  // rotate(angle);

  if (morph.morphing) {
  	morph.morph();
  	pts = morph.morphed_pts;
  } else {
  	n_pts += delta_pts;

  	if (n_pts >= max_pts || n_pts <= min_pts) {
  		delta_pts *= -1;
  	}

  	morph.pts_a = morph.morphed_end_pts;
  	morph.pts_b = circle_points(200, n_pts + delta_pts);

	  morph.find_closest();
	  morph.morphing = true;

	  pts = morph.pts_a;
  }

  strokeWeight(2);
  stroke(100);
  fill(100);

  beginShape();
  for (pt of pts) {
  	vertex(pt.x, pt.y);
  }
  endShape(CLOSE);

  angle += delta_angle;
}


function circle_points(r, n) {
  if (n == 1) {
    return [createVector(0, 0)];
  }

  n = n || 30;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const angle = map(i, 0, n, 0, 360);

    const x = round(cos(angle) * r, 2);
    const y = round(sin(angle) * r, 2);
    const pt = createVector(x, y);

    pts.push(pt);
  }

  return pts;
}
