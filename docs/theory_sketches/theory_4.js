const theory_4 = ( sketch ) => {

    var player;
    let slider;
    var lineLen = 0;
    var drawRay = false
    var canvas; 
    var e = new p5.Ease()
    var walls = [];

    sketch.setup = () => {
        canvas = sketch.createCanvas(600,500);
        canvas.parent("theory_4");
        // sketch.select('#theory_4_interact_1').mouseClicked(function() { 
        //     if (wallsToAdd.length > 0) {
        //         walls.push(wallsToAdd.pop())
        //     }    
        // })
        slider = sketch.createSlider(1, 360, 360)
        slider.parent("#slider")

        walls.push(new Boundary(0,0,sketch.width,0, sketch));
        walls.push(new Boundary(sketch.width,0,sketch.width,sketch.height, sketch));
        walls.push(new Boundary(sketch.width,sketch.height,0,sketch.height, sketch));
        walls.push(new Boundary(0,sketch.height,0,0, sketch));
        walls.push(new Boundary(100,100,100,200, sketch));
        walls.push(new Boundary(300,100,400,200, sketch));
        walls.push(new Boundary(100,400,200,400, sketch));

        player = new Particle(sketch.width/2, sketch.height/2, 360, 1, sketch)
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
}

new p5(theory_4)