class Boundary {
    constructor(x1, y1, x2, y2) {
        this.a = createVector(x1,y1);
        this.b = createVector(x2,y2);
    }

    render(opacity = 0) {
        push();
        strokeWeight(6)
        stroke(opacity);
        line(this.a.x, this.a.y, this.b.x, this.b.y);
        pop();
    }
}