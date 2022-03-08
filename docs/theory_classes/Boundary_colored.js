class Boundary_Color {
    constructor(x1, y1, x2, y2, color, sketch) {
        this.sketch = sketch
        this.a = this.sketch.createVector(x1,y1);
        this.b = this.sketch.createVector(x2,y2);
        this.color = color
    }

    render(opacity = 0) {
        this.sketch.push();
        this.sketch.strokeWeight(1);
        // this.sketch.stroke(this.color);
        this.sketch.line(this.a.x, this.a.y, this.b.x, this.b.y);
        this.sketch.pop();
    }
}