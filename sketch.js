let theShader;
let speedSlider, scaleSlider, color1Picker, color2Picker;

function calcCanvasSize() {
  let h = windowHeight - 80; // leave space for toolbar
  let w = h * 9 / 16;
  if (w > windowWidth) {
    w = windowWidth - 40;
    h = w * 16 / 9;
  }
  return { w, h };
}

function preload() {
  // Load your vertex & fragment shaders
  theShader = loadShader(
    'shaders/vertex.glsl',
    'shaders/fragment.glsl'
  );
}

function setup() {
  const { w, h } = calcCanvasSize();
  createCanvas(w, h, WEBGL).parent('canvas-container');
  noStroke();

  speedSlider  = createSlider(0.1, 5, 1, 0.1).parent('speedContainer');
  speedSlider.id('speedSlider');
  scaleSlider  = createSlider(1, 50, 10, 1).parent('scaleContainer');
  scaleSlider.id('scaleSlider');
  color1Picker = createColorPicker('#000000').parent('color1Container');
  color1Picker.id('color1Picker');
  color2Picker = createColorPicker('#ffffff').parent('color2Container');
  color2Picker.id('color2Picker');
}

function draw() {
  // Activate our shader
  shader(theShader);

  // Pass time & controls as uniforms
  theShader.setUniform('u_time',      millis() / 1000.0);
  theShader.setUniform('u_speed',     speedSlider.value());
  theShader.setUniform('u_noiseScale', scaleSlider.value());
  theShader.setUniform('resolution',  [width, height]);

  // Convert p5 Color → normalized vec3
  let c1 = color1Picker.color();
  let c2 = color2Picker.color();
  theShader.setUniform('u_color1', [red(c1)/255, green(c1)/255, blue(c1)/255]);
  theShader.setUniform('u_color2', [red(c2)/255, green(c2)/255, blue(c2)/255]);

  // Draw a rectangle covering the viewport
  rect(-1, -1, 2, 2);
}

function windowResized() {
  const { w, h } = calcCanvasSize();
  resizeCanvas(w, h);
}
