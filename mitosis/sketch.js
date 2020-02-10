let w = 512
let h = 512

let cell
let max_gen = 8


function setup() {
	createCanvas(w, h)
	angleMode(DEGREES)

	cell = new Cell(width / 2, height / 2, 0, 70, 0, 1, null, [180, 180, 30])
}

let alive_count = 0
function draw() {
	background(30, 70, 150)
	cell.draw()

	if (alive_count == 0) {
		cell = new Cell(width / 2, height / 2, 0, 70, 0, 1, null, [180, 180, 30])
	}
	alive_count = 0
}


class Cell {
	constructor(x, y, min_r, max_r, angle, generation, fill1, fill2) {
		this.generation = generation
		this.children = []

		this.growing = true
		this.separated = false
		this.dead = false
		this.migrating = false
		this.growrate = 0.5

		this.x = x
		this.y = y

		this.p1 = createVector(this.x, this.y)
		this.p2 = createVector(this.x, this.y)
		this.p1_delta = 0
		this.p2_delta = 0

		this.r = min_r
		this.min_r = min_r
		this.max_r = max_r
		this.max_sep = max_r * 2

		this.angle = angle

		this.fill1 = fill1 || [random(10, 50), random(120, 180), random(40, 100)]
		this.fill2 = fill2 || [random(10, 50), random(120, 180), random(40, 100)]
	}

	update() {
		if (!this.dead) {
			if (this.growing) {
				this.grow()
			} 

			if (!this.growing & !this.separated) {
				this.split()
			}

			if (!this.growing & this.separated) {
				this.start_next_gen()
			}

			if (this.migrating) {
				this.migrate()
			}
		}
	}

	grow() {
		this.r += this.growrate

		if (this.r >= this.max_r) {
			this.r = this.max_r
			this.growing = false
		} else if (this.r < 0) {
			this.dead = true
		}
	}

	split() {
		let cell_sep = this.p2_delta - this.p1_delta

		if (cell_sep <= this.max_sep) {			
			this.p1_delta -= this.growrate
			this.p2_delta += this.growrate

			let new_x1 = this.x + cos(this.angle) * this.p1_delta
			let new_x2 = this.x + cos(this.angle) * this.p2_delta
			let new_y1 = this.y + sin(this.angle) * this.p1_delta
			let new_y2 = this.y + sin(this.angle) * this.p2_delta

			this.p1 = createVector(new_x1, new_y1)
			this.p2 = createVector(new_x2, new_y2)

			this.r -= this.growrate * 0.3
		} else {
			this.separated = true
			this.growing = true
		}
	}

	start_next_gen() {
		if (this.generation < max_gen) {
			this.dead = true
			
			let c1 = new Cell(this.p1.x, this.p1.y, this.r, this.max_r, this.angle + 90, this.generation + 1, null, this.fill1)
			this.children.push(c1)

			let c2 = new Cell(this.p2.x, this.p2.y, this.r, this.max_r, this.angle + 90, this.generation + 1, null, this.fill2)
			this.children.push(c2)
		} else {
			this.migrating = true
		}
	}

	migrate() {
		let dx1 = width / 2 - this.p1.x
		let dx2 = width / 2 - this.p2.x
		let dy1 = height / 2 - this.p1.y
		let dy2 = height / 2 - this.p2.y

		if (abs(dx1) < 0.5 & abs(dx2) < 0.5 & abs(dy1) < 0.5 & abs(dy2) < 0.5) {
			this.migrating = false
			this.growrate *= -1
			this.growing = true
		} else {
			if (abs(dx1) > 1) {
				dx1 *= 0.05
			}

			if (abs(dx2) > 1) {
				dx2 *= 0.05
			}

			if (abs(dy1) > 1) {
				dy1 *= 0.05
			}

			if (abs(dy2) > 1) {
				dy2 *= 0.05
			}

			this.p1 = createVector(dx1 + this.p1.x, dy1 + this.p1.y)
			this.p2 = createVector(dx2 + this.p2.x, dy2 + this.p2.y)

			this.r -= this.growrate
		}

	}

	draw() {
		if (!this.dead) {
			alive_count++
			this.update()

			push()
			noStroke()
			fill(this.fill1)
			ellipse(this.p1.x, this.p1.y, this.r * 2, this.r * 2)
			fill(this.fill2)
			ellipse(this.p2.x, this.p2.y, this.r * 2, this.r * 2)
			pop()
		} else if (this.children.length > 0) {
			for (let child of this.children) {
				child.draw()
			}
		}
	}
}
