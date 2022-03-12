class Boundary {
    constructor(x1, y1, x2, y2, tile_size, sketch) {
        this.tile_size = tile_size
        this.sketch = sketch
        this.x1 = x1
        this.x2 = x2
        this.y1 = y1
        this.y2 = y2
        this.a = this.sketch.createVector(x1*tile_size,y1*tile_size);
        this.b = this.sketch.createVector(x2*tile_size,y2*tile_size);
    }

    render(opacity = 0) {
        this.sketch.push();
        this.sketch.strokeWeight(1)
        this.sketch.stroke(opacity);
        this.sketch.line(this.a.x, this.a.y, this.b.x, this.b.y);
        this.sketch.pop();
    }

    update_tile_size(tile_size) {
        this.tile_size = tile_size;
        this.a = this.sketch.createVector(this.x1*tile_size,this.y1*tile_size);
        this.b = this.sketch.createVector(this.x2*tile_size,this.y2*tile_size);
    }
}