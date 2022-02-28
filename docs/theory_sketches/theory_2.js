
var player;
let slider;
var walls = [];
var lineLen = 0;
var drawRay = false
var done = false
var theory_2_canvas; 
var e = new p5.Ease()

function setup() {
    theory_2_canvas = createCanvas(600,500);
    theory_2_canvas.parent("theory_2");
    select("#theory_2_interact_1").mouseClicked(function() {drawRay = true})
    
    // select('#xd2').mouseClicked(function() {drawPlayer = true; drawWalls = true})

    walls.push(new Boundary(0,0,width,0));
    walls.push(new Boundary(width,0,width,height));
    walls.push(new Boundary(width,height,0,height));
    walls.push(new Boundary(0,height,0,0));

    player = new Particle(width/2, height/2, 1)

}

function draw() {
    if (done) {
        if (keyIsDown(LEFT_ARROW)) {
            player.rotate(-.03)
        }
        
        if (keyIsDown(RIGHT_ARROW)) {
            player.rotate(.03)
        }
    }
    background(255);
    for (var wall of walls) {
        wall.render();
    }
    if (drawRay && !done) {
        push()
        stroke(50)
        line(player.pos.x, player.pos.y, player.pos.x, player.pos.y - (windowHeight/2) * e.cubicInOut(lineLen))
        pop()
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