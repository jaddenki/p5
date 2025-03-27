let font;
let points;
let t = 0; 
let textInput; 
let currentText = "hello.";
let colorButton;
let currentPalette = 0;
let shapes = ['circle', 'square'];
let currentShape = 0;
let fontSize = 250;
let shapeSize = 2; 


const palettes = [
    // los angeles
    {
        h: [250, 290, 310, 320], 
        s: [100, 98, 77, 4], 
        b: [12, 75, 93, 99],
        background: {h: 240, s: 20, b: 255} 
    },
    // pride
    {
        h: [20, 45, 340, 355], 
        s: [90, 85, 70, 60], 
        b: [95, 90, 85, 95],
        background: {h: 20, s: 30, b: 0} 
    },
    // oceannnnn
    {
        h: [200, 190, 180, 170], 
        s: [80, 70, 60, 50], 
        b: [80, 85, 90, 95],
        background: {h: 200, s: 40, b: 20}
    },
    // green
    {
        h: [120, 100, 80, 60], 
        s: [80, 75, 70, 85], 
        b: [60, 70, 80, 90],
        background: {h: 120, s: 30, b: 15} 
    },
    // blurple
    {
        h: [240, 250, 260, 280], 
        s: [90, 85, 75, 70], 
        b: [50, 60, 70, 80],
        background: {h: 240, s: 50, b: 10} 
    }
];

function preload() {
  font = loadFont('pst.ttf');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    // Get HTML elements
    textInput = select('#textInput');
    colorButton = select('#colorButton');
    shapeButton = select('#shapeButton');
    sizeSlider = select('#sizeSlider');
    shapeSizeSlider = select('#shapeSizeSlider');
    
    // Add event listeners
    textInput.input(updateText);
    colorButton.mousePressed(changePalette);
    shapeButton.mousePressed(changeShape);
    sizeSlider.input(updateFontSize);
    shapeSizeSlider.input(updateShapeSize);
    
    textSize(fontSize);
    textAlign(CENTER, CENTER);
    noStroke();
    colorMode(HSB, 360, 100, 100);
    
    updatePoints();
}

function updateText() {
  currentText = this.value();
  updatePoints();
}

function updateFontSize() {
    fontSize = this.value();
    updatePoints();
}

function updateShapeSize() {
    shapeSize = this.value();
}

function updatePoints() {
    let textW = currentText.length * (fontSize * 0.6);
    let startX = width/2 - textW/2;
    points = font.textToPoints(currentText, startX, height/2, fontSize, { 
        sampleFactor: 0.3 
    });
}

function changePalette() {
  currentPalette = (currentPalette + 1) % palettes.length;
}

function changeShape() {
  currentShape = (currentShape + 1) % shapes.length;
}

function draw() {
    let bg = palettes[currentPalette].background;
    background(bg.h, bg.s, bg.b);
    
    strokeWeight(2);

    for (let i = 0; i < points.length; i++) {
        let p = points[i];

        let offsetX = noise(p.x * 0.1, p.y * 0.11, t) * 20 - 10;
        let offsetY = noise(p.y * 0.05, t+2, p.x * 0.5) * 20 - 10;

        // MOUSE INTERACTIONNNN
        let d = dist(mouseX, mouseY, p.x, p.y);
        let maxDistort = map(d, 0, 200, 10, 0, true);
        
       
        let progress = map(p.x, width/2 - 300, width/2 + 300, 0, 1);
        let hue, saturation, brightness;
        
        // GRADIENT!
        if (progress < 0.33) {
            let t = map(progress, 0, 0.33, 0, 1);
            hue = lerp(palettes[currentPalette].h[0], palettes[currentPalette].h[1], t);
            saturation = lerp(palettes[currentPalette].s[0], palettes[currentPalette].s[1], t);
            brightness = lerp(palettes[currentPalette].b[0], palettes[currentPalette].b[1], t);
        } else if (progress < 0.66) {
            let t = map(progress, 0.33, 0.66, 0, 1);
            hue = lerp(palettes[currentPalette].h[1], palettes[currentPalette].h[2], t);
            saturation = lerp(palettes[currentPalette].s[1], palettes[currentPalette].s[2], t);
            brightness = lerp(palettes[currentPalette].b[1], palettes[currentPalette].b[2], t);
        } else {
            let t = map(progress, 0.66, 1, 0, 1);
            hue = lerp(palettes[currentPalette].h[2], palettes[currentPalette].h[3], t);
            saturation = lerp(palettes[currentPalette].s[2], palettes[currentPalette].s[3], t);
            brightness = lerp(palettes[currentPalette].b[2], palettes[currentPalette].b[3], t);
        }
        
        fill(hue, saturation, brightness);
        
        let x = p.x + offsetX + random(-maxDistort, maxDistort);
        let y = p.y + offsetY + random(-maxDistort, maxDistort);
        
        switch(shapes[currentShape]) {
            case 'square':
                rectMode(CENTER);
                rect(x, y, shapeSize, shapeSize);
                break;
            default:
                ellipse(x, y, shapeSize);
                break;
        }
    }

    t += 0.01;
}
