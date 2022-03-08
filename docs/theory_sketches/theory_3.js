const theory_3 = ( sketch ) => {

    const TILE_SIZE = 48;
    const MAP_NUM_ROWS = 11;
    const MAP_NUM_COLS = 15;

    var player;
    var walls = [];
    var theory_3_canvas; 
    var blocks_drawn;

    sketch.setup = () => {
        var block_1 = [
            new Boundary(4*TILE_SIZE,3*TILE_SIZE,7*TILE_SIZE,3*TILE_SIZE, sketch),
            new Boundary(4*TILE_SIZE,4*TILE_SIZE,7*TILE_SIZE,4*TILE_SIZE, sketch),
            new Boundary(4*TILE_SIZE,3*TILE_SIZE,4*TILE_SIZE,4*TILE_SIZE, sketch),
            new Boundary(7*TILE_SIZE,3*TILE_SIZE,7*TILE_SIZE,4*TILE_SIZE, sketch)
        ]
        var block_2 = [
            new Boundary(10*TILE_SIZE,8*TILE_SIZE,10*TILE_SIZE,9*TILE_SIZE, sketch),
            new Boundary(10*TILE_SIZE,8*TILE_SIZE,11*TILE_SIZE,8*TILE_SIZE, sketch),
            new Boundary(11*TILE_SIZE,8*TILE_SIZE,11*TILE_SIZE,9*TILE_SIZE, sketch),
            new Boundary(10*TILE_SIZE,9*TILE_SIZE,11*TILE_SIZE,9*TILE_SIZE, sketch)
        ]
        var block_3 = [
            new Boundary(11*TILE_SIZE,7*TILE_SIZE,11*TILE_SIZE,8*TILE_SIZE, sketch),
            new Boundary(11*TILE_SIZE,7*TILE_SIZE,12*TILE_SIZE,7*TILE_SIZE, sketch),
            new Boundary(12*TILE_SIZE,7*TILE_SIZE,12*TILE_SIZE,8*TILE_SIZE, sketch),
            new Boundary(11*TILE_SIZE,8*TILE_SIZE,12*TILE_SIZE,8*TILE_SIZE, sketch)
        ]
        var block_4 = [
            new Boundary(12*TILE_SIZE,6*TILE_SIZE,12*TILE_SIZE,7*TILE_SIZE, sketch),
            new Boundary(12*TILE_SIZE,6*TILE_SIZE,13*TILE_SIZE,6*TILE_SIZE, sketch),
            new Boundary(13*TILE_SIZE,6*TILE_SIZE,13*TILE_SIZE,7*TILE_SIZE, sketch),
            new Boundary(12*TILE_SIZE,7*TILE_SIZE,13*TILE_SIZE,7*TILE_SIZE, sketch)
        ]
        var block_5 = [
            new Boundary(3*TILE_SIZE,7*TILE_SIZE,3*TILE_SIZE,9*TILE_SIZE, sketch),
            new Boundary(3*TILE_SIZE,7*TILE_SIZE,4*TILE_SIZE,7*TILE_SIZE, sketch),
            new Boundary(4*TILE_SIZE,7*TILE_SIZE,4*TILE_SIZE,9*TILE_SIZE, sketch),
            new Boundary(3*TILE_SIZE,9*TILE_SIZE,3*TILE_SIZE,9*TILE_SIZE, sketch)
        ]

        blocks_drawn = 0

        theory_3_canvas = sketch.createCanvas(TILE_SIZE * MAP_NUM_COLS, TILE_SIZE*MAP_NUM_ROWS);
        theory_3_canvas.parent("theory_3");
        sketch.select('#theory_3_interact_1').mouseClicked(function() { 
            switch (blocks_drawn) {
                case 0:
                    for (var wall of block_1){
                        walls.push(wall)
                    }   
                    break;
                case 1:
                    for (var wall of block_2){
                        walls.push(wall)
                    }   
                    break;
                case 2:
                    for (var wall of block_3){
                        walls.push(wall)
                    }
                    break;   
                case 3:
                    for (var wall of block_4){
                        walls.push(wall)
                    }
                    break;
                case 4:
                    for (var wall of block_5){
                        walls.push(wall)
                    }
                    break;    
            }
            blocks_drawn++
        })

        sketch.select('#theory_3_interact_2').mouseClicked(function() { 
            player.updateFOV(360, 1)   
        })
        

        walls.push(new Boundary(TILE_SIZE,TILE_SIZE,sketch.width - TILE_SIZE,TILE_SIZE, sketch));
        walls.push(new Boundary(sketch.width - TILE_SIZE, TILE_SIZE, sketch.width - TILE_SIZE, sketch.height - TILE_SIZE, sketch));
        walls.push(new Boundary(sketch.width - TILE_SIZE, sketch.height - TILE_SIZE, TILE_SIZE, sketch.height - TILE_SIZE, sketch));
        walls.push(new Boundary(TILE_SIZE,sketch.height - TILE_SIZE, TILE_SIZE, TILE_SIZE, sketch));

        player = new Particle(sketch.width/2, sketch.height/2, 360, 10, sketch)

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

        if (blocks_drawn > 0) {
            sketch.push()
            sketch.fill(0,200)
            sketch.rect(4*TILE_SIZE,3*TILE_SIZE,3*TILE_SIZE, TILE_SIZE)
            sketch.pop()
        }
        if (blocks_drawn > 1) {
            sketch.push()
            sketch.fill(0,200)
            sketch.rect(10*TILE_SIZE,8*TILE_SIZE, TILE_SIZE, TILE_SIZE)
            sketch.pop()
        }
        if (blocks_drawn > 2) {
            sketch.push()
            sketch.fill(0,200)
            sketch.rect(11*TILE_SIZE,7*TILE_SIZE, TILE_SIZE, TILE_SIZE)
            sketch.pop()
        }
        if (blocks_drawn > 3) {
            sketch.push()
            sketch.fill(0,200)
            sketch.rect(12*TILE_SIZE,6*TILE_SIZE, TILE_SIZE, TILE_SIZE)
            sketch.pop()
        }
        if (blocks_drawn > 4) {
            sketch.push()
            sketch.fill(0,200)
            sketch.rect(3*TILE_SIZE,7*TILE_SIZE, TILE_SIZE, 2*TILE_SIZE)
            sketch.pop()
        }

        if (sketch.keyIsDown(sketch.LEFT_ARROW)) {
            player.rotate(-.03)
        }
        
        if (sketch.keyIsDown(sketch.RIGHT_ARROW)) {
            player.rotate(.03)
        }

        // if (keyIsDown(UP_ARROW)) {
        //     player.move(-1)
        // }

        // sketch.background(255);
        for (var wall of walls) {
            wall.render();
        }

        player.updatePos(sketch.mouseX, sketch.mouseY)

        // player.rotate(.01)
        player.look(walls)


        // console.log(mouseX)
        player.render(0)
    }

    // function windowResized() {
    //     resizeCanvas(windowWidth/2, windowHeight/2);
    // }
}

new p5(theory_3)