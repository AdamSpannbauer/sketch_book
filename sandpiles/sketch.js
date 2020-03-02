const canvas_w = 512;
const canvas_h = 512;

const sandpiles = [];
const max_pile = 3;

const pre_steps = 1;
const step_size = 10;

let min_x = canvas_w / 2;
let min_y = canvas_h / 2;
let max_x = canvas_w / 2;
let max_y = canvas_h / 2;

function setup() {
  createCanvas(canvas_w, canvas_h);
  pixelDensity(1);

  const border = 100;
  for (let x = 0; x < width; x++) {
  	sandpiles[x] = [];
    for (let y = 0; y < height; y++) {
      sandpiles[x][y] = 0;

      if (x > border & y > border
      	& x < width - border & y < height -border
      	& x % 2 == 0 & y % 4 == 0) {
      	sandpiles[x][y] = 32;
      }

      if (x == width / 2 & y == height / 2) {
        sandpiles[x][y] += 32;
      }
    }
  }

  for (let i = 0; i < pre_steps; i++) {
  	step();
  }
}


function draw() {
  step();
}


function step() {
  for (let i = 0; i < step_size; i++) {
    update();
  }

  const w = max_x - min_x;
  const h = max_y - min_y;
  const im = get(min_x, min_y, w, h);
  image(im, 0, 0, width, height);
}


function update() {
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
    	const index = (x + y * width) * 4;
    	const v = sandpiles[x][y];
    	let r;
    	let g;
    	let b;

    	 if (v == 0) {
    		r = 74;
	    	g = 13;
	    	b = 103;
    	} else {
    		if (x < min_x) min_x = x;
    		if (y < min_y) min_y = y;
    		if (x > max_x) max_x = x;
    		if (y > max_y) max_y = y;

    		if (v > max_pile) {
	    		r = 71;
	    		g = 49;
	    		b = 152;
	    	} else if (v == max_pile) {
	    		r = 218;
	    		g = 255;
	    		b = 237;
	    	} else if (v == max_pile - 1) {
	    		r = 155;
	    		g = 243;
	    		b = 240;
	    	} else if (v == max_pile - 2) {
	    		r = 173;
	    		g = 252;
	    		b = 146;
	    	}
    	}


      pixels[index + 0] = r;
      pixels[index + 1] = g;
      pixels[index + 2] = b;
      pixels[index + 3] = 255;

      if (v > max_pile) {
      	sandpiles[x][y] -= max_pile + 1;

      	if (x > 0) {
      		sandpiles[x - 1][y] += 1;
      	}
      	if (x < width - 1) {
      		sandpiles[x + 1][y] += 1;
      	}
      	if (y > 0) {
      		sandpiles[x][y - 1] += 1;
      	}
      	if (y < height - 1) {
      		sandpiles[x][y + 1] += 1;
      	}
      }
    }
  }
  updatePixels();
}
