const w = 640;
const h = 480;

let umbrella_img;
let cloud_img;
const animal_imgs = [];
const animal_assets = ['assets/animals/red_dog1.png',
  'assets/animals/red_dog2.png',
  'assets/animals/red_dog3.png',
  'assets/animals/red_cat1.png',
  'assets/animals/red_cat2.png',
  'assets/animals/green_dog1.png',
  'assets/animals/green_dog2.png',
  'assets/animals/green_dog3.png',
  'assets/animals/green_cat1.png',
  'assets/animals/green_cat2.png',
  'assets/animals/blue_dog1.png',
  'assets/animals/blue_dog2.png',
  'assets/animals/blue_dog3.png',
  'assets/animals/blue_cat1.png',
  'assets/animals/blue_cat2.png',
  'assets/deck.png'];

const animals = [];
const animal_min_width = 10;
const animal_max_width = 100;

const bclouds = [];
const bcloud_min_width = 50;
const bcloud_max_width = 100;

const fclouds = [];
const fcloud_min_width = 100;
const fcloud_max_width = 200;

let wind = 0;

function preload() {
  umbrella_img = loadImage('assets/umbrella.png');
  cloud_img = loadImage('assets/cloud.png');
  deck_img = loadImage('assets/deck.png');
  for (const animal_asset of animal_assets) {
    animal_imgs.push(loadImage(animal_asset));
  }
}


function setup() {
  createCanvas(w, h);
  imageMode(CENTER);
  angleMode(DEGREES);

  for (let i = 0; i < 100; i++) {
    animals.push(new AnimalRain());
  }

  for (let i = 0; i < 30; i++) {
    const c = new Cloud(random(0.1, 0.5), bcloud_min_width, bcloud_max_width);
    bclouds.push(c);
  }

  for (let i = 0; i < 4; i++) {
    const c = new Cloud(random(0.3, 1.5), fcloud_min_width, fcloud_max_width);
    fclouds.push(c);
  }
}


function draw() {
  clear();
  background(0);

  for (const cloud of bclouds) {
    cloud.draw();
    cloud.update();
  }

  for (const animal of animals) {
    if (animal.z < 0.5) {
      animal.draw();
      animal.ax = wind;
      animal.update();
    }
  }

  image(umbrella_img, w / 2, h - 100, 250, resize_height(umbrella_img, 250));

  for (const animal of animals) {
    if (animal.z >= 0.5) {
      animal.draw();
      animal.ax = wind;
      animal.update();
    }
  }

  for (const cloud of fclouds) {
    cloud.draw();
    cloud.update();
  }

  if (random() > 0.9) {
    wind = random(0, 0.1);
  }
}


function random_choice(x) {
  choice = x[floor(random() * x.length)];
  return (choice);
}


function resize_height(img, resize_width) {
  const im_w = img.width;
  const im_h = img.height;
  const resize_h = im_h / im_w * resize_width;

  return (resize_h);
}


class AnimalRain {
  constructor() {
    this.reset();
  }

  reset() {
    this.img = random_choice(animal_imgs);
    this.x = map(random(), 0, 1, -200, w);
    this.y = -map(random(), 0, 1, 100, 300);
    this.z = random();

    this.angle = random() * 360;

    this.w = map(this.z, 0, 1, animal_min_width, animal_max_width);
    this.h = resize_height(this.img, this.w);

    this.vx = 0;
    this.vy = 0.3;
    this.ax = 0;
    this.ay = 0.1;
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    image(this.img, 0, 0, this.w, this.h);
    pop();
  }

  update() {
    if (this.y > -100) {
      this.vx += this.ax;
      this.vy += this.ay;
    }

    this.y += this.vy;
    this.x += this.vx;

    if (this.y > h + 100) {
      this.reset();
    }
  }
}


class Cloud {
  constructor(vx, min_width, max_width) {
    this.vx = vx;
    this.min_width = min_width;
    this.max_width = max_width;

    this.reset();

    this.x = map(random(), 0, 1, -50, w);
  }

  reset() {
    this.img = cloud_img;
    this.x = map(random(), 0, 1, -100, -500);
    this.y = map(random(), 0, 1, -50, 200);
    this.z = random();

    this.w = map(this.z, 0, 1, this.min_width, this.max_width);
    this.h = resize_height(this.img, this.w);
  }

  draw() {
    image(this.img, this.x, this.y, this.w, this.h);
  }

  update() {
    this.x += this.vx;

    if (this.x > w + this.w / 2) {
      this.reset();
    }
  }
}
