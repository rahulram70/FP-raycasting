class Particle {
    constructor(x,y, fov = 60, step, sketch) {
        this.pos = sketch.createVector(x,y);
        this.rays = [];
        this.heading = sketch.radians(90);
        this.fov = fov
        this.step = step
        this.sketch = sketch
        for (var angle = Math.ceil(-this.fov / 2) + 90; angle < Math.ceil(this.fov / 2) + 90; angle += this.step) {
            this.rays.push(new Ray(this.pos, this.sketch.radians(angle), this.sketch));
        }
    }

    updateFOV(fov, step) {
        this.fov = fov;
        this.rays = [];
        this.step = step
        for (let a = -this.fov / 2; a < this.fov / 2; a += this.step) {
          this.rays.push(new Ray(this.pos, this.sketch.radians(a) + this.heading, this.sketch));
        }
      }


    updatePos(x, y) {
        this.pos.set(x, y);
    }

    move(amount) {
        const vec = p5.Vector.fromAngle(this.heading);
        vec.setMag(amount)
        this.pos.add(vec)
    }

    rotate(angle) {
        this.heading += angle;
        let index = 0;
        for (let a = -this.fov / 2; a < this.fov / 2; a += this.step) {
          this.rays[index].setAngle(this.sketch.radians(a) + this.heading);
          index++;
        }
    }



    look(walls) {
        for (var i = 0; i < this.rays.length; i++) {
            var ray = this.rays[i];
            var closest = null;
            var euclidean_dist = Infinity;
            for (var wall of walls) {
                const pt = ray.cast(wall)
                if (pt) {
                    const d = p5.Vector.dist(this.pos, pt);
                    if (d < euclidean_dist) {
                        euclidean_dist = d;
                        closest = pt
                    }
                }
            }
            if (closest) {
                this.sketch.push()
                this.sketch.stroke(225,0,0, )
                this.sketch.strokeWeight(1)
                this.sketch.line(this.pos.x, this.pos.y, closest.x, closest.y)
                this.sketch.pop()
                ray.dest_pos = closest;
                ray.len = p5.Vector.dist(this.pos, closest);
            }
        }
    }

    render(opacity = 0) {
        this.sketch.push();
        this.sketch.stroke(opacity);
        this.sketch.fill(255-opacity,0,0)
        this.sketch.ellipse(this.pos.x, this.pos.y, 6);
        this.sketch.pop();
        this.sketch.push();
        let heading_vector = p5.Vector.fromAngle(this.heading, 20)
        this.sketch.stroke(opacity);
        this.sketch.line(this.pos.x, this.pos.y, this.pos.x-heading_vector.x, this.pos.y-heading_vector.y);
        this.sketch.pop();
    }

}