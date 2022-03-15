const theory_4 = ( sketch ) => {

    // const TILE_SIZE = 48;
    const MAP_NUM_ROWS = 11;
    const MAP_NUM_COLS = 15;
    var TILE_SIZE = ($(window).width()/2.5)/MAP_NUM_COLS;

    var player;
    let slider;
    var theory_4_canvas; 
    var walls = [];

    var text_div_4;
    var fov_div;
    var next_button_4;
    var prev_button_4;
    
    const section_4_text = 
        [
            `<p>
            Though, we are trying to build up a mock first person render of the world we're occupying. <br>
            </p>
            <p>
                The rays we cast, we will eventually render into our first person view, but normally we don't 
                see all of our surroundings at one time, we see a small subsection in front of us.
                We have to rotate our eyes or head to see things outside of our view.
            </p>
            <p>
                The subsection of our surroundings we can see we will call our field of view or FOV, and we will measure this
                in terms of the degree around our current direction we can see.
            </p>
            <p>
                Currently, our field of view is 360 degrees
            </p>
            <p>
                Try messing with the field of view with the slider below. Then try looking around with the arrow keys. <br>
                Before, there was no need to look around because we could see everything around us, but with a smaller fov
                we can see how our view of the world changes.
            </p>`
        ]



    sketch.setup = () => {
        theory_4_canvas = sketch.createCanvas(TILE_SIZE * MAP_NUM_COLS, TILE_SIZE*MAP_NUM_ROWS);
        theory_4_canvas.parent("theory_4");

        slider = sketch.createSlider(1, 360, 360)
        slider.addClass("fov_slider")
        slider.attribute("list", "ticks")


        // World Boundaries
        walls.push(new Boundary(1,1,MAP_NUM_COLS-1,1, TILE_SIZE, sketch));
        walls.push(new Boundary(MAP_NUM_COLS - 1, 1, MAP_NUM_COLS - 1, MAP_NUM_ROWS-1,TILE_SIZE, sketch));
        walls.push(new Boundary(MAP_NUM_COLS - 1, MAP_NUM_ROWS-1, 1, MAP_NUM_ROWS-1, TILE_SIZE, sketch));
        walls.push(new Boundary(1,MAP_NUM_ROWS-1, 1, 1, TILE_SIZE, sketch));

        // Walls added last section
        walls.push(new Boundary(4*1,3*1,7*1,3*1, TILE_SIZE, sketch))
        walls.push(new Boundary(4*1,4*1,7*1,4*1, TILE_SIZE, sketch))
        walls.push(new Boundary(4*1,3*1,4*1,4*1, TILE_SIZE, sketch))
        walls.push(new Boundary(7*1,3*1,7*1,4*1, TILE_SIZE, sketch))
        walls.push(new Boundary(10,8,10,9, TILE_SIZE,sketch))
        walls.push(new Boundary(10,8,11,8, TILE_SIZE,sketch))
        walls.push(new Boundary(11,8,11,9, TILE_SIZE,sketch))
        walls.push(new Boundary(10,9,11,9, TILE_SIZE,sketch))
        walls.push(new Boundary(11,7,11,8, TILE_SIZE,sketch))
        walls.push(new Boundary(11,7,12,7, TILE_SIZE,sketch))
        walls.push(new Boundary(12,7,12,8, TILE_SIZE,sketch))
        walls.push(new Boundary(11,8,12,8, TILE_SIZE,sketch))
        walls.push(new Boundary(12,6,12,7, TILE_SIZE,sketch))
        walls.push(new Boundary(12,6,13,6, TILE_SIZE,sketch))
        walls.push(new Boundary(13,6,13,7, TILE_SIZE,sketch))
        walls.push(new Boundary(12,7,13,7, TILE_SIZE,sketch))
        walls.push(new Boundary(3,7,3,9,TILE_SIZE, sketch))
        walls.push(new Boundary(3,7,4,7,TILE_SIZE, sketch))
        walls.push(new Boundary(4,7,4,9,TILE_SIZE, sketch))
        walls.push(new Boundary(3,9,4,9,TILE_SIZE, sketch))
        walls.push(new Boundary(3,7,3,9,TILE_SIZE, sketch))
        walls.push(new Boundary(3,7,4,7,TILE_SIZE, sketch))
        walls.push(new Boundary(4,7,4,9,TILE_SIZE, sketch))
        walls.push(new Boundary(3,9,4,9,TILE_SIZE, sketch))
        walls.push(new Boundary(8,1,9,1, TILE_SIZE, sketch))
        walls.push(new Boundary(8,2,9,2, TILE_SIZE, sketch))
        walls.push(new Boundary(8,1,8,2, TILE_SIZE, sketch))
        walls.push(new Boundary(9,1,9,2, TILE_SIZE, sketch)) 
    
        player = new Particle(sketch.width/2, sketch.height/2-10, 360, 1, sketch)
    
        text_div_4 = sketch.createDiv(section_4_text[0])
            .attribute('class', 'section_text')
            .attribute('id', "text_div_4")
            .center('horizontal')
            // .position(0, sketch.height/3)
            .position(0, 0, "relative")
            // .style('opacity', 1)
            // .attribute('width', 22)
            .hide()

        fov_div = sketch.createDiv("Current FOV: " + slider.value())
            .attribute('class', 'section_text')
            .center('horizontal')
            // .position(30, sketch.height-25)
            .position(0,0, "relative")
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
            .style('border', '2px solid #DC143C')
            .size(50, 20)
            .mousePressed(() => {
                fullpage_api.moveTo('page3', 0);
            })
            .position(TILE_SIZE*MAP_NUM_COLS/2, 750)
            .hide()

        
        text_div_4.parent('#theory_4_text')
        next_button_4.parent('theory_4')
        prev_button_4.parent('theory_4')
        fov_div.parent("#theory_4_text")
        slider.parent("#theory_4_text")

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
        
        sketch.fill(0,200)
        sketch.rect(8*TILE_SIZE,1*TILE_SIZE, TILE_SIZE, TILE_SIZE)

        sketch.pop()
    }

    sketch.draw = () => {
        TILE_SIZE = ($(window).width()/2.5)/MAP_NUM_COLS;
        resize()

        draw_details()
        text_div_4.show()
        fov_div.show()

        next_button_4.show()
        prev_button_4.show()

        fov_div.html("Current FOV: " + slider.value())

        if (sketch.keyIsDown(sketch.LEFT_ARROW)) {
            player.rotate(-.03)
        }
        
        if (sketch.keyIsDown(sketch.RIGHT_ARROW)) {
            player.rotate(.03)
        }

        for (var wall of walls) {
            wall.render();
        }

        player.updateFOV(slider.value(), .5)
        player.look(walls)
        player.render(0)
    }

    function resize() {
        sketch.resizeCanvas(TILE_SIZE*MAP_NUM_COLS, TILE_SIZE*MAP_NUM_ROWS);
        // player.updatePos(x=sketch.width/2, y=sketch.height/2)
        for (var wall of walls) {
            wall.update_tile_size(TILE_SIZE)
        }
        next_button_4.position(TILE_SIZE*MAP_NUM_COLS/2 + 50, $(window).height()/2 + 50 + TILE_SIZE*MAP_NUM_ROWS/2)
        prev_button_4.position(TILE_SIZE*MAP_NUM_COLS/2 - 50, $(window).height()/2 + 50 + TILE_SIZE*MAP_NUM_ROWS/2)

    }
}

var theory_4_page = new p5(theory_4)