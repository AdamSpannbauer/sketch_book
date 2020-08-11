const canvas_w = 512;
const canvas_h = 512;

const {
  Engine,
  World,
  Bodies,
  Body
} = Matter;

const engine = Engine.create();

const balls = []
const n_balls = 40
const r = 10
let a = 0
let da = 0.01


function setup() {
  createCanvas(canvas_w, canvas_h);

  for (let i = 0; i < n_balls; i++) {
    const ball = new Ball(
      random(width / 2 - 40, width / 2 + 40),
      random(height / 2 - 100, height / 2),
      r)
    balls.push(ball)
  }
  capsule = new Capsule(width / 2, height / 2)

  Engine.update(engine);
  Engine.update(engine);
  Engine.update(engine);
}

let first_go = true

function draw() {
  if (a >= TWO_PI) {
    a -= TWO_PI
  }

  if (!first_go && a < PI) {
    background(30, map(a, 0, PI, 5, 130));
    da = 0.008
  } else if (a > PI) {
    first_go = false
    background(80, 30, 30, map(a, PI, TWO_PI, 10, 5));
    da = 0.006
  } else {
    background(30)
    da = 0.008
  }

  Engine.update(engine);

  translate(width / 2, height / 2)
  rotate(a)
  engine.world.gravity.x = -1 * cos(a + PI / 2)
  engine.world.gravity.y = sin(a + PI / 2)
  translate(-width / 2, -height / 2)

  a += da
  for (const ball of balls) {
    ball.draw()
    if (a > PI) {
      ball.update()
    }
  }
  capsule.draw()
}


class Wall {
  constructor(x1, y1, x2, y2, thick) {
    this.x = (x1 + x2) / 2
    this.y = (y1 + y2) / 2

    this.w = dist(x1, y1, x2, y2)
    this.h = thick

    const delta_x = x1 - x2
    const delta_y = y1 - y2
    this.a = atan2(delta_y, delta_x)

    this.body = Bodies.rectangle(
      this.x, this.y, this.w, this.h, {
        isStatic: true,
        angle: this.a
      }
    )

    World.add(engine.world, this.body);
  }

  draw() {
    push()
    beginShape()
    noStroke()
    for (const v of this.body.vertices) {
      vertex(v.x, v.y)
    }
    endShape(CLOSE)
    pop()
  }
}


class Ball {
  constructor(x, y, r) {
    this.fills = [
      [217, 133, 34],
      [251, 255, 12],
    ]

    if (random() > 0.7) {
      this.fills.reverse()
    }
    this.fill = this.fills[0]

    this.np = random(100)
    this.noff = 0.005

    this.inv_scl = 1.0

    this.body = Bodies.circle(x, y, r);
    World.add(engine.world, this.body);

    this.update()
  }

  update() {
    const n = noise(this.np)
    this.np += this.noff

    const [
      [r1, g1, b1],
      [r2, g2, b2]
    ] = this.fills

    const fr = map(n, 0.4, 0.6, r1, r2, true)
    const fg = map(n, 0.4, 0.6, g1, g2, true)
    const fb = map(n, 0.4, 0.6, b1, b2, true)

    this.fill = [fr, fg, fb]

    Body.scale(this.body, this.inv_scl, this.inv_scl)
    this.body.circleRadius = r

    const ri = map(n, 0, 1, r * 0.8, r * 1.5, true)
    const scl = ri / r
    this.inv_scl = r / ri
    Body.scale(this.body, scl, scl)
    this.body.circleRadius *= scl;
  }

  draw() {
    push()
    const {
      x,
      y
    } = this.body.position;

    fill(this.fill)
    ellipse(x, y, this.body.circleRadius * 2, this.body.circleRadius * 2)
    pop()
  }
}


class Capsule {
  constructor(x, y) {
    this.p = createVector(x, y)

    this.vertices = this.gen_vertices(100, 200)

    this.wall_thickness = 10
    this.walls = this.gen_walls()
  }

  gen_walls() {
    const walls = []

    let p1 = this.vertices[0]
    let p2 = this.vertices[this.vertices.length - 1]

    let wall = new Wall(p1.x, p1.y, p2.x, p2.y, this.wall_thickness)
    walls.push(wall)

    for (let i = 1; i < this.vertices.length; i++) {
      p1 = this.vertices[i]
      p2 = this.vertices[i - 1]
      wall = new Wall(p1.x, p1.y, p2.x, p2.y, this.wall_thickness)
      walls.push(wall)
    }

    return (walls)
  }

  gen_vertices(capsule_w, capsule_h) {
    const v = []
    for (let a = 0; a < TWO_PI; a += TWO_PI / 30) {
      let y_off = capsule_h / 2
      if (a > PI) {
        y_off *= -1
      }

      const x = cos(a) * capsule_w / 2
      const y = sin(a) * capsule_w / 2 + y_off

      v.push({
        x: x + this.p.x,
        y: y + this.p.y
      })
    }

    return v
  }

  draw() {
    // for (const wall of this.walls) {
    //   wall.draw()
    // }

    push()
    strokeWeight(3)
    fill(255, 100)
    beginShape()
    for (const v of this.vertices) {
      vertex(v.x, v.y)
    }
    endShape(CLOSE)

    fill(217, 133, 34, 200)
    stroke(217, 133, 34, 100)
    strokeWeight(8)
    beginShape()
    for (const v of this.vertices) {
      if (v.y > height * 0.525) {
        vertex(v.x, height * 0.525)
      } else {
        vertex(v.x, v.y)
      }

    }
    endShape(CLOSE)
    pop()
  }
}