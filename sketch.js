// ——————————————————————————————
// Global vars for shader + UI
let theShader;
let speedSlider, scaleSlider, color1Picker, color2Picker;

function preload() {
  // Load your GLSL files from /shaders
  theShader = loadShader('shaders/vertex.glsl', 'shaders/fragment.glsl');
}

function setup() {
  // 1) Compute available area below the toolbar
  const toolbarHeight = 80;            // px; must match #toolbar height
  const availH = windowHeight - toolbarHeight;
  const availW = windowWidth;

  // 2) Create a full-bleed WebGL canvas
  createCanvas(availW, availH, WEBGL)
    .parent('canvas-container');
  noStroke();

  // 3) UI controls—positioned absolutely in the toolbar
  speedSlider  = createSlider(0.1, 5, 1, 0.1).position(10, 10);
  scaleSlider  = createSlider(1, 50, 10, 1).position(10, 40);
  color1Picker = createColorPicker('#000000').position(10, 70);
  color2Picker = createColorPicker('#ffffff').position(10, 100);
}

function draw() {
  // Activate custom shader
  shader(theShader);

  // Pass uniforms
  theShader.setUniform('u_time',       millis() / 1000.0);
  theShader.setUniform('u_speed',      speedSlider.value());
  theShader.setUniform('u_noiseScale', scaleSlider.value());
  theShader.setUniform('resolution',   [width, height]);

  // Convert color pickers to vec3
  let c1 = color1Picker.color();
  let c2 = color2Picker.color();
  theShader.setUniform('u_color1', [red(c1)/255, green(c1)/255, blue(c1)/255]);
  theShader.setUniform('u_color2', [red(c2)/255, green(c2)/255, blue(c2)/255]);

  // Draw a full-screen quad
  rect(-width/2, -height/2, width, height);
}

function windowResized() {
  // Resize canvas when window changes
  const toolbarHeight = 80;
  resizeCanvas(windowWidth, windowHeight - toolbarHeight);
}
