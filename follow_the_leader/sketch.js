const canvas_w = 512;
const canvas_h = 512;

const fish_c = [180, 110, 60];
const swan_c = [230, 230, 230];

let swan;
const leaders = [];

const fish = [];
const n_fish = 50;


function setup() {
  createCanvas(canvas_w, canvas_h);

  for (let i = 0; i < n_fish; i++) {
    const f = new Follower(5, fish_c);
    fish.push(f);
  }

  swan = new Leader(10, swan_c);
  leaders.push(swan);
}


function draw() {
  background(10, 20, 30);

  for (let i = 0; i < fish.length; i++) {
    const f = fish[i];
    f.draw();

    if (!f.has_leader) {
      f.look_for_leader(leaders);

      if (f.has_leader) {
        leaders.push(f);
      }
    }

    f.update();
  }

  swan.draw();
  swan.update();
}
