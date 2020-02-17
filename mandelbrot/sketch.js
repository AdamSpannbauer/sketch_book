const canvas_w = 512;
const canvas_h = 512;

const cx = -0.9;
const cy = 1;

let minvx = cx - 1;
let maxvx = cx + 1;
let minvy = cy - 1;
let maxvy = cy + 1;

let cx_scaled;
let cy_scaled;


function setup() {
  createCanvas(canvas_w, canvas_h);
  pixelDensity(1);
}


let t = 0;
const max_t = 10;
function draw() {
  background(30);
  mandelbrot_pixels(minvx, maxvx, minvy, maxvy, 100, 8);

  fill(255, 0, 0);
  cx_scaled = map(cx, minvx, maxvx, 0, canvas_w);
  cy_scaled = map(cy, minvy, maxvy, 0, canvas_h);
  ellipse(cx_scaled, cy_scaled, 10);

  if (t < max_t) {
  	minvx *= 0.75;
	  maxvx *= 0.85;
	  minvy *= 0.75;
	  maxvy *= 0.85;
  }
  t++;
}


function mandelbrot(real, imag, max_iter, thresh) {
  max_iter = max_iter || 64;
  thresh = thresh || 8;

  const real_c = real;
  const imag_c = imag;
  let i;

  for (i = 0; i < max_iter; i++) {
    const new_real = (real ** 2 - imag ** 2) + real_c;
    const new_imag = (2 * real * imag) + imag_c;

    real = new_real + real_c;
    imag = new_imag + imag_c;

    if (real ** 2 + imag ** 2 > thresh) {
      break;
    }
  }

  return i;
}


function mandelbrot_pixels(minvx, maxvx, minvy, maxvy, max_iter, thresh) {
  max_iter = max_iter || 64;
  thresh = thresh || 8;

  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const real = map(x, 0, width, minvx, maxvx);
      const imag = map(y, 0, height, minvy, maxvy);
      const p_index = (x + y * width) * 4;

      const n_iter = mandelbrot(real, imag, max_iter, thresh);
      let brightness = map(n_iter, 0, max_iter, 0, 255);

      if (n_iter == max_iter) {
      	brightness = 0;
      }

      pixels[p_index + 0] = brightness;
      pixels[p_index + 1] = brightness;
      pixels[p_index + 2] = brightness;
      pixels[p_index + 3] = 255;
    }
  }
  updatePixels();
}
