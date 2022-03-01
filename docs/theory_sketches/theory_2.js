const theory_2 = ( sketch ) => {

    var player;
    var walls = [];
    var lineLen = 0;
    var drawRay = false
    var done = false
    var theory_2_canvas; 
    var e = new p5.Ease()

    sketch.setup = () => {
        theory_2_canvas = sketch.createCanvas(600,500);
        theory_2_canvas.parent("theory_2");
        sketch.select("#theory_2_interact_1").mouseClicked(function() {drawRay = true})
        
        walls.push(new Boundary(0,0,sketch.width,0, sketch));
        walls.push(new Boundary(sketch.width,0, sketch.width, sketch.height, sketch));
        walls.push(new Boundary(sketch.width, sketch.height,0, sketch.height, sketch));
        walls.push(new Boundary(0,sketch.height, 0, 0, sketch));

        player = new Particle(sketch.width/2, sketch.height/2, 1, 1, sketch)
    }

    sketch.draw = () => {
        if (done) {
            if (sketch.keyIsDown(sketch.LEFT_ARROW)) {
                player.rotate(-.03)
            }
            
            if (sketch.keyIsDown(sketch.RIGHT_ARROW)) {
                player.rotate(.03)
            }
        }
        sketch.background(255);
        for (var wall of walls) {
            wall.render();
        }
        if (drawRay && !done) {
            sketch.push()
            sketch.stroke(50)
            sketch.line(player.pos.x, player.pos.y, player.pos.x, player.pos.y - (sketch.windowHeight/2) * e.cubicInOut(lineLen))
            sketch.pop()
            lineLen += .01
            if (lineLen > 1) {
                done = true
            }
        } 

        // player.rotate(.01)
        if (done) {
            player.look(walls)

        }


        player.render(0)
    }


// function windowResized() {
//     resizeCanvas(windowWidth/2, windowHeight/2);
// }
}

new p5(theory_2)