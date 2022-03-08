class Ray {
    constructor(pos, angle, sketch) {
        this.pos = pos;
        this.angle = angle
        this.dir = p5.Vector.fromAngle(angle);
        this.sketch = sketch;
        this.len;
        this.dest_pos;
        this.color;
    }

    setAngle(angle) {
        this.dir = p5.Vector.fromAngle(angle)
        this.angle = angle
    }

    render(opacity) {
        // fill(255,0,0,127);
        // stroke(100)        
        this.sketch.push();
        this.sketch.stroke(opacity);
        this.sketch.translate(this.pos.x, this.pos.y);
        this.sketch.line(0,0, -this.dir.x * 5, -this.dir.y * 5);
        this.sketch.pop();
    }

    cast(wall) {
        const x1 = wall.a.x;
        const y1 = wall.a.y;
        const x2 = wall.b.x;
        const y2 = wall.b.y;

        const x3 = this.pos.x;
        const y3 = this.pos.y;
        const x4 = this.pos.x + this.dir.x;
        const y4 = this.pos.y + this.dir.y;
    
        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (den == 0) {
            return;
        }

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

        if (t > 0 && t < 1 && u < 0) {
            const pt = this.sketch.createVector();
            pt.x = x1 + t * (x2 - x1);
            pt.y = y1 + t * (y2 - y1);
            this.color = wall.color
            return pt;
        } else {
            return;
        }
    }

}