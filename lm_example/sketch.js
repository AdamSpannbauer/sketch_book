const canvas_w = 512;
const canvas_h = 512;

const pts = [];

let slope = 1;
let intercept = 0;

function setup() {
  createCanvas(canvas_w, canvas_h);
  background(10);

  translate(width / 2, height / 2);
  stroke(200, 50);
  strokeWeight(2);

  line(0, -height, 0, height);
  line(-width, 0, width, 0);
}


function draw() {
  translate(width / 2, height / 2);

  fill(30, 150, 40);
  noStroke();

  for (pt of pts) {
    ellipse(pt.x, pt.y, 5, 5);
  }

  if (pts.length >= 2) {
  	regression();

  	print(slope)
  	print(intercept)

  	const x1 = -width / 2;
  	const x2 = width / 2;
  	const y1 = slope * x1 + intercept;
  	const y2 = slope * x2 + intercept;

  	stroke(200)
  	line(x1, y1, x2, y2);
  }
}


function mousePressed() {
  const p = createVector(mouseX - width / 2, mouseY - width / 2);
  pts.push(p);
}


function regression() {
  const learning_rate = 0.01;

  for (let i = 0; i < pts.length; i++) {
  	const p = pts[i];
  	const pred = intercept + p.x * slope;
  	const resid = p.y - pred;

  	slope += resid * p.x * learning_rate;
  	intercept += resid * learning_rate;
  }
}


// # noinspection PyPep8Naming
// def linear_regression_sgd(X, y, learning_rate=0.01, max_iter=100):
//     # Convert 1d arrays to 2d w/ one column
//     if X.ndim == 1:
//         X = X.reshape((-1, 1))

//     slopes = np.ones(X.shape[1])
//     intercept = 0
//     history = []

//     meta = {'sse': 1000, 'intercept': intercept, 'slopes': slopes.copy()}
//     history.append(meta)
//     for i in range(max_iter):
//         sse = 0.0
//         for xi, yi in zip(X, y):
//             guess = intercept + np.sum(slopes * xi)
//             error = yi - guess
//             sse += error ** 2

//             slopes += error * xi * learning_rate
//             intercept += error * learning_rate

//         meta = {'sse': sse, 'intercept': intercept, 'slopes': slopes.copy()}
//         history.append(meta)

//     history = pd.DataFrame(history)
//     slope_cols = pd.DataFrame(history['slopes'].values.tolist())
//     history = history.drop(columns='slopes')
//     slope_cols.columns = [f'x{i}' for i in range(slope_cols.shape[1])]
//     history = pd.concat([history, slope_cols], axis=1)

//     return slopes, intercept, history
