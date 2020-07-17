const canvas_w = 512;
const canvas_h = 512;

const n_pts = 30;

let min_r = 150;
let max_r = 250;

let ra = 0;


function setup() {
  createCanvas(canvas_w, canvas_h);
  background(0, 71, 100);
  stroke(20);
  strokeWeight(1);
  fill(250, 100, 100);
}


function draw() {
  translate(width / 2, height / 2);
  rotate(ra);
  ra += 0.01;

  if (frameCount > 100) {
    const dr = 1.5;
  	min_r = max([0, min_r - dr]);
  	max_r = max([0, max_r - dr]);
  	strokeWeight(map(frameCount, 100, 200, 1, 0.5, true));
  }

  let pts = [];
  for (let i = 0; i < n_pts; i++) {
  	let a = map(i, 0, n_pts, 0, TWO_PI);

  	if (a >= TWO_PI) {
  		a -= TWO_PI;
  	}

  	let r = noise(a, frameCount * 0.05);
  	r = map(r, 0, 1, min_r, max_r);

  	const x = cos(a) * r;
  	const y = sin(a) * r;

  	const pt = createVector(x, y);
  	pts.push(pt);
  }

  const n = round(pts.length / 2);
 	const og_pts = pts.slice();
  pts = og_pts.slice(n, og_pts.length);
  pts.push(...og_pts.slice(0, n));

  beginShape();
  curveVertex(pts[0].x, pts[0].y);
  for (const pt of pts) {
  	curveVertex(pt.x, pt.y);
  }
  curveVertex(pts[0].x, pts[0].y);
  curveVertex(pts[0].x, pts[0].y);
  endShape();
}
