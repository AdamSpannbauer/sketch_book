const canvas_w = 512;
const canvas_h = 512;

const colors = [
  // [93, 188, 210], // blue
  [220, 147, 103], // orange
  [220, 147, 103], // orange
  [220, 147, 103], // orange
  // [54, 44, 61], // purple
  // [10, 10, 10],
  // [230, 230, 230],
  // [230, 230, 230],
  // [230, 230, 230],
  // [230, 230, 230],
  [20, 20, 20],  
];

const ball_groups = [];
const n_groups = 4;
let generation = 0;
const n_generations = 6;

const buffer = 100;
let cp;

function gen_group_circle() {
  const binary_colors = shuffle(colors).slice(0, 2);
  const angle_adjust = PI * generation % 2;
  const angle_width_adjust = map(generation, 0, n_generations, PI / 4, PI / 4);
  const len = map(generation, 0, n_generations, 100, 50);

  const r = map(generation, 0, n_generations, 230, 0);
  const alpha = map(generation, 0, n_generations, 2, 200);
  const color_adjust = map(generation, 0, n_generations, 50, 0);

  for (let i = 0; i < n_groups; i++) {
    let c = binary_colors[i % 2];
    c = c.map((x) => x + color_adjust);
    c.push(alpha);

    const start_a = i * TWO_PI / 4 - angle_width_adjust + angle_adjust;
    const stop_a = (i + 1) * TWO_PI / 4 + angle_width_adjust + angle_adjust;
    const a = (start_a + stop_a) / 2;

    const cp_i = createVector(
      cos(a) * r + cp.x,
      sin(a) * r + cp.y,
    );

    const ball_group = new BallGroup(cp_i, start_a, stop_a, c, len);
    ball_groups.push(ball_group);
  }
}


function setup() {
  createCanvas(canvas_w, canvas_h);

  cp = createVector(
  	constrain(random(width), buffer, width - buffer),
  	constrain(random(height), buffer, height - buffer),
  );

  gen_group_circle();

  background(150);
}


function draw() {
  let n_processing = 0;
  for (const ball_group of ball_groups) {
    ball_group.update();
  	ball_group.draw();
    n_processing += !ball_group.done;
  }

  if (n_processing == 0 && generation < n_generations) {
    generation++;
    gen_group_circle();
  }
}
