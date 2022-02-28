var player;
let slider;
var lineLen = 0;
var drawRay = false
var canvas; 
var e = new p5.Ease()
var walls = [];

function setup() {
    canvas = createCanvas(600,500);
    canvas.parent("sketch-holder");
    select('#xd').mouseClicked(function() { 
        if (wallsToAdd.length > 0) {
            walls.push(wallsToAdd.pop())
        }    
    })
    slider = createSlider(1, 360, 360)
    slider.position(10, 10);

    walls.push(new Boundary(0,0,width,0));
    walls.push(new Boundary(width,0,width,height));
    walls.push(new Boundary(width,height,0,height));
    walls.push(new Boundary(0,height,0,0));
    walls.push(new Boundary(300,100,400,200));
    walls.push(new Boundary(300,100,400,200));
    walls.push(new Boundary(300,100,400,200));
    walls.push(new Boundary(300,100,400,200));

    player = new Particle(width/2, height/2, 360, 1)
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

    player.updateFOV(slider.value(), 1)
    // player.updatePos(mouseX, mouseY)

    // player.rotate(.01)
    player.look(walls)


    // console.log(mouseX)
    player.render(0)
}

// function windowResized() {
//     resizeCanvas(windowWidth/2, windowHeight/2);
// }