const canvas_w = 512;
const canvas_h = 512;

const balls = [];
const n_balls = 130;

let t = 0;

let fps_p;
let regen = false;

function setup() {
  createCanvas(canvas_w, canvas_h);
  fps_p = createP();
}


function draw() {
  background(50);
  fps_p.html(frameRate().toFixed(1));

  let a = 255;
  if (t < 100) {
    a = map(t, 0, 100, 0, 255);
  }
  const c = [30, 100, 200, a];

  const alive = 0;
  for (let i = balls.length - 1; i >= 0; i--) {
    ball = balls[i];

    ball.healthy_color = c;
    ball.update(balls);
    ball.draw();

    if (ball.is_dead) {
      balls.splice(i, 1);
    }
  }

  if (balls.length == 0) {
    if (!regen) {
      setTimeout(() => {
        for (let i = 0; i < n_balls; i++) {
          const ball = new Ball();
          balls.push(ball);
        }
        t = 0;
        regen = false;
      }, 2000);
    }

    regen = true;
  }

  t++;

  if (t == 200) {
    balls[0].is_infected = true;
    balls[0].is_dying = true;
    balls[0].ttl = 3000;
  }
}


function circle_intersect(p1, r1, p2, r2) {
  const d = dist(p1.x, p1.y, p2.x, p2.y);
  const int_d = r1 + r2;

  return d < int_d * 0.5;
}


class Ball {
  constructor() {
    this.x_off = random(100);
    this.y_off = random(100);
    this.d_off = 0.0015;

    this.x_min = 0 - width * 0.3;
    this.y_min = 0 - height * 0.3;
    this.x_max = width * 1.3;
    this.y_max = height * 1.3;

    const x = map(noise(this.x_off), 0, 1, this.x_min, this.x_max);
    const y = map(noise(this.y_off), 0, 1, this.y_min, this.y_max);
    this.p = createVector();

    this.r = random(5, 20);

    this.hist = [];
    this.max_hist = 50;

    this.is_infected = false;
    this.is_dying = false;
    this.is_dead = false;

    this.t = 0;
    this.ttl = random(500, 2000);
    this.incubation = 100;

    this.infected_color = [30, 200, 100, 255];
    this.healthy_color = [30, 100, 200, 255];
    this.dying_color = [0, 0, 0, 0];
    this.color = this.healthy_color;
  }

  detect_infect(others) {
    if (this.is_infected) {
      return;
    }

    for (const other of others) {
      if (!other.is_infected) {
        continue;
      }

      if (other.p == this.p) {
        continue;
      }

      const contact = circle_intersect(this.p, this.r, other.p, other.r);
      if (contact) {
        this.is_infected = true;
        this.is_dying = true;
        return;
      }

      for (let i = 0; i < other.hist.length; i += 20) {
        const pt = other.hist[i];
        const pt_r = map(i, 0, other.hist.length, other.r * 0.5, other.r);
        const contact = circle_intersect(this.p, this.r, pt, pt_r);

        if (contact) {
          this.is_infected = true;
          this.is_dying = true;
          return;
        }
      }
    }
  }

  update(others) {
    if (this.is_dead) {
      this.hist = [];
      this.p.set(999, 999);
    }

    this.x_off += this.d_off;
    this.y_off += this.d_off;

    const x = map(noise(this.x_off), 0, 1, this.x_min, this.x_max);
    const y = map(noise(this.y_off), 0, 1, this.y_min, this.y_max);

    this.detect_infect(others);
    if (this.is_infected) {
      this.t++;

      if (this.t < this.incubation) {
        const r = map(this.t, 0, this.incubation, this.healthy_color[0], this.infected_color[0]);
        const g = map(this.t, 0, this.incubation, this.healthy_color[1], this.infected_color[1]);
        const b = map(this.t, 0, this.incubation, this.healthy_color[2], this.infected_color[2]);

        this.color = [r, g, b];
      } else if (this.t > this.ttl && this.is_dying) {
        const r = map(this.t, this.ttl, this.ttl + 200, this.infected_color[0], this.dying_color[0]);
        const g = map(this.t, this.ttl, this.ttl + 200, this.infected_color[1], this.dying_color[1]);
        const b = map(this.t, this.ttl, this.ttl + 200, this.infected_color[2], this.dying_color[2]);
        const a = map(this.t, this.ttl, this.ttl + 200, this.infected_color[3], this.dying_color[3]);

        this.color = [r, g, b, a];

        if (a <= 0) {
          this.is_dead = true;
        }
      } else {
        this.color = this.infected_color;
      }

      this.hist.push(this.p.copy());
      if (this.hist.length > this.max_hist) {
        this.hist.splice(0, 1);
      }
    } else if (this.hist.length > 0) {
      this.t = 0;
      this.hist = [];
    }

    this.p.set(x, y);
  }

  draw() {
    push();
    noStroke();
    if (!this.is_infected) {
      this.color = this.healthy_color;
    }
    fill(this.color);

    if (this.is_infected) {
      for (let i = 10; i < this.hist.length; i += 10) {
        const p1 = this.hist[i - 10];
        const p2 = this.hist[i];
        const r = map(i, 0, this.hist.length, this.r * 0.5, this.r);

        stroke(this.color);
        strokeWeight(r);
        line(p1.x, p1.y, p2.x, p2.y);
      }
      if (this.hist.length >= 10) {
        const p = this.hist[this.hist.length - 10]
        line(p.x, p.y, this.p.x, this.p.y);
      }
    }

    noStroke();
    ellipse(this.p.x, this.p.y, this.r, this.r);

    pop();
  }
}
