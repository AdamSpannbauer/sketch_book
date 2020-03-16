const canvas_w = 512;
const canvas_h = 512;

// module aliases
const { Engine } = Matter;
const { World } = Matter;
const { Bodies } = Matter;
const { Constraint } = Matter;

// create an engine
const engine = Engine.create();

let balls = [];
const n_balls = 8;


let particles = [];
let constraints = [];

const n_rows = 10;
const n_cols = 10;
const step = 20;
const radius = 2;

const net_w = n_cols * step;
const net_h = n_rows * step;

let t = 0;

let min_x = Infinity;
let max_x = -Infinity;
let min_y = Infinity;
let max_y = -Infinity;

let adj_x = 0;
let adj_y = 0;
const min_adj_dx = 0;
const min_adj_dy = 0;
const max_adj_x = 100;
const max_adj_y = 100;


function setup() {
  createCanvas(canvas_w, canvas_h);
  rectMode(CENTER);

  for (let i = 0; i < n_balls; i++) {
    ball = new Particle(
      width / 2 + random(-width / 2, width / 2),
      height / 2 + random(50, 200),
      random(10, 50),
      engine,
      { isStatic: true },
    );
    balls.push(ball);
  }

  const x_start = width / 2 - net_w / 2;
  const y_start = -150;
  for (let row = 0; row < n_rows; row++) {
    particles.push([]);
    for (let col = 0; col < n_cols; col++) {
      const x = x_start + col * step;
      const y = y_start + row * step;
      const p = new Particle(x, y, radius, engine);

      if (x < min_x) {
        min_x = x;
      }

      if (x > max_x) {
        max_x = x;
      }

      if (y < min_y) {
        min_y = y;
      }

      if (y > max_y) {
        max_y = y;
      }

      particles[row].push(p);

      if (row > 0) {
        const options = {
          bodyA: p.body,
          bodyB: particles[row - 1][col].body,
          stiffness: 0.3,
        };
        const constraint = new Straint(options);
        constraints.push(constraint);
      }

      if (col > 0) {
        const options = {
          bodyA: p.body,
          bodyB: particles[row][col - 1].body,
          stiffness: 0.3,
        };
        const constraint = new Straint(options);
        constraints.push(constraint);
      }
    }
  }

  particles[0][0].body.isStatic = true;

  adj_x = -(min_x + (max_x - min_x) / 2) + width / 2;
  adj_y = -(min_y + (max_y - min_y) / 2) + height / 2;
}


function draw() {
  if (t == 0) {
    randomSeed(1337)

    engine.world.bodies = []
    balls = [];
    particles = [];
    constraints = [];

    setup();
  }

  background(30);
  Engine.update(engine);

  const new_adj_x = -(min_x + (max_x - min_x) / 2) + width / 2;
  const new_adj_y = -(min_y + (max_y - min_y) / 2) + height / 2;

  const x_adj_diff = new_adj_x - adj_x;
  const y_adj_diff = new_adj_y - adj_y;

  if (abs(x_adj_diff) > min_adj_dx) {
    if (abs(x_adj_diff) > max_adj_x) {
      const sign = abs(new_adj_x) / new_adj_x;
      adj_x = min_x + sign * max_adj_x;
    } else {
      adj_x = new_adj_x;
    }
  }

  if (abs(y_adj_diff) > min_adj_dy) {
    if (abs(y_adj_diff) > max_adj_y) {
      const sign = abs(new_adj_y) / new_adj_y;
      adj_y = min_y + sign * max_adj_y;
    } else {
      adj_y = new_adj_y;
    }
  }

  min_x = Infinity;
  max_x = -Infinity;
  min_y = Infinity;
  max_y = -Infinity;

  for (const c of constraints) {
    c.draw(adj_x, adj_y);
  }

  for (let row = 0; row < n_rows; row++) {
    for (let col = 0; col < n_cols; col++) {
      particles[row][col].draw(adj_x, adj_y);

      const { x } = particles[row][col].body.position;
      const { y } = particles[row][col].body.position;

      if (x < min_x) {
        min_x = x;
      }

      if (x > max_x) {
        max_x = x;
      }

      if (y < min_y) {
        min_y = y;
      }

      if (y > max_y) {
        max_y = y;
      }
    }
  }

  for (let i = 0; i < balls.length; i++) {
    if (balls[i].offscreen(adj_x, adj_y, true) && t < 400) {
      const ball = new Particle(
        width / 2 + random(-width / 2, width / 2) - adj_x,
        height / 2 + random(10, 300) - adj_y + 500,
        random(10, 50),
        engine,
        { isStatic: true },
      );

      World.remove(engine.world, balls[i].body);

      balls[i] = ball;
    }

    balls[i].draw(adj_x, adj_y);
  }

  if (t > 200) {
    particles[0][0].body.isStatic = false;
  }

  if (t > 500) {
    particles[0][0].body.isStatic = true;
    t = 0;
  }

  t++;
}


class Box {
  constructor(x, y, w, h, engine, options) {
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.w = w;
    this.h = h;
    this.fill = random(100, 255);

    World.add(engine.world, this.body);
  }

  draw() {
    push();
    noStroke();
    fill(this.fill);
    beginShape();
    for (let i = 0; i < this.body.vertices.length; i++) {
      const v = this.body.vertices[i];
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
    pop();
  }
}


class Particle {
  constructor(x, y, r, engine, options) {
    this.body = Bodies.circle(x, y, r, options);
    this.r = r;
    this.fill = [random(100, 255), 255];

    World.add(engine.world, this.body);
  }

  draw(adj_x, adj_y) {
    let { x } = this.body.position;
    let { y } = this.body.position;

    if (adj_x) {
      x += adj_x;
    }

    if (adj_y) {
      y += adj_y;
    }

    push();
    noStroke();
    fill(this.fill);
    ellipse(x, y, this.r * 2, this.r * 2);
    pop();
  }

  offscreen(adj_x, adj_y, above_only) {
    let { x } = this.body.position;
    let { y } = this.body.position;

    if (adj_x) {
      x += adj_x;
    }

    if (adj_y) {
      y += adj_y;
    }

    if (above_only) {
      return y + this.r * 1.5 < 0;
    }

    return (
      x + this.r * 1.5 < 0
      || x - this.r * 1.5 > width
      || y + this.r * 1.5 < 0
      || y - this.r * 1.5 > height
    );
  }
}


class Straint {
  constructor(options) {
    this.constraint = Constraint.create(options);
    World.add(engine.world, this.constraint);

    this.stroke = random(100, 255);
  }

  draw(adj_x, adj_y) {
    let x1 = this.constraint.bodyA.position.x;
    let y1 = this.constraint.bodyA.position.y;
    let x2 = this.constraint.bodyB.position.x;
    let y2 = this.constraint.bodyB.position.y;

    if (adj_x) {
      x1 += adj_x;
      x2 += adj_x;
    }

    if (adj_y) {
      y1 += adj_y;
      y2 += adj_y;
    }
    push();
    stroke(this.stroke);
    strokeWeight(3);
    line(x1, y1, x2, y2);
    pop();
  }
}
