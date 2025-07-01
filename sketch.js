// ——————————————————————————————
// Global vars + constants
let theShader;
let speedSlider, scaleSlider, color1Picker, color2Picker;

// Must match #toolbar height in index.html:
const TOOLBAR_HEIGHT = 80;

// Desired letterbox aspect ratio:
const ASPECT_RATIO = 16 / 9;

function preload() {
  // Load your GLSL shaders
  theShader = loadShader('shaders/vertex.glsl', 'shaders/fragment.glsl');
}

function setup() {
  // Compute the largest 16:9 canvas that fits under the toolbar
  let availW = windowWidth;
  let availH = windowHeight - TOOLBAR_HEIGHT;
  let availAR = availW / availH;
  let canvasW, canvasH;

  if (availAR > ASPECT_RATIO) {
    // window is too wide → full height, letterbox sides
    canvasH = availH;
    canvasW = canvasH * ASPECT_RATIO;
  } else {
    // window is too tall → full width, letterbox top/bottom
    canvasW = availW;
    canvasH = canvasW / ASPECT_RATIO;
  }

  // Create & center the WebGL canvas
  createCanvas(canvasW, canvasH, WEBGL)
    .parent('canvas-container');
  noStroke();

  // Build UI inside the toolbar
  speedSlider  = createSlider(0.1, 5, 1, 0.1).position(10, 10);
  scaleSlider  = createSlider(1, 50, 10, 1).position(10, 40);
  color1Picker = createColorPicker('#000000').position(10, 70);
  color2Picker = createColorPicker('#ffffff').position(10, 100);
}

function draw() {
  shader(theShader);

  // Send uniforms
  theShader.setUniform('u_time',       millis() / 1000.0);
  theShader.setUniform('u_speed',      speedSlider.value());
  theShader.setUniform('u_noiseScale', scaleSlider.value());
  theShader.setUniform('resolution',   [width, height]);

  // Colors
  let c1 = color1Picker.color();
  let c2 = color2Picker.color();
  theShader.setUniform('u_color1', [red(c1)/255, green(c1)/255, blue(c1)/255]);
  theShader.setUniform('u_color2', [red(c2)/255, green(c2)/255, blue(c2)/255]);

  // Draw full-screen quad
  rect(-width/2, -height/2, width, height);
}

function windowResized() {
  // Recompute letterboxed size on resize
  let availW = windowWidth;
  let availH = windowHeight - TOOLBAR_HEIGHT;
  let availAR = availW / availH;
  let canvasW, canvasH;

  if (availAR > ASPECT_RATIO) {
    canvasH = availH;
    canvasW = canvasH * ASPECT_RATIO;
  } else {
    canvasW = availW;
    canvasH = canvasW / ASPECT_RATIO;
  }

  resizeCanvas(canvasW, canvasH);
}
