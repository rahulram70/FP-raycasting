const theory_4 = ( sketch ) => {

    const TILE_SIZE = 48;
    const MAP_NUM_ROWS = 11;
    const MAP_NUM_COLS = 15;

    var player;
    let slider;
    var theory_4_canvas; 
    var walls = [];

    var text_div_4
    var next_button_4;
    var prev_button_4;
    
    const section_4_text = 
        [
            `<p>Though, we are trying to build up a mock first person render of the world we're occupying. <br>
            We don't normally see all of our surroundings at one time, we see a small subsection in front of us. <br>
            This is called our field of view. Currently, the field of view is set to 360 degrees. <br>
            In other words, we are gathering information from rays being cast all around our player. <br>

            Try messing with the field of view with the slider below. Then try looking around with the arrow keys. <br>
            Before, there was no need to look around because we could see everything around us, but with a smaller fov
            we can see how our view of the world changes.</p>`
        ]



    sketch.setup = () => {
        theory_4_canvas = sketch.createCanvas(TILE_SIZE * MAP_NUM_COLS, TILE_SIZE*MAP_NUM_ROWS);
        theory_4_canvas.parent("theory_4");

        slider = sketch.createSlider(1, 360, 360)

        // World Boundaries
        walls.push(new Boundary(TILE_SIZE,TILE_SIZE,sketch.width - TILE_SIZE,TILE_SIZE, sketch));
        walls.push(new Boundary(sketch.width - TILE_SIZE, TILE_SIZE, sketch.width - TILE_SIZE, sketch.height - TILE_SIZE, sketch));
        walls.push(new Boundary(sketch.width - TILE_SIZE, sketch.height - TILE_SIZE, TILE_SIZE, sketch.height - TILE_SIZE, sketch));
        walls.push(new Boundary(TILE_SIZE,sketch.height - TILE_SIZE, TILE_SIZE, TILE_SIZE, sketch));

        // Walls added last section
        walls.push(new Boundary(4*TILE_SIZE,3*TILE_SIZE,7*TILE_SIZE,3*TILE_SIZE, sketch))
        walls.push(new Boundary(4*TILE_SIZE,4*TILE_SIZE,7*TILE_SIZE,4*TILE_SIZE, sketch))
        walls.push(new Boundary(4*TILE_SIZE,3*TILE_SIZE,4*TILE_SIZE,4*TILE_SIZE, sketch))
        walls.push(new Boundary(7*TILE_SIZE,3*TILE_SIZE,7*TILE_SIZE,4*TILE_SIZE, sketch))    
        walls.push(new Boundary(10*TILE_SIZE,8*TILE_SIZE,10*TILE_SIZE,9*TILE_SIZE, sketch))
        walls.push(new Boundary(10*TILE_SIZE,8*TILE_SIZE,11*TILE_SIZE,8*TILE_SIZE, sketch))
        walls.push(new Boundary(11*TILE_SIZE,8*TILE_SIZE,11*TILE_SIZE,9*TILE_SIZE, sketch))
        walls.push(new Boundary(10*TILE_SIZE,9*TILE_SIZE,11*TILE_SIZE,9*TILE_SIZE, sketch))    
        walls.push(new Boundary(11*TILE_SIZE,7*TILE_SIZE,11*TILE_SIZE,8*TILE_SIZE, sketch))
        walls.push(new Boundary(11*TILE_SIZE,7*TILE_SIZE,12*TILE_SIZE,7*TILE_SIZE, sketch))
        walls.push(new Boundary(12*TILE_SIZE,7*TILE_SIZE,12*TILE_SIZE,8*TILE_SIZE, sketch))
        walls.push(new Boundary(11*TILE_SIZE,8*TILE_SIZE,12*TILE_SIZE,8*TILE_SIZE, sketch))    
        walls.push(new Boundary(12*TILE_SIZE,6*TILE_SIZE,12*TILE_SIZE,7*TILE_SIZE, sketch))
        walls.push(new Boundary(12*TILE_SIZE,6*TILE_SIZE,13*TILE_SIZE,6*TILE_SIZE, sketch))
        walls.push(new Boundary(13*TILE_SIZE,6*TILE_SIZE,13*TILE_SIZE,7*TILE_SIZE, sketch))
        walls.push(new Boundary(12*TILE_SIZE,7*TILE_SIZE,13*TILE_SIZE,7*TILE_SIZE, sketch))    
        walls.push(new Boundary(3*TILE_SIZE,7*TILE_SIZE,3*TILE_SIZE,9*TILE_SIZE, sketch))
        walls.push(new Boundary(3*TILE_SIZE,7*TILE_SIZE,4*TILE_SIZE,7*TILE_SIZE, sketch))
        walls.push(new Boundary(4*TILE_SIZE,7*TILE_SIZE,4*TILE_SIZE,9*TILE_SIZE, sketch))
        walls.push(new Boundary(3*TILE_SIZE,9*TILE_SIZE,4*TILE_SIZE,9*TILE_SIZE, sketch))    

        player = new Particle(sketch.width/2 + 3, sketch.height/2 - 3, 360, 1, sketch)
    
        text_div_4 = sketch.createDiv(section_4_text[0])
            .attribute('class', 'section_text')
            .attribute('id', "xd")
            .center('horizontal')
            .position(0, sketch.height/3)
            // .style('opacity', 1)
            // .attribute('width', 22)
            .hide()

        next_button_4 = sketch.createButton("Next")
            .attribute('class', 'button_next')
            .center('horizontal')
            .style('border', '2px solid #5cb85c')
            .size(50, 20)
            .mousePressed(() => {
                    fullpage_api.moveTo('page5', 0);
            })
            .position(TILE_SIZE*MAP_NUM_COLS/2 + 100, 750)
            .hide()

        prev_button_4 = sketch.createButton("Back")
            .attribute('class', 'button_prev')
            .center('horizontal')
            .style('border', '2px solid #5bc0de')
            .size(50, 20)
            .mousePressed(() => {
                fullpage_api.moveTo('page3', 0);
            })
            .position(TILE_SIZE*MAP_NUM_COLS/2, 750)
            .hide()

        
        text_div_4.parent('#theory_4_text')
        next_button_4.parent('theory_4')
        prev_button_4.parent('theory_4')
        slider.parent("#xd")


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
        
        sketch.push()

        sketch.fill(0,200)
        sketch.rect(4*TILE_SIZE,3*TILE_SIZE,3*TILE_SIZE, TILE_SIZE)
        
        sketch.fill(0,200)
        sketch.rect(10*TILE_SIZE,8*TILE_SIZE, TILE_SIZE, TILE_SIZE)
        
        sketch.fill(0,200)
        sketch.rect(11*TILE_SIZE,7*TILE_SIZE, TILE_SIZE, TILE_SIZE)
        
        sketch.fill(0,200)
        sketch.rect(12*TILE_SIZE,6*TILE_SIZE, TILE_SIZE, TILE_SIZE)
        
        sketch.fill(0,200)
        sketch.rect(3*TILE_SIZE,7*TILE_SIZE, TILE_SIZE, 2*TILE_SIZE)

        sketch.pop()
    }

    sketch.draw = () => {
        draw_details()
        text_div_4.show()
        next_button_4.show()
        prev_button_4.show()

        if (sketch.keyIsDown(sketch.LEFT_ARROW)) {
            player.rotate(-.03)
        }
        
        if (sketch.keyIsDown(sketch.RIGHT_ARROW)) {
            player.rotate(.03)
        }

        // if (keyIsDown(UP_ARROW)) {
        //     player.move(-1)
        // }

        for (var wall of walls) {
            wall.render();
        }

        player.updateFOV(slider.value(), .5)
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