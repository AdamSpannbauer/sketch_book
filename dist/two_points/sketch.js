const w = 640;
const h = 480;

let x = null;
let z = null;

let dxy = 0;
let dxz = 0;
let dyz = 0;

let selector;
let dist_calc = 'Euclidean';

function setup() {
  createCanvas(w, h);

  sel = createSelect();
  sel.position(10, 10);
  sel.option('Euclidean');
  sel.option('Manhattan');
  sel.option('Chebyshev');
  sel.changed(set_dist_calc);
}


function draw() {
  clear();
  background(0);

  const y = createVector(mouseX, mouseY);
  const dist_calc = sel.value();

  dxy = 0;
  dxz = 0;
  dyz = 0;
  if (x != null) {
    dxy += euclidean_distance(x, y, 'x, y', 50);
    dxy += manhattan_distance(x, y, 'x, y', 70);
    dxy += chebyshev_distance(x, y, 'x, y', 90);

    strokeWeight(0);
    fill(255, 0, 0);
    text('x', x.x - 10, x.y - 10);
    ellipse(x.x, x.y, 20);

    fill(0, 255, 0);
    text('y', y.x - 10, y.y - 10);
    ellipse(y.x, y.y, 20);
  }

  if (z != null & x != null) {
    dyz += euclidean_distance(y, z, 'y, z', 120);
    dyz += manhattan_distance(y, z, 'y, z', 140);
    dyz += chebyshev_distance(y, z, 'y, z', 160);

    dxz += euclidean_distance(x, z, 'x, z', 190);
    dxz += manhattan_distance(x, z, 'x, z', 210);
    dxz += chebyshev_distance(x, z, 'x, z', 230);

    strokeWeight(0);
    fill(0, 0, 255);
    text('z', z.x - 10, z.y - 10);
    ellipse(z.x, z.y, 20);

    fill(255, 0, 0);
    text('x', x.x - 10, x.y - 10);
    ellipse(x.x, x.y, 20);

    fill(0, 255, 0);
    text('y', y.x - 10, y.y - 10);
    ellipse(y.x, y.y, 20);

    stroke(250);
    fill(250);
    strokeWeight(0.5);

    text('Triangle Inequality', 20, 280);
    text('d(x,y) <= d(x,z) + d(y,z)', 20, 300);
    text(`${dxy.toFixed(0)} <= ${dxz.toFixed(0)} + ${dyz.toFixed(0)}`, 20, 320);
    text(`${dxy.toFixed(0)} <= ${(dxz + dyz).toFixed(0)}`, 20, 340);
  }
}


function mouseClicked() {
  x = createVector(mouseX, mouseY);
}

function keyPressed() {
  z = createVector(mouseX, mouseY);
}

function set_dist_calc() {
  dist_calc = sel.value();
}

function mid_point_text(p1, p2, t) {
  const mp = createVector((p2.x - p1.x) / 2, (p2.y - p1.y) / 2);

  push();
  strokeWeight(0.5);
  stroke(250);
  fill(250);
  translate(p1);
  text(t, mp.x + 10, mp.y + 20);
  pop();
}

function euclidean_distance(p1, p2, name, text_y) {
  const dist = sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

  if (dist_calc == 'Euclidean') {
    fill(250);
    stroke(250);
    strokeWeight(3);
    line(p1.x, p1.y, p2.x, p2.y);
    mid_point_text(p1, p2, dist.toFixed(0));

    return_dist = dist;
  } else {
    return_dist = 0;
  }

  push();
  strokeWeight(0.5);
  fill(250);
  stroke(250);
  text(`Euclidean d(${name}): ${dist.toFixed(0)}`, 20, text_y);
  pop();

  return (return_dist);
}

function manhattan_distance(p1, p2, name, text_y) {
  const dist_x = abs(p1.x - p2.x);
  const dist_y = abs(p1.y - p2.y);
  const dist = dist_x + dist_y;

  if (dist_calc == 'Manhattan') {
    const l1p1 = createVector(p1.x, p1.y);
    const l1p2 = createVector(p2.x, p1.y);
    const l2p1 = createVector(p2.x, p1.y);
    const l2p2 = createVector(p2.x, p2.y);

    mid_point_text(l1p1, l1p2, dist_x.toFixed(0));
    mid_point_text(l2p1, l2p2, dist_y.toFixed(0));

    fill(250);
    stroke(250);
    strokeWeight(3);
    line(l1p1.x, l1p1.y, l1p2.x, l1p2.y);
    line(l2p1.x, l2p1.y, l2p2.x, l2p2.y);

    return_dist = dist;
  } else {
    return_dist = 0;
  }

  push();
  strokeWeight(0.5);
  fill(250);
  stroke(250);
  text(`Manhattan d(${name}): ${dist.toFixed(0)}`, 20, text_y);
  pop();

  return (return_dist);
}


function chebyshev_distance(p1, p2, name, text_y) {
  const dist_x = abs(p1.x - p2.x);
  const dist_y = abs(p1.y - p2.y);
  const dist = max([dist_x, dist_y]);

  if (dist_calc == 'Chebyshev') {
    const lp1 = createVector(p1.x, p1.y);
    let lp2;
    if (dist == dist_x) {
      lp2 = createVector(p2.x, p1.y);
    } else {
      lp2 = createVector(p1.x, p2.y);
    }

    mid_point_text(lp1, lp2, dist.toFixed(0));

    fill(250);
    stroke(250);
    strokeWeight(3);
    line(lp1.x, lp1.y, lp2.x, lp2.y);

    return_dist = dist;
  } else {
    return_dist = 0;
  }

  push();
  strokeWeight(0.5);
  fill(250);
  stroke(250);
  text(`Chebyshev d(${name}): ${dist.toFixed(0)}`, 20, text_y);
  pop();

  return (return_dist);
}
