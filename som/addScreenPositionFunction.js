// Source: https://github.com/bohnacker/p5js-screenPosition

// Acknowledgement to Thibault Coppex (@tcoppex) for the 3d-modelview-projection-math.
// Had to adjust it a bit maybe because p5js changed the way webgl is handled since 2016.

// See: https://editor.p5js.org/bohnacker/sketches/nUk3bVW7b on how to use it


function addScreenPositionFunction(p5Instance) {
  const p = p5Instance || this;

  // find out which context we're in (2D or WEBGL)
  const R_2D = 0;
  const R_WEBGL = 1;
  const context = getObjectName(p._renderer.drawingContext).search('2D') >= 0 ? R_2D : R_WEBGL;

  // the stack to keep track of matrices when using push and pop
  if (context == R_2D) {
    p._renderer.matrixStack = [new p5.Matrix()];
  }

  // replace all necessary functions to keep track of transformations

  if (p.draw instanceof Function) {
    const drawNative = p.draw;
    p.draw = function (...args) {
      if (context == R_2D) p._renderer.matrixStack = [new p5.Matrix()];
      drawNative.apply(p, args);
    };
  }


  if (p.resetMatrix instanceof Function) {
    const resetMatrixNative = p.resetMatrix;
    p.resetMatrix = function (...args) {
      if (context == R_2D) p._renderer.matrixStack = [new p5.Matrix()];
      resetMatrixNative.apply(p, args);
    };
  }

  if (p.translate instanceof Function) {
    const translateNative = p.translate;
    p.translate = function (...args) {
      if (context == R_2D) last(p._renderer.matrixStack).translate(args);
      translateNative.apply(p, args);
    };
  }

  if (p.rotate instanceof Function) {
    const rotateNative = p.rotate;
    p.rotate = function (...args) {
      if (context == R_2D) {
        const rad = p._toRadians(args[0]);
        last(p._renderer.matrixStack).rotateZ(rad);
      }
      rotateNative.apply(p, args);
    };
  }

  if (p.rotateX instanceof Function) {
    const rotateXNative = p.rotateX;
    p.rotateX = function (...args) {
      if (context == R_2D) {
        const rad = p._toRadians(args[0]);
        last(p._renderer.matrixStack).rotateX(rad);
      }
      rotateXNative.apply(p, args);
    };
  }
  if (p.rotateY instanceof Function) {
    const rotateYNative = p.rotateY;
    p.rotateY = function (...args) {
      if (context == R_2D) {
        const rad = p._toRadians(args[0]);
        last(p._renderer.matrixStack).rotateY(rad);
      }
      rotateYNative.apply(p, args);
    };
  }
  if (p.rotateZ instanceof Function) {
    const rotateZNative = p.rotateZ;
    p.rotateZ = function (...args) {
      if (context == R_2D) {
        const rad = p._toRadians(args[0]);
        last(p._renderer.matrixStack).rotateZ(rad);
      }
      rotateZNative.apply(p, args);
    };
  }

  if (p.scale instanceof Function) {
    const scaleNative = p.scale;
    p.scale = function (...args) {
      if (context == R_2D) {
        const m = last(p._renderer.matrixStack);
        const sx = args[0];
        const sy = args[1] || sx;
        const sz = context == R_2D ? 1 : args[2];
        m.scale([sx, sy, sz]);
      }
      scaleNative.apply(p, args);
    };
  }

  // Help needed: don't know what transformation matrix to use
  // Solved: Matrix multiplication had to be in reversed order.
  // Still, this looks like it could be simplified.

  if (p.shearX instanceof Function) {
    const shearXNative = p.shearX;
    p.shearX = function (...args) {
      if (context == R_2D) {
        const rad = p._toRadians(args[0]);
        const stack = p._renderer.matrixStack;
        const m = last(stack);
        const sm = new p5.Matrix();
        sm.mat4[4] = Math.tan(rad);
        sm.mult(m);
        stack[stack.length - 1] = sm;
      }
      shearXNative.apply(p, args);
    };
  }

  if (p.shearY instanceof Function) {
    const shearYNative = p.shearY;
    p.shearY = function (...args) {
      if (context == R_2D) {
        const rad = p._toRadians(args[0]);
        const stack = p._renderer.matrixStack;
        const m = last(stack);
        const sm = new p5.Matrix();
        sm.mat4[1] = Math.tan(rad);
        sm.mult(m);
        stack[stack.length - 1] = sm;
      }
      shearYNative.apply(p, args);
    };
  }


  if (p.applyMatrix instanceof Function) {
    const applyMatrixNative = p.applyMatrix;
    p.applyMatrix = function (...args) {
      if (context == R_2D) {
        const stack = p._renderer.matrixStack;
        const m = last(stack);
        const sm = new p5.Matrix();
        sm.mat4[0] = args[0];
        sm.mat4[1] = args[1];
        sm.mat4[4] = args[2];
        sm.mat4[5] = args[3];
        sm.mat4[12] = args[4];
        sm.mat4[13] = args[5];
        sm.mult(m);
        stack[stack.length - 1] = sm;
      }
      applyMatrixNative.apply(p, args);
    };
  }


  if (p.push instanceof Function) {
    const pushNative = p.push;
    p.push = function (...args) {
      if (context == R_2D) {
        const m = last(p._renderer.matrixStack);
        p._renderer.matrixStack.push(m.copy());
      }
      pushNative.apply(p, args);
    };
  }
  if (p.pop instanceof Function) {
    const popNative = p.pop;
    p.pop = function (...args) {
      if (context == R_2D) p._renderer.matrixStack.pop();
      popNative.apply(p, args);
    };
  }


  p.screenPosition = function (x, y, z) {
    if (x instanceof p5.Vector) {
      const v = x;
      x = v.x;
      y = v.y;
      z = v.z;
    } else if (x instanceof Array) {
      const rg = x;
      x = rg[0];
      y = rg[1];
      z = rg[2] || 0;
    }
    z = z || 0;

    if (context == R_2D) {
      const m = last(p._renderer.matrixStack);
      // probably not needed:
      // let mInv = (new p5.Matrix()).invert(m);

      const v = p.createVector(x, y, z);
      const vCanvas = multMatrixVector(m, v);
      // console.log(vCanvas);
      return vCanvas;
    }
    const v = p.createVector(x, y, z);

    // Calculate the ModelViewProjection Matrix.
    const mvp = (p._renderer.uMVMatrix.copy()).mult(p._renderer.uPMatrix);

    // Transform the vector to Normalized Device Coordinate.
    const vNDC = multMatrixVector(mvp, v);

    // Transform vector from NDC to Canvas coordinates.
    const vCanvas = p.createVector();
    vCanvas.x = 0.5 * vNDC.x * p.width;
    vCanvas.y = 0.5 * -vNDC.y * p.height;
    vCanvas.z = 0;

    return vCanvas;
  };


  // helper functions ---------------------------

  function last(arr) {
    return arr[arr.length - 1];
  }

  function getObjectName(obj) {
    const funcNameRegex = /function (.{1,})\(/;
    const results = (funcNameRegex).exec((obj).constructor.toString());
    return (results && results.length > 1) ? results[1] : '';
  }


  /* Multiply a 4x4 homogeneous matrix by a Vector4 considered as point
	 * (ie, subject to translation). */
  function multMatrixVector(m, v) {
    if (!(m instanceof p5.Matrix) || !(v instanceof p5.Vector)) {
      print('multMatrixVector : Invalid arguments');
      return;
    }

    const _dest = p.createVector();
    const mat = m.mat4;

    // Multiply in column major order.
    _dest.x = mat[0] * v.x + mat[4] * v.y + mat[8] * v.z + mat[12];
    _dest.y = mat[1] * v.x + mat[5] * v.y + mat[9] * v.z + mat[13];
    _dest.z = mat[2] * v.x + mat[6] * v.y + mat[10] * v.z + mat[14];
    const w = mat[3] * v.x + mat[7] * v.y + mat[11] * v.z + mat[15];

    if (Math.abs(w) > Number.EPSILON) {
      _dest.mult(1.0 / w);
    }

    return _dest;
  }
}
