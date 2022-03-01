const theory_3 = ( sketch ) => {

    var player;
    let slider;
    var walls = [];
    var lineLen = 0;
    var drawRay = false
    var theory_3_canvas; 
    var e = new p5.Ease()
    var wallsToAdd = []

    sketch.setup = () => {
        wallsToAdd = [new Boundary(100,100,100,200, sketch), new Boundary(300,100,400,200, sketch),
                    new Boundary(100,400,200,400, sketch)]
        theory_3_canvas = sketch.createCanvas(600,500);
        theory_3_canvas.parent("theory_3");
        sketch.select('#theory_3_interact_1').mouseClicked(function() { 
            if (wallsToAdd.length > 0) {
                walls.push(wallsToAdd.pop())
            }    
        })

        sketch.select('#theory_3_interact_2').mouseClicked(function() { 
            player.updateFOV(360, 1)   
        })
        
        // select('#xd2').mouseClicked(function() {drawPlayer = true; drawWalls = true})

        walls.push(new Boundary(0,0,sketch.width,0, sketch));
        walls.push(new Boundary(sketch.width,0,sketch.width,sketch.height, sketch));
        walls.push(new Boundary(sketch.width,sketch.height,0,sketch.height, sketch));
        walls.push(new Boundary(0,sketch.height,0,0, sketch));

        player = new Particle(sketch.width/2, sketch.height/2, 360, 10, sketch)

    }

    sketch.draw = () => {
        if (sketch.keyIsDown(sketch.LEFT_ARROW)) {
            player.rotate(-.03)
        }
        
        if (sketch.keyIsDown(sketch.RIGHT_ARROW)) {
            player.rotate(.03)
        }

        // if (keyIsDown(UP_ARROW)) {
        //     player.move(-1)
        // }

        sketch.background(255);
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