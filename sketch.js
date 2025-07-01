let theShader;
let speedSlider, scaleSlider, color1Picker, color2Picker;

function preload() {
  // Load your vertex & fragment shaders
  theShader = loadShader(
    'shaders/vertex.glsl',
    'shaders/fragment.glsl'
  );
}

function setup() {
  // Create a full-window WebGL canvas
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // UI: tweak speed, texture scale, and endpoint colors
  speedSlider  = createSlider(0.1, 5, 1, 0.1).position(10, 10);
  scaleSlider  = createSlider(1, 50, 10, 1).position(10, 40);
  color1Picker = createColorPicker('#000000').position(10, 70);
  color2Picker = createColorPicker('#ffffff').position(10, 100);
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
  rect(-width/2, -height/2, width, height);
}

function windowResized() {
  // Keep canvas responsive
  resizeCanvas(windowWidth, windowHeight);
}
