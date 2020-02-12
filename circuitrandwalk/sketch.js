const w = 640;
const h = 480;

const cx = w / 2;
const cy = h / 2;

const walks = [];
const background_color = [30, 70, 30, 255];


function setup() {
  createCanvas(w, h);
  background(background_color);
  angleMode(DEGREES);
  ellipseMode(CENTER);

  for (let i = 0; i < 4; i++) {
    walks.push(new CircuitWalk());
  }
}

function draw() {
  for (let i = 0; i < walks.length; i++) {
    const walk = walks[i];

    if (walk.respawns > 5) {
      walks.splice(i, 1);
    } else {
      walk.update();
      walk.draw();
    }
  }
}


class CircuitWalk {
  constructor() {
    this.max_history = 300;

    this.turn_every = 30;
    this.time_since_turn = 0;

    this.speed = 3;
    this.vx = 0;
    this.vy = 0;

    this.growing_circle = false;
    this.circle_angle = 1;
    this.radius = 30;

    this.stroke = [150, 150, 150, 255];
    this.strokeWeight = 5;

    this.respawns = 0;
    this.reset();
  }

  reset() {
    this.respawns++;

    if (random() > 0.5) {
      this.stroke = [150, 150, 150, 255];
    } else {
      this.stroke = [100, 100, 100, 255];
    }

    this.growing_circle = false;
    this.circle_angle = 1;
    this.radius = random(10, 50);

    this.reset_velocity();
    this.reset_location();
  }

  reset_location() {
    let x;
    let y;

    if (this.vx != 0) {
      y = round(random() * height);
      x = width;
      if (this.vx > 0) {
        x = 0;
      }
    } else {
      x = round(random() * width);
      y = height;
      if (this.vy > 0) {
        y = 0;
      }
    }

    const p = createVector(x, y);

    this.history = [];
    this.history.push(p);
    this.history.push(p);
  }

  reset_velocity() {
    this.vx = 0;
    this.vy = 0;

    if (random() > 0.5) {
      this.vx = this.speed;
    } else {
      this.vy = this.speed;
    }

    if (random() > 0.5) {
      this.vx *= -1;
      this.vy *= -1;
    }
  }

  turn() {
    const current_v = createVector(this.vx, this.vy);
    let new_v;
    while (true) {
      this.reset_velocity();
      new_v = createVector(this.vx, this.vy);

      if ((new_v.x != 0 & current_v.x == 0)
				| (new_v.y != 0 & current_v.y == 0)
				| (new_v.x + current_v.x == 2)
				| (new_v.y + current_v.y == 2)
				| (new_v.x == current_v.x & new_v.y == current_v.y)) {
        break;
      }
    }
  }

  grow_circle() {
    const pos = this.history[this.history.length - 2];
    const center = createVector(pos.x + this.vx * this.radius / this.speed,
								  pos.y + this.vy * this.radius / this.speed);
    const d = 2 * this.radius;

    let angle;
    const arc_1_angle = map(this.circle_angle / 100, 0, 1, 180, 360);
    const arc_2_angle = map(this.circle_angle / 100, 0, 1, 180, 0);

    if (this.vx == 0) {
      angle = asin(this.vy / this.speed);
    } else {
      angle = acos(this.vx / this.speed);
    }

    push();
    noFill();
    stroke(this.stroke);
    strokeWeight(this.strokeWeight);
    translate(center.x, center.y);
    rotate(angle);
    arc(0, 0, d, d, 180, arc_1_angle);
    arc(0, 0, d, d, arc_2_angle, 180);
    pop();
  }

  update() {
    const p1 = this.history[this.history.length - 1];
    let p2 = createVector(p1.x + this.vx, p1.y + this.vy);
    const p2c = get(p2.x, p2.y);

    if (this.growing_circle) {
      if (this.circle_angle > 100) {
        this.growing_circle = false;
        this.circle_angle = 1;

        p2 = createVector(p1.x + this.vx * this.radius / this.speed * 2,
								  p1.y + this.vy * this.radius / this.speed * 2);

        this.history = [];
        this.history.push(p2);
        this.history.push(p2);
        return;
      }
      this.circle_angle++;
      return;
    }

    this.history.push(p2);
    if (this.history.length >= this.max_history) {
      this.history.splice(0, 1);
    }

    if (this.time_since_turn >= this.turn_every) {
      if (random() > 0.9) {
        this.growing_circle = true;
      } else {
        this.turn();
      }
      this.time_since_turn = 0;
    }

    if (p1.x > width + this.max_history
			| p1.y > height + this.max_history
			| p1.x < 0 - this.max_history
			| p1.y < 0 - this.max_history) {
      this.reset();
    }

    if (JSON.stringify(p2c) != JSON.stringify(background_color)) {
      this.draw();
      this.reset();
    }

    this.time_since_turn++;
  }

  draw() {
    if (this.growing_circle) {
      this.grow_circle();
    } else {
      const i = this.history.length - 1;
      const p1 = this.history[i - 1];
      const p2 = this.history[i];

      push();
      stroke(this.stroke);
      strokeWeight(this.strokeWeight);
      line(p1.x, p1.y, p2.x, p2.y);
      pop();
    }
  }
}
