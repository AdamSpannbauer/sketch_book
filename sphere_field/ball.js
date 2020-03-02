class Ball {
  constructor(p, min_r, max_r) {
  	this.p = p || this.rand_pos();
  	this.min_r = this.min_r || 0.5;
  	this.max_r = this.max_r || 30;
  	this.r = map(this.p.z, -1, 1, this.min_r, this.max_r);

    this.fill = [
      random(70, 130),
      random(70, 130),
      random(150, 250)
    ]
  }

  rand_pos() {
  	const min_x = -width / 10;
    const max_x = width / 10;
    const min_y = -height / 10;
    const max_y = height / 10;
    const min_z = -1;
    const max_z = -0.8;

  	const pos = createVector(
  	  random(min_x, max_x),
  	  random(min_y, max_y),
  	  random(min_z, max_z),
  	);

  	return pos;
  }

  draw() {
    push();
    fill(this.fill);
    noStroke();
    translate(this.p.x, this.p.y, this.p.z);
    sphere(this.r);
    pop();
  }

  update() {
  	const speed = 5;
  	const dx = -map(-this.p.x, -width / 2, width / 2, -speed, speed);
  	const dy = -map(-this.p.y, -height / 2, height / 2, -speed, speed);
  	const dz = 0.01;

  	const d = createVector(dx, dy, dz)

  	this.p.add(d);
  	this.r = map(this.p.z, -1, 1, this.min_r, this.max_r);
  }

  offscreen() {
  	const buffer = 3;
  	const is_offscreen = (
  		this.p.x - this.r * buffer > width / 2
  		| this.p.x + this.r * buffer < -width / 2
  		| this.p.y - this.r * buffer > height / 2
  		| this.p.y + this.r * buffer < -height / 2
  	);

  	return is_offscreen;
  }
}
