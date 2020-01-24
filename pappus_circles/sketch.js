// https://en.wikipedia.org/wiki/Pappus_chain
// http://mathworld.wolfram.com/PappusChain.html
let w = 640
let h = 480

let rad_perc = 0.5
let delta_rad_perc = 0.001
let min_rad_perc = 0
let max_rad_perc = 1 - min_rad_perc

let mr = h / 2.2
let ur = mr * rad_perc
let vr = mr - ur

let m
let u
let v
let a
let b
let c
let r

let angle = 0
let delta_angle = 0.5


function setup() {
	createCanvas(w, h)
	background(200)
	angleMode(DEGREES)

	translate(w / 2, h / 2)
	strokeWeight(10)
	noFill()

	m = createVector(0, 0)
	u = createVector(m.x - mr + ur, m.y)
	v = createVector(m.x + mr - vr, m.y)

	a = createVector(m.x - mr, m.y)
	b = createVector(m.x + mr, m.y)
}


function draw() {
	clear()
	background(200)
	translate(w / 2, h / 2)
	rotate(angle)

	ur = mr * rad_perc
	vr = mr - ur

	u = createVector(m.x - mr + ur, m.y)
	v = createVector(m.x + mr - vr, m.y)
	c = createVector(a.x + ur * 2, m.y)

	stroke(60, 60, 190)
	fill(80, 80, 210)
	ellipse(m.x, m.y, mr * 2)

	fill(125, 125, 255)
	ellipse(u.x, u.y, ur * 2)

	for (let i = 0; i < 10; i++) {
		pappus_circle(i, (a.x - c.x) / (a.x - b.x))
		push()
		scale(-1, 1)
		pappus_circle(i, (b.x - c.x) / (b.x - a.x))
		pop()
	}

	if (rad_perc >= max_rad_perc | rad_perc <= min_rad_perc) {
		delta_rad_perc *= -1
	}

	rad_perc += delta_rad_perc
	angle += delta_angle
}


function pappus_circle(n, rr) {
	let xn = (rr * (1 + rr)) / (2 * (n**2 * (1 - rr)**2 + rr))
	let yn = (n * rr * (1 - rr)) / (n**2 * (1 - rr)**2 + rr)
	let rn = ((1 - rr) * rr) / (2 * (n**2 * (1 - rr)**2 + rr))

	let xn2 = rr * (7 + rr) / (2 * (4 + 4 * n * (n - 1) * (1 - rr)**2 + rr * (rr - 1)))
	let yn2 = 2 * (2 * n - 1) * rr * (1 - rr) / (4 + 4 * n * (n - 1) * (1 - rr)**2 + rr * (rr - 1))
	let rn2 = rr * (1 - rr) / (2 * (4 + 4 * n * (n - 1) * (1 - rr)**2 + rr * (rr - 1)))


	xn *= mr * 2
	yn *= mr * 2
	rn *= mr * 2

	xn2 *= mr * 2
	yn2 *= mr * 2
	rn2 *= mr * 2

	ellipse(xn - mr, yn, rn * 2)
	push()
	scale(1, -1)
	ellipse(xn - mr, yn, rn * 2)
	pop()

	ellipse(xn2 - mr, yn2, rn2 * 2)
	push()
	scale(1, -1)
	ellipse(xn2 - mr, yn2, rn2 * 2)
	pop()
}
