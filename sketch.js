var birds = [];
var b_amt = 500;

var quad_tree;
var boundary;
var capacity = 10;

var bg = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas');
  boundary = new Rect(width/2, height/2, width/2, height/2);
  quad_tree = new PointQuadTree(boundary, capacity);

  for (var i = 0; i < b_amt; i++) {
    birds.push(new Boid(random(width), random(height)));
  }
}

function draw() {
  background(bg);
  quad_tree.clear();
  for (var i = 0; i < b_amt; i++) {
    let p = new Point(birds[i].position.x, birds[i].position.y, birds[i]);
    quad_tree.insert(p);
  }
    
  for (var i = 0; i < b_amt; i++) {
    let range = new Circle(birds[i].position.x, birds[i].position.y, birds[i].perceptionRadius);
    let neighbors = [];
    quad_tree.query(range, birds);
    birds[i].flock(birds);
    birds[i].update();
    birds[i].display();
  }
  quad_tree.display();
}

function switchQuadTree(type) {
  if (type === 'point') {
    bg = 255;
    quad_tree = new PointQuadTree(boundary, capacity);
  } else if (type === 'matrix') {
    bg = 0;
    quad_tree = new MatrixQuadTree(boundary, capacity);
  } else if (type === 'pointRegion') {
    bg = 100;
    quad_tree = new PointRegionQuadTree(boundary, capacity);
  }
}

function updateSettings() {
  b_amt = parseInt(document.getElementById('boidCount').value);
  capacity = parseInt(document.getElementById('quadCapacity').value);
  
  birds = [];
  for (var i = 0; i < b_amt; i++) {
    birds.push(new Boid(random(width), random(height)));
  }
}