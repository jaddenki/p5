// P_2_2_3_01
//
// Generative Gestaltung – Creative Coding im Web
// ISBN: 978-3-87439-902-9, First Edition, Hermann Schmidt, Mainz, 2018
// Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni
// with contributions by Joey Lee and Niels Poldervaart
// Copyright 2018
//
// http://www.generative-gestaltung.de
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
  * changing curve vertices with noise
  * edited by jadden picardal :3
*/
var formResolution = 15;
var stepSize = 2;
var distortionFactor = 1;
var initRadius = 150;
var centerX;
var centerY;
var x = [];
var y = [];
var angles = [];
var speeds = []; 
var colors = []; 
var filled = false;
var freeze = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255, 255, 255, 1);

  // init shape
  centerX = width / 2;
  centerY = height / 2;
  var angle = radians(360 / formResolution);
  
  x = [];
  y = [];
  angles = [];
  speeds = [];
  colors = [];
  
  for (var i = 0; i < formResolution; i++) {
    x.push(cos(angle * i) * initRadius);
    y.push(sin(angle * i) * initRadius);
    angles.push(random(TWO_PI)); 
    speeds.push(random(0.5, 2)); 
    colors.push(random(255)); 
  }

  strokeWeight(0.75);
  background(255);
}

function draw() {
  // floating towards mouse position with random offset
  centerX += (mouseX - centerX) * random(0.005, 0.02);
  centerY += (mouseY - centerY) * random(0.005, 0.02);

  // calculate new points
  for (var i = 0; i < formResolution; i++) {
    // Update movement angles
    angles[i] += random(-0.1, 0.1);
    
    // Move points based on their individual angles and speeds
    x[i] += cos(angles[i]) * speeds[i] * stepSize;
    y[i] += sin(angles[i]) * speeds[i] * stepSize;
    
    // Add some boundary constraints to keep shape somewhat contained
    var dist = sqrt(x[i] * x[i] + y[i] * y[i]);
    if (dist > initRadius * 2) {
      x[i] *= 0.95;
      y[i] *= 0.95;
    }
  }

  if (filled) {
    let c = color(random(255), 200, 255, 0.1);
    fill(c);
  } else {
    stroke(0, 50);
    noFill();
  }

  // Draw the shape
  beginShape();
  curveVertex(x[formResolution - 1] + centerX, y[formResolution - 1] + centerY);
  for (var i = 0; i < formResolution; i++) {
    if (!filled) {
      stroke(colors[i], 200, 255, 0.2); 
    }
    curveVertex(x[i] + centerX, y[i] + centerY);
  }
  curveVertex(x[0] + centerX, y[0] + centerY);
  curveVertex(x[1] + centerX, y[1] + centerY);
  endShape();
}

function mousePressed() {
  // init shape on mouse position
  centerX = mouseX;
  centerY = mouseY;
  var angle = radians(360 / formResolution);
  var radius = initRadius * random(0.5, 1);
  for (var i = 0; i < formResolution; i++) {
    x[i] = cos(angle * i) * initRadius;
    y[i] = sin(angle * i) * initRadius;
    // Add new random colors for each point
    colors[i] = random(255);
    // Reset speeds and angles for more variation
    speeds[i] = random(0.5, 2);
    angles[i] = random(TWO_PI);
  }
}

function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
  if (keyCode == DELETE || keyCode == BACKSPACE) background(255);
  if (key == '1') filled = false;
  if (key == '2') filled = true;

  if (key == 'f' || key == 'F') freeze = !freeze;
  if (freeze) {
    noLoop();
  } else {
    loop();
  }
}
