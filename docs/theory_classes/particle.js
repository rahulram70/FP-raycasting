class Particle {
    constructor(x,y, fov = 60, step = 1) {
        this.pos = createVector(x,y);
        this.rays = [];
        this.heading = radians(90);
        this.fov = fov
        this.step = step
        for (var angle = Math.ceil(-this.fov / 2) + 90; angle < Math.ceil(this.fov / 2) + 90; angle += step) {
            this.rays.push(new Ray(this.pos, radians(angle)));
        }
    }

    updateFOV(fov, step) {
        this.fov = fov;
        this.rays = [];
        this.step = step
        for (let a = -this.fov / 2; a < this.fov / 2; a += this.step) {
          this.rays.push(new Ray(this.pos, radians(a) + this.heading));
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
          this.rays[index].setAngle(radians(a) + this.heading);
          index++;
        }
    }



    look(walls) {
        for (var i = 0; i < this.rays.length; i++) {
            const ray = this.rays[i];
            var closest = null;
            var record = Infinity;
            for (var wall of walls) {
                const pt = ray.cast(wall)
                if (pt) {
                    const d = p5.Vector.dist(this.pos, pt);
                    if (d < record) {
                        record = d;
                        closest = pt
                    }
                }
            }
            if (closest) {
                stroke(50)
                strokeWeight(1)
                line(this.pos.x, this.pos.y, closest.x, closest.y)
            }
        }
    }

    render(opacity = 0) {
        push();
        stroke(opacity);
        ellipse(this.pos.x, this.pos.y, 6);
        // for (var ray of this.rays) {
        //     ray.render(opacity);
        // }
        pop();
    }

}