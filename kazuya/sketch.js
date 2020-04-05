const canvas_w = 512;
const canvas_h = 512;

const streakers = [];

function setup() {
  createCanvas(canvas_w, canvas_h);
  background(30, 30, 70);

  streakers.push(new Streaker());
}


function draw() {
	for (let streaker of streakers) {
		streaker.draw();
  	streaker.update();
	}
}


function mousePressed() {
	streakers.push(new Streaker());
}


function rand_wall() {
  const i = floor(random(4));

  switch (i) {
    case 0:
      x = 0;
      y = random();
      break;
    case 1:
      x = random();
      y = 0;
      break;
    case 2:
      x = 1;
      y = random();
      break;
    default:
      x = random();
      y = 1;
      break;
  }

  return createVector(x, y);
}


class Streaker {
  constructor() {
    this.p = rand_wall();

   	this.v = createVector();
   	if (this.p.x == 0) {
   		this.p.y = map(this.p.y, 0, 1, height * 0.1, height * 0.9);
   		this.v.set(1, 0);
   	} else if (this.p.y == 0) {
   		this.p.x = map(this.p.x, 0, 1, width * 0.1, width * 0.9);
   		this.v.set(0, 1);
   	} else if (this.p.x == 1) {
   		this.p.y = map(this.p.y, 0, 1, height * 0.1, height * 0.9);
   		this.p.x *= width;
   		this.v.set(-1, 0);
   	} else if (this.p.y == 1) {
   		this.p.x = map(this.p.x, 0, 1, width * 0.1, width * 0.9);
   		this.p.y *= height;
   		this.v.set(0, -1);
   	}


   	this.r = 10;
  	this.circle_route_r = 50;
  	this.circle_route_c = createVector();
  	this.circle_route_a = null;
  	this.circle_route_da = 0.02;
  	this.circle_route_cum_a = 0;
  	this.is_circling = false;
  }

  start_circle() {
  	// holy shit this got bad
  	if (this.v.x != 0) {
  		if (this.p.y > height / 2) {
  			if (this.v.x > 0) {
	  			// Bottom left -> right *
	  			this.circle_route_a = this.v.heading() - PI;
	  			this.circle_route_da = 0.02;
	  		} else {
	  			// Bottom right -> left *
	  			this.circle_route_a = this.v.heading();
	  			this.circle_route_da = -0.02;
	  		}
  			this.circle_route_c.set(
  				this.p.x,
  				this.p.y - this.circle_route_r,
  			);
  		} else {
  			if (this.v.x > 0) {
	  			// Top left -> right *
	  			this.circle_route_a = this.v.heading();
	  			this.circle_route_da = -0.02;
	  		} else {
	  			// Top right -> left *
	  			this.circle_route_a = this.v.heading() - PI;
	  			this.circle_route_da = 0.02;
	  		}
  			this.circle_route_c.set(
  				this.p.x,
  				this.p.y + this.circle_route_r,
  			);
  		}
  	} else if (this.p.x > width / 2) {
  		if (this.v.y > 0) {
  			// Right hand side top -> bottom *
  			this.circle_route_a = this.v.heading() - PI;
  			this.circle_route_da = -0.02;
  		} else {
  			// Right hand side bottom -> top *
  			this.circle_route_a = this.v.heading();
  			this.circle_route_da = 0.02;
  		}
  			this.circle_route_c.set(
  				this.p.x - this.circle_route_r,
  				this.p.y,
  			);
  		} else {
  			if (this.v.y > 0) {
  				// Left hand side top -> bottom *
	  			this.circle_route_a = this.v.heading();
	  			this.circle_route_da = 0.02;
	  		} else {
	  			// Left hand side bottom -> top *
	  			this.circle_route_a = this.v.heading() - PI;
	  			this.circle_route_da = -0.02;
	  		}
  			this.circle_route_c.set(
  				this.p.x + this.circle_route_r,
  				this.p.y,
  			);
  		}

  	this.circle_route_cum_a = 0;
  	this.is_circling = true;
  }

  circle_route() {
  	if (!this.is_circling) {
  		const buffer = width / 3;
  		const d = dist(this.p.x, this.p.y, width / 2, height / 2);

  		if (d < buffer && random() > 0.99) {
  			this.start_circle();
  		}
  	} else {
  		this.p.set(
        this.circle_route_c.x - sin(this.circle_route_a) * this.circle_route_r,
  			this.circle_route_c.y - cos(this.circle_route_a) * this.circle_route_r,
  		);

  		this.circle_route_a += this.circle_route_da;
  		this.circle_route_cum_a += abs(this.circle_route_da);
  		if (this.circle_route_cum_a > PI / 3) {
  			if (this.circle_route_cum_a % (PI / 2) < 0.1 && random() > 0.75) {
  				this.is_circling = false;
  				
  				this.v.set(
  					round(cos(this.circle_route_a)) * this.circle_route_da / abs(this.circle_route_da), 
  					round(sin(this.circle_route_a)) * this.circle_route_da / abs(this.circle_route_da), 
  				)
  			}
  		}
  	}
  }

  update() {
  	if (!this.circling) {
  		this.p.add(this.v);
  	}

  	this.circle_route();
  }

  draw() {
  	push();
  	noStroke();
  	ellipse(this.p.x, this.p.y, this.r * 2, this.r * 2);
  	pop();
  }
}
