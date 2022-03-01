class Boundary {
    constructor(x1, y1, x2, y2, sketch) {
        this.sketch = sketch
        this.a = this.sketch.createVector(x1,y1);
        this.b = this.sketch.createVector(x2,y2);
    }

    render(opacity = 0) {
        this.sketch.push();
        this.sketch.strokeWeight(6)
        this.sketch.stroke(opacity);
        this.sketch.line(this.a.x, this.a.y, this.b.x, this.b.y);
        this.sketch.pop();
    }
}