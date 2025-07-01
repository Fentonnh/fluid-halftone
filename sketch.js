let theShader, speedSlider, scaleSlider, color1Picker, color2Picker;

function preload() {
  theShader = loadShader(
    'shaders/vertex.glsl',
    'shaders/fragment.glsl'
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  // UI controls
  speedSlider   = createSlider(0.1, 5, 1, 0.1).position(10,10);
  scaleSlider   = createSlider(1, 50, 10, 1).position(10,40);
  color1Picker  = createColorPicker('#000000').position(10,70);
  color2Picker  = createColorPicker('#ffffff').position(10,100);
}

function draw() {
  shader(theShader);
  theShader.setUniform('u_time',     millis() / 1000.0);
  theShader.setUniform('u_speed',    speedSlider.value());
  theShader.setUniform('u_noiseScale', scaleSlider.value());
  theShader.setUniform('resolution', [width, height]);

  let c1 = color1Picker.color(),
      c2 = color2Picker.color();
  theShader.setUniform('u_color1', [red(c1)/255, green(c1)/255, blue(c1)/255]);
  theShader.setUniform('u_color2', [red(c2)/255, green(c2)/255, blue(c2)/255]);

  rect(-width/2, -height/2, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
