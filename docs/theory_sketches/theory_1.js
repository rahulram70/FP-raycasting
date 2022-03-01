const theory_1 = ( sketch ) => {

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
        theory_1_canvas = sketch.createCanvas(600,500);
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

    sketch.draw = () => {
        sketch.background(255);
        if (drawWalls) {
            for (var wall of walls) {
                wall.render(wallFade);
            }

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