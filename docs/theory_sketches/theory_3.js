var player;
let slider;
var walls = [];
var lineLen = 0;
var drawRay = false
var canvas; 
var e = new p5.Ease()
var wallsToAdd = []

function setup() {
    wallsToAdd = [new Boundary(100,100,100,200), new Boundary(300,100,400,200),
                  new Boundary(100,400,200,400)]
    canvas = createCanvas(600,500);
    canvas.parent("sketch-holder");
    select('#xd').mouseClicked(function() { 
        if (wallsToAdd.length > 0) {
            walls.push(wallsToAdd.pop())
        }    
    })

    select('#xd2').mouseClicked(function() { 
        player.updateFOV(360, 1)   
    })
    
    // select('#xd2').mouseClicked(function() {drawPlayer = true; drawWalls = true})

    walls.push(new Boundary(0,0,width,0));
    walls.push(new Boundary(width,0,width,height));
    walls.push(new Boundary(width,height,0,height));
    walls.push(new Boundary(0,height,0,0));

    player = new Particle(width/2, height/2, 360, 10)

}

function draw() {
    if (keyIsDown(LEFT_ARROW)) {
        player.rotate(-.03)
    }
    
    if (keyIsDown(RIGHT_ARROW)) {
        player.rotate(.03)
    }

    // if (keyIsDown(UP_ARROW)) {
    //     player.move(-1)
    // }

    background(255);
    for (var wall of walls) {
        wall.render();
    }

    player.updatePos(mouseX, mouseY)

    // player.rotate(.01)
    player.look(walls)


    // console.log(mouseX)
    player.render(0)
}

// function windowResized() {
//     resizeCanvas(windowWidth/2, windowHeight/2);
// }