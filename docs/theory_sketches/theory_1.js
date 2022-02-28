const s = ( sketch ) => {

var player;
var wallFade;
var WallFadeAmount = 2;
var playerFade;
var playerFadeAmount = 2;
var walls = [];
var drawWalls = false
var drawPlayer = false
var theory_1_canvas; 

function setup() {
    theory_1_canvas = createCanvas(600,500);
    theory_1_canvas.parent("theory_1");
    wallFade = 255;
    playerFade = 255;
    select('#theory_1-interact-1').mouseClicked(function() {drawWalls = true})
    select('#theory_1-interact-2').mouseClicked(function() {drawPlayer = true; drawWalls = true})

    walls.push(new Boundary(0,0,width,0));
    walls.push(new Boundary(width,0,width,height));
    walls.push(new Boundary(width,height,0,height));
    walls.push(new Boundary(0,height,0,0));

    player = new Particle(x=width/2, y=height/2)
}

function draw() {
    background(255);
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
