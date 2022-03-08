const theory_2 = ( sketch ) => {

    const TILE_SIZE = 48;
    const MAP_NUM_ROWS = 11;
    const MAP_NUM_COLS = 15;

    var player;
    var walls = [];
    var lineLen = 0;
    var drawRay = false
    var done = false
    var theory_2_canvas; 
    var e = new p5.Ease()

    sketch.setup = () => {
        theory_2_canvas = sketch.createCanvas(TILE_SIZE * MAP_NUM_COLS, TILE_SIZE*MAP_NUM_ROWS);
        theory_2_canvas.parent("theory_2");
        sketch.select("#theory_2_interact_1").mouseClicked(function() {drawRay = true})
        
        walls.push(new Boundary(TILE_SIZE,TILE_SIZE,sketch.width - TILE_SIZE,TILE_SIZE, sketch));
        walls.push(new Boundary(sketch.width - TILE_SIZE, TILE_SIZE, sketch.width - TILE_SIZE, sketch.height - TILE_SIZE, sketch));
        walls.push(new Boundary(sketch.width - TILE_SIZE, sketch.height - TILE_SIZE, TILE_SIZE, sketch.height - TILE_SIZE, sketch));
        walls.push(new Boundary(TILE_SIZE,sketch.height - TILE_SIZE, TILE_SIZE, TILE_SIZE, sketch));

        player = new Particle(sketch.width/2, sketch.height/2, 1, 1, sketch)
    }

    function draw_details() {
        sketch.background(255);
        sketch.push()
        // sketch.stroke(0, 200);
        sketch.fill(0, 200)
        sketch.rect(0,0, TILE_SIZE*MAP_NUM_COLS, TILE_SIZE*MAP_NUM_ROWS)
        
        
        
        sketch.fill(255)
        sketch.rect(TILE_SIZE, TILE_SIZE, TILE_SIZE* (MAP_NUM_COLS - 2), TILE_SIZE*(MAP_NUM_ROWS - 2))
        sketch.pop()

        sketch.push()
        sketch.strokeWeight(1)
        sketch.stroke(0, 75);
        for (var col = 2; col < MAP_NUM_COLS-1; col++) {
            sketch.line(col * TILE_SIZE, TILE_SIZE, col*TILE_SIZE, TILE_SIZE*(MAP_NUM_ROWS-1))
        }
        for (var row = 2; row < MAP_NUM_ROWS-1; row++) {
            sketch.line(TILE_SIZE, row * TILE_SIZE, TILE_SIZE * (MAP_NUM_COLS - 1), row*TILE_SIZE)
        }
        sketch.pop()
    }

    sketch.draw = () => {
        draw_details()

        if (done) {
            if (sketch.keyIsDown(sketch.LEFT_ARROW)) {
                player.rotate(-.03)
            }
            
            if (sketch.keyIsDown(sketch.RIGHT_ARROW)) {
                player.rotate(.03)
            }

            if (sketch.keyIsDown(sketch.UP_ARROW)) {
                player.move(-1)
            }

            if (sketch.keyIsDown(sketch.DOWN_ARROW)) {
                player.move(1)
            }
        }
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