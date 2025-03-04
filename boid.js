var disp_color = 255;
var perceptionRadius = 10;
var size = 3;
class Boid {
    constructor(x,y) {
        this.position = createVector(x,y);
        this.velocity = p5.Vector.random2D();
        this.velocity.mult(random(-3,3));
        //this.velocity.setMag(random(2,4));
        this.acceleration = createVector(0,0);
        this.maxForce = .2;
        this.maxSpeed = 3;
    }

    edges () {
        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }

        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {  
            this.position.y = height;
    }
}
    update() {
        this.edges();
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
    }

    display() {
        noStroke();
        fill(disp_color);
        ellipse(this.position.x, this.position.y, size);
    }

    // birds try to change position so it corresponds with average alignment of other birds
    alignment(boids) {
        let steering = createVector();
        let total = 0;
        for (let i = 0; i < boids.length; i++) {
            let distance = dist(this.position.x, this.position.y, boids[i].position.x, boids[i].position.y);
            if (boids[i] != this && distance < perceptionRadius) {
                steering.add(boids[i].velocity);
                total += 1;
            }
            
            }
            if (total > 0) {
                steering.div(total);
                steering.setMag(this.maxSpeed);
                steering.sub(this.velocity);
                steering.limit(this.maxForce);
        }
        return steering;
    }
    // birds try to move towards the average position of other birds
    cohesion(boids) {
        let steering = createVector();
        let total = 0;
        
        for (let i = 0; i < boids.length; i++) {
            let distance = dist(this.position.x, this.position.y, boids[i].position.x, boids[i].position.y);
            if (boids[i] != this && distance < perceptionRadius) {
                steering.add(boids[i].position);
                total += 1;
            }
        }

        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        // this.acceleration = steering;
        return steering;
    }

    // birds try to maintain a reasonable distance betwen each other
    separation(boids) {
        let steering = createVector();
        let total = 0;
        for (let i = 0; i < boids.length; i++) {
            let distance = dist(this.position.x, this.position.y, boids[i].position.x, boids[i].position.y);
            if (boids[i] != this && distance < perceptionRadius) {
                let diff = p5.Vector.sub(this.position, boids[i].position);
                diff.div(distance * distance);
                steering.add(diff);
                total += 1;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;

    }

    flock(boids) {
        let alignment = this.alignment(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);
    
        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
    }
}