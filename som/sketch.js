const w = 640;
const h = 480;

let mouse_pressed = false;
let is_dragging = false;
let translate_z = 0;

let d;

const n_points = 20;
const points = [];

let angleX = 0;
let angleY = 0;

function setup() {
  createCanvas(w, h, WEBGL);
  angleMode(DEGREES);
  addScreenPositionFunction();

  d = new DragNet(0, 0, 6, 6, 40);

  for (let i = 0; i < n_points; i++) {
    const x = random(-150, 150);
    const y = random(-150, 150);
    const z = random(-150, 150);
    points.push(createVector(x, y, z));
  }
}


function draw() {
  background(240);

  rotateX(angleX);
  rotateY(angleY);

  for (const point of points) {
    push();
    translate(point);
    fill(150, 0, 0);
    noStroke(150, 0, 0);
    sphere(10);
    pop();
  }

  d.draw();
  translate_z = 0;
}


function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    angleY -= 20;
  } else if (keyCode === RIGHT_ARROW) {
    angleY += 20;
  } else if (keyCode === DOWN_ARROW) {
    angleX -= 20;
  } else if (keyCode === UP_ARROW) {
    angleX += 20;
  } else if (keyCode === ESCAPE) {
  	angleX = 0;
  	angleY = 0;
  }
}


function keyTyped() {
  if (key === '=') {
    translate_z = 5;
  } else if (key === '-') {
    translate_z -= 5;
  }
}


function mousePressed() {
  mouse_pressed = true;
}


function mouseReleased() {
  mouse_pressed = false;
}


class DragNode {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.z = 0;
    this.r = radius;

    this.fill = [50, 50, 50];
    this.hover_fill = [100, 100, 100];
    this.hover_stroke = [3, 3, 3];

    this.connected_nodes = [];
    this.being_dragged = false;
  }

  draw() {
    push();
    fill(this.fill);
    noStroke();

    const mouse_rel = screenPosition(mouseX - width / 2, mouseY - height / 2, 0);
    const mouse_x = mouse_rel.x;
    const mouse_y = mouse_rel.y;

    if (this.being_dragged | abs(this.x - mouse_x) <= this.r & abs(this.y - mouse_y) <= this.r) {
      if (mouse_pressed & (!is_dragging | this.being_dragged)) {
        fill(this.hover_fill);
        stroke(this.hover_stroke);

        is_dragging = true;
        this.being_dragged = true;
        this.x = mouse_x;
        this.y = mouse_y;
        this.z += translate_z;
      } else if (this.being_dragged & !mouse_pressed) {
        is_dragging = false;
        this.being_dragged = false;
      } else if (!is_dragging) {
        fill(this.hover_fill);
        stroke(this.hover_stroke);
      } else {
        fill(this.fill);
        noStroke();
      }
    }

    translate(this.x, this.y, this.z);
    ellipsoid(this.r, this.r, 0);
    pop();

    for (const connected_node of this.connected_nodes) {
      line(this.x, this.y, this.z, connected_node.x, connected_node.y, connected_node.z);
    }
  }
}

class DragNet {
  constructor(x, y, nrows, ncols, step) {
    // 2d array would be better, but idk yet
    this.nodes = new Map();
    this.nrows = nrows;
    this.ncols = ncols;


    for (let row = 0; row < nrows; row++) {
      for (let col = 0; col < ncols; col++) {
        const xi = x + step * col - 100;
        const yi = y + step * row - 100;
        const node = new DragNode(xi, yi, 10);

        if (row > 0) {
          const key = (row - 1).toString() + col.toString();
          const connection = this.nodes.get(key);
          node.connected_nodes.push(connection);
        }

        if (col > 0) {
          const key = row.toString() + (col - 1).toString();
          const connection = this.nodes.get(key);
          node.connected_nodes.push(connection);
        }

        const key = row.toString() + col.toString();
        this.nodes.set(key, node);
      }
    }
  }

  draw() {
    for (let row = 0; row < this.nrows; row++) {
      for (let col = 0; col < this.ncols; col++) {
        const key = row.toString() + col.toString();
        const node = this.nodes.get(key);
        node.draw();
      }
    }
  }
}
