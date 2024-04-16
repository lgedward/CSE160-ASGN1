// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = 'attribute vec4 a_Position; uniform float u_Size; void main() {gl_Position = a_Position; gl_PointSize = u_Size;}'

// Fragment shader program
var FSHADER_SOURCE = 'precision mediump float; uniform vec4 u_FragColor; void main() {gl_FragColor = u_FragColor;}'

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  // gl = getWebGLContext(canvas);
    if (!gl) {
     console.log('Failed to get the rendering context for WebGL');
     return;
   }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if(!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}

function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function renderAllShapes(){
  var startTime = performance.now();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {

    g_shapesList[i].render();
  }

  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize=5;
let g_selectedType=POINT;

function addActionsForHtmlUI(){
  document.getElementById('green').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
  document.getElementById('red').onclick = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
  document.getElementById('clearButton').onclick = function() {g_shapesList=[]; renderAllShapes();};

  document.getElementById('pointButton').onclick = function() {g_selectedType=POINT};
  document.getElementById('triButton').onclick = function() {g_selectedType=TRIANGLE};
  document.getElementById('circleButton').onclick = function() {g_selectedType=CIRCLE};

  document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
  document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
  document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; });

  document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; });

  document.getElementById('drawTrianglesButton').onclick = drawPredefinedTriangles;

  document.getElementById('alphaSlide').addEventListener('mouseup', function() {g_selectedColor[3] = this.value / 100;});
}

function createTriangle(x1, y1, x2, y2, x3, y3, color) {
  return {
      position: [x1, y1, x2, y2, x3, y3],
      color: color
  };
}

var predefinedTriangles = []

predefinedTriangles.push(createTriangle(-0.5, -0.3, -0.2, 0.4, 0.1, -0.3, [0.42, 0.26, 0.15, 1.0]));
predefinedTriangles.push(createTriangle(-0.2, -0.3, -0.2, 0.4, 0.5, -0.3, [0.42, 0.26, 0.15, 1.0]));

predefinedTriangles.push(createTriangle(0.0, -0.3, 0.3, 0.5, 0.6, -0.3, [0.36, 0.25, 0.20, 1.0]));
predefinedTriangles.push(createTriangle(0.3, -0.3, 0.3, 0.5, 0.8, -0.3, [0.36, 0.25, 0.20, 1.0]));

const sunCenterX = 0.0;
const sunCenterY = 0.7;
const sunRadius = 0.2;
const sunColor = [1.0, 0.9, 0.0, 1.0];

for (let i = 0; i < 8; i++) {
    let angle = i * (Math.PI / 4);
    predefinedTriangles.push(createTriangle(
        sunCenterX + sunRadius * Math.cos(angle),
        sunCenterY + sunRadius * Math.sin(angle),
        sunCenterX + sunRadius * Math.cos(angle + Math.PI / 4),
        sunCenterY + sunRadius * Math.sin(angle + Math.PI / 4),
        sunCenterX,
        sunCenterY,
        sunColor
    ));
}

predefinedTriangles.push(createTriangle(-1.0, -0.3, 1.0, -0.3, -1.0, -1.0, [0.0, 0.5, 0.0, 1.0]));
predefinedTriangles.push(createTriangle(1.0, -0.3, 1.0, -1.0, -1.0, -1.0, [0.0, 0.5, 0.0, 1.0]));

predefinedTriangles.push(createTriangle(-0.45, 0.1, -0.35, 0.3, -0.25, 0.1, [1.0, 1.0, 1.0, 1.0]));
predefinedTriangles.push(createTriangle(-0.15, 0.1, -0.05, 0.3, 0.05, 0.1, [1.0, 1.0, 1.0, 1.0]));

predefinedTriangles.push(createTriangle(0.15, 0.2, 0.25, 0.4, 0.35, 0.2, [1.0, 1.0, 1.0, 1.0]));
predefinedTriangles.push(createTriangle(0.45, 0.2, 0.55, 0.4, 0.65, 0.2, [1.0, 1.0, 1.0, 1.0]));

predefinedTriangles.push(createTriangle(-0.1, 0.6, 0.0, 0.65, 0.1, 0.6, [0.0, 0.0, 0.0, 1.0]));
predefinedTriangles.push(createTriangle(0.0, 0.5, 0.1, 0.55, 0.2, 0.5, [0.0, 0.0, 0.0, 1.0]));

predefinedTriangles.push(createTriangle(-0.3, -0.8, 0.0, -0.3, 0.3, -0.8, [0.0, 0.5, 1.0, 1.0]));
predefinedTriangles.push(createTriangle(-0.3, -0.8, 0.3, -0.8, 0.0, -1.0, [0.0, 0.5, 1.0, 1.0]));

predefinedTriangles.push(createTriangle(-0.8, -0.3, -0.7, -0.1, -0.6, -0.3, [0.0, 0.6, 0.0, 1.0]));
predefinedTriangles.push(createTriangle(-0.6, -0.3, -0.5, 0.0, -0.4, -0.3, [0.0, 0.7, 0.0, 1.0]));
predefinedTriangles.push(createTriangle(-0.9, -0.6, -0.8, -0.4, -0.7, -0.6, [0.0, 0.8, 0.0, 1.0]));

predefinedTriangles.push(createTriangle(0.2, -0.7, 0.3, -0.6, 0.4, -0.7, [0.5, 0.5, 0.5, 1.0]));

function drawPredefinedTriangles() {
  predefinedTriangles.forEach(tri => {
      let triangle = new Triangle();
      triangle.position = tri.position;
      triangle.color = tri.color;
      triangle.size = g_selectedSize;
      g_shapesList.push(triangle);
  });
  renderAllShapes();
}

function main() {

  setupWebGL();
  connectVariablesToGLSL();

  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) }};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];

function click(ev) {
  let [x,y] = convertCoordinatesEventToGL(ev);

  

  let point;
  if(g_selectedType==POINT){
    point = new Point();
  } else if(g_selectedType==TRIANGLE){
    point = new Triangle();
  } else {
    point = new Circle();
  }
  point.position=[x,y];
  point.color=g_selectedColor.slice();
  point.size=g_selectedSize;
  g_shapesList.push(point);

  // Store the coordinates to g_points array
  // g_points.push([x, y]);

  // g_colors.push(g_selectedColor.slice());

  // g_sizes.push(g_selectedSize);

  // g_colors.push(g_selectedColor.slice());
  // g_colors.push([g_selectedColor[0], g_selectedColor[1], g_selectedColor[2], g_selectedColor[3]]);

  // Store the coordinates to g_points array
  // if (x >= 0.0 && y >= 0.0) {      // First quadrant
  //   g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  // } else if (x < 0.0 && y < 0.0) { // Third quadrant
  //   g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  // } else {                         // Others
  //   g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  // }

  renderAllShapes();
}
