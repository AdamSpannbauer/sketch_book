const canvas_w = 512;
const canvas_h = 512;

const walkers = [];
const n_walkers = 50;
const max_walkers = 500;

const stuck = [];
const stuck_fill = [250, 0, 100];
const stuck_fill2 = [100, 0, 250];
const stuck_fill3 = [0, 100, 250];
const stuck_fill4 = [0, 250, 100];
const stuck_fill5 = [100, 250, 0];
const stuck_fill6 = [250, 100, 0];

let angle_y = 0;
let angle_x = 0;
let angle_z = 0;
const d_angle = 0.1;


function sq_dist(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = p1.z - p2.z;

  return dx ** 2 + dy ** 2 + dz ** 2;
}


function rand_pos(a, b) {
  const x = random(a, b);
  const y = random(a, b);
  const z = random(a, b);

  return createVector(x, y, z);
}


// function rand_pos(a, b) {
//   let x = random(a, b);
//   let y = random(a, b);
//   let z = random(a, b);

//   const wall = floor(random(6))
//   switch (wall) {
//     case 0:
//       x = a;
//       break
//     case 1:
//       x = b
//       break
//     case 2:
//       y = a
//       break
//     case 3:
//       y = b
//       break
//     case 4:
//       z = a
//       break
//     case 5:
//       z = b
//       break
//   }

//   return createVector(x, y, z);
// }

// function rand_pos(a, b) {
//   return createVector(0, 0, 0);
// }


function setup() {
  createCanvas(canvas_w, canvas_h, WEBGL);
  angleMode(DEGREES);
  randomSeed(42);

  // const mp_ball = new Ball(createVector(), 20, true);
  const mp_ball = new Ball(createVector(-100, 0, 0), 20, true);
  const mp_ball2 = new Ball(createVector(100, 0, 0), 20, true);
  const mp_ball3 = new Ball(createVector(0, 100, 0), 20, true);
  const mp_ball4 = new Ball(createVector(0, -100, 0), 20, true);
  const mp_ball5 = new Ball(createVector(0, 0, -100), 20, true);
  const mp_ball6 = new Ball(createVector(0, 0, 100), 20, true);
  
  mp_ball.fill = stuck_fill;
  mp_ball2.fill = stuck_fill2;
  mp_ball3.fill = stuck_fill3;
  mp_ball4.fill = stuck_fill4;
  mp_ball5.fill = stuck_fill5;
  mp_ball6.fill = stuck_fill6;
  
  stuck.push(mp_ball);
  stuck.push(mp_ball2);
  stuck.push(mp_ball3);
  stuck.push(mp_ball4);
  stuck.push(mp_ball5);
  stuck.push(mp_ball6);

  for (let i = 0; i < n_walkers; i++) {
    const walker = new Ball(rand_pos(-200, 200), 20);
    walkers.push(walker);
  }
}


function draw() {
  background(10);
  rotateX(angle_x);
  rotateY(angle_y);
  rotateZ(angle_z);

  pointLight(255, 255, 255, 0, -height / 2, 0);
  pointLight(255, 255, 255, 0, height / 2, 0);
  pointLight(255, 255, 255, -width / 2, 0, 0);
  pointLight(255, 255, 255, width / 2, 0, 0);
  pointLight(255, 255, 255, 0, 0, 0);

  for (let i = 0; i < stuck.length; i++) {
    stuck[i].draw();
  }

  for (let i = walkers.length - 1; i >= 0; i--) {
    walkers[i].move();
    const s_fill = walkers[i].check_stuck(stuck);

    if (walkers[i].stuck) {
      const gen = walkers[i].generation;
      walkers[i].fill = [
        constrain(s_fill[0] + random(-50, 50), 0, 255),
        constrain(s_fill[1] + random(-50, 50), 0, 255),
        constrain(s_fill[2] + random(-50, 50), 0, 255)
      ];
      stuck.push(walkers[i]);
      walkers.splice(i, 1);

      if (walkers.length + stuck.length < max_walkers) {
        const walker = new Ball(rand_pos(-200, 200), 20, gen + 1);
        walkers.push(walker);
      }
    } else {
      // walkers[i].draw();
    }
  }

  angle_x += d_angle;
  angle_y += d_angle;
  angle_z += d_angle;
}

class Ball {
  constructor(p, r, stuck, generation) {
    this.p = p;
    this.stuck = false;

    this.fill = 200;

    this.generation = generation || 1;
    this.r = random(5, 20);

    this.xoff = random(200);
    this.yoff = random(200);
    this.zoff = random(200);
  }

  draw() {
    push();
    noStroke();
    ambientMaterial(this.fill);
    translate(this.p.x, this.p.y, this.p.z);
    sphere(this.r);
    pop();
  }

  check_stuck(others) {
    for (const other of others) {
      const sq_d = sq_dist(this.p, other.p);
      const thresh_d = ((this.r + other.r) * 0.8) ** 2;
      if (sq_d < thresh_d) {
        this.stuck = true;
        return other.fill;
      }
    }
  }

  move() {
    const v = p5.Vector.random3D();

    // const dx = map(noise(this.xoff), 0, 1, -1, 1);
    // const dy = map(noise(this.yoff), 0, 1, -1, 1);
    // const dz = map(noise(this.zoff), 0, 1, -1, 1);
    // const v = createVector(dx, dy, dz);

    // this.xoff += random(-0.05, 0.05);
    // this.yoff += random(-0.05, 0.05);
    // this.zoff += random(-0.05, 0.05);

    v.mult(10);
    this.p.add(v);

    this.p = createVector(
      constrain(this.p.x, -110, 110),
      constrain(this.p.y, -110, 110),
      constrain(this.p.z, -110, 110),
    );
  }
}
