const theory_1 = ( sketch ) => {

    const TILE_SIZE = 48;
    const MAP_NUM_ROWS = 11;
    const MAP_NUM_COLS = 15;

    var player;
    var wallFade;
    var WallFadeAmount = 2;
    var playerFade;
    var playerFadeAmount = 2;
    var walls = [];
    var drawWalls = false
    var drawPlayer = false
    var theory_1_canvas; 

    sketch.setup = () => {
        theory_1_canvas = sketch.createCanvas(TILE_SIZE * MAP_NUM_COLS, TILE_SIZE*MAP_NUM_ROWS);
        theory_1_canvas.parent("theory_1");

        wallFade = 255;
        playerFade = 255;
        sketch.select('#theory_1-interact-1').mouseClicked(function() {drawWalls = true})
        sketch.select('#theory_1-interact-2').mouseClicked(function() {drawPlayer = true; drawWalls = true})

        walls.push(new Boundary(0,0,sketch.width,0, sketch));
        walls.push(new Boundary(sketch.width,0, sketch.width, sketch.height, sketch));
        walls.push(new Boundary(sketch.width, sketch.height,0, sketch.height, sketch));
        walls.push(new Boundary(0,sketch.height, 0, 0, sketch));

        player = new Particle(x=sketch.width/2, y=sketch.height/2, 360, 1, sketch)
    }

    function draw_details(opacity) {
        sketch.background(255);
        sketch.push()
        // sketch.stroke(0, 200);
        sketch.fill(opacity, 200)
        sketch.rect(0,0, TILE_SIZE*MAP_NUM_COLS, TILE_SIZE*MAP_NUM_ROWS)
        
        
        
        sketch.fill(255)
        sketch.rect(TILE_SIZE, TILE_SIZE, TILE_SIZE* (MAP_NUM_COLS - 2), TILE_SIZE*(MAP_NUM_ROWS - 2))
        sketch.pop()

        sketch.push()
        sketch.strokeWeight(1)
        sketch.stroke(opacity, 75);
        for (var col = 2; col < MAP_NUM_COLS-1; col++) {
            sketch.line(col * TILE_SIZE, TILE_SIZE, col*TILE_SIZE, TILE_SIZE*(MAP_NUM_ROWS-1))
        }
        for (var row = 2; row < MAP_NUM_ROWS-1; row++) {
            sketch.line(TILE_SIZE, row * TILE_SIZE, TILE_SIZE * (MAP_NUM_COLS - 1), row*TILE_SIZE)
        }
        sketch.pop()
    }

    sketch.draw = () => {
        sketch.background(255);

        if (drawWalls) {
            for (var wall of walls) {
                wall.render(wallFade);
            }

            draw_details(wallFade)

            if (wallFade > 0) {
                wallFade -= WallFadeAmount
            }
        }
        if (drawPlayer) {
            player.render(playerFade)

            if (playerFade > 0) {
                playerFade -= playerFadeAmount
            }
        }
        // console.log("xd")
        // player.look(walls)
    }
}

new p5(theory_1)