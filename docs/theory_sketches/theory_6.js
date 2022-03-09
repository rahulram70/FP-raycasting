const theory_6 = ( sketch ) => {

    const TILE_SIZE = 48;
    const MAP_NUM_ROWS = 11;
    const MAP_NUM_COLS = 15;

    const CANVAS_HEIGHT = TILE_SIZE * MAP_NUM_ROWS
    const CANVAS_WIDTH = TILE_SIZE * MAP_NUM_COLS

    const FOV = 90

    var player;
    var theory_6_canvas; 
    var walls = [];
    var slider1;
    var slider2;

    var dist

    var text_div_6;
    var next_button_6;
    var prev_button_6;
    
    const section_3_text = 
        [
            `<p>
                ADD TEXT EXPLAINING HOW CHANGE IN NUMBER OF RAYS CHANGES RESOLUTION
            </p>`,
        ]

    function render_3d(num_rays) {
        for (var i = 0; i < num_rays; i++) {
            dist = player.rays[i].len * Math.cos(player.rays[i].angle - player.heading)
            var lineHeight = .5*CANVAS_HEIGHT - (.5*CANVAS_HEIGHT - 48*.5*CANVAS_HEIGHT/dist) ;
                var drawStart = -lineHeight / 2 + (.5*CANVAS_HEIGHT) / 2;
                if (drawStart < 0)
                    drawStart = 0;
                var drawEnd   = lineHeight / 2 + .5*CANVAS_HEIGHT / 2;
                if (drawEnd >= .5*CANVAS_HEIGHT)
                    drawEnd = .5* CANVAS_HEIGHT - 1;
        
        
                sketch.push()
                sketch.noStroke();

                draw_x_step = ((CANVAS_WIDTH)/num_rays)
                sketch.fill(player.rays[i].color);
                sketch.rect(i*draw_x_step, CANVAS_HEIGHT + drawStart, Math.ceil(draw_x_step)+.1, drawEnd - drawStart);
                sketch.fill(60, 0, 0);
                sketch.rect(i*draw_x_step, CANVAS_HEIGHT, Math.ceil(draw_x_step)+.1, drawStart);
                sketch.fill(0, 0, 23);
                sketch.rect(i*draw_x_step, CANVAS_HEIGHT + drawEnd, Math.ceil(draw_x_step)+.1, .5*CANVAS_HEIGHT - drawEnd);
        
                // sketch.strokeWeight(2);
                sketch.pop()
        }
    }


    sketch.setup = () => {
        theory_6_canvas = sketch.createCanvas(TILE_SIZE * MAP_NUM_COLS, 1.5*TILE_SIZE*MAP_NUM_ROWS);
        theory_6_canvas.parent("theory_6");

        var slider1_min = .05
        var slider1_max = 10
        var slider1_start = .5
        var slider1_step = .25

        slider1 = sketch.createSlider(slider1_min, slider1_max, slider1_start, slider1_step)
        slider1.parent("#theory_6_slider1")

        var slider2_min = 10
        var slider2_max = 150
        var slider2_start = 90
        var slider2_step = 1

        slider2 = sketch.createSlider(slider2_min, slider2_max, slider2_start, slider2_step)
        slider2.parent("#theory_6_slider2")


        // World Boundaries
        walls.push(new Boundary_Color(TILE_SIZE,TILE_SIZE,sketch.width - TILE_SIZE,TILE_SIZE, 'rgb(0,255,0)', sketch));
        walls.push(new Boundary_Color(sketch.width - TILE_SIZE, TILE_SIZE, sketch.width - TILE_SIZE, CANVAS_HEIGHT - TILE_SIZE, 'rgb(0,150,0)',sketch));
        walls.push(new Boundary_Color(sketch.width - TILE_SIZE, CANVAS_HEIGHT - TILE_SIZE, TILE_SIZE, CANVAS_HEIGHT - TILE_SIZE, 'rgb(0,255,0)', sketch));
        walls.push(new Boundary_Color(TILE_SIZE, CANVAS_HEIGHT - TILE_SIZE, TILE_SIZE, TILE_SIZE, 'rgb(0,150,0)', sketch));

        // Walls added last section, colored now
        walls.push(new Boundary_Color(4*TILE_SIZE,3*TILE_SIZE,7*TILE_SIZE,3*TILE_SIZE, 'rgb(255,0,0)', sketch))
        walls.push(new Boundary_Color(4*TILE_SIZE,4*TILE_SIZE,7*TILE_SIZE,4*TILE_SIZE, 'rgb(255,0,0)', sketch))
        walls.push(new Boundary_Color(4*TILE_SIZE,3*TILE_SIZE,4*TILE_SIZE,4*TILE_SIZE, 'rgb(255,0,0)', sketch))
        walls.push(new Boundary_Color(7*TILE_SIZE,3*TILE_SIZE,7*TILE_SIZE,4*TILE_SIZE, 'rgb(100,0,0)', sketch))    
        walls.push(new Boundary_Color(8*TILE_SIZE,1*TILE_SIZE,9*TILE_SIZE,1*TILE_SIZE, 'rgb(0,0,255)', sketch))
        walls.push(new Boundary_Color(8*TILE_SIZE,2*TILE_SIZE,9*TILE_SIZE,2*TILE_SIZE, 'rgb(0,0,255)', sketch))
        walls.push(new Boundary_Color(8*TILE_SIZE,1*TILE_SIZE,8*TILE_SIZE,2*TILE_SIZE, 'rgb(0,0,100)', sketch))
        walls.push(new Boundary_Color(9*TILE_SIZE,1*TILE_SIZE,9*TILE_SIZE,2*TILE_SIZE, 'rgb(0,0,255)', sketch))    
        walls.push(new Boundary_Color(3*TILE_SIZE,7*TILE_SIZE,3*TILE_SIZE,9*TILE_SIZE, 'rgb(0,150,0)', sketch))
        walls.push(new Boundary_Color(3*TILE_SIZE,7*TILE_SIZE,4*TILE_SIZE,7*TILE_SIZE, 'rgb(0,255,0)', sketch))
        walls.push(new Boundary_Color(4*TILE_SIZE,7*TILE_SIZE,4*TILE_SIZE,9*TILE_SIZE, 'rgb(0,150,0)', sketch))
        walls.push(new Boundary_Color(3*TILE_SIZE,9*TILE_SIZE,4*TILE_SIZE,9*TILE_SIZE, 'rgb(0,150,0)', sketch))    

        player = new Particle(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, FOV, .5, sketch)

    text_div_6 = sketch.createDiv(section_3_text[0])
        .attribute('class', 'section_text')
        .center('horizontal')
        .attribute('id', "text_div_6")
        .position(0, sketch.height/3)
        // .attribute('width', 22)
        .hide()

    next_button_6 = sketch.createButton("Next")
        .attribute('class', 'button_next')
        .center('horizontal')
        .style('border', '2px solid #5cb85c')
        .size(50, 20)
        .mousePressed(() => {
            fullpage_api.moveTo('page7', 0);
        })
        .position(TILE_SIZE*MAP_NUM_COLS/2 + 100, 880)
        .hide()

    prev_button_6 = sketch.createButton("Back")
        .attribute('class', 'button_prev')
        .center('horizontal')
        .style('border', '2px solid #5bc0de')
        .size(50, 20)
        .mousePressed(() => {
            fullpage_api.moveTo('page5', 0);
        })
        .position(TILE_SIZE*MAP_NUM_COLS/2, 880)
        .hide()

        
        text_div_6.parent('#theory_6_text')
        next_button_6.parent('theory_6')
        prev_button_6.parent('theory_6')
        slider1.parent("#text_div_6")
        slider2.parent("#text_div_6")


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
        sketch.rect(8*TILE_SIZE,1*TILE_SIZE, TILE_SIZE, 1*TILE_SIZE)

        sketch.pop()
    }

    sketch.draw = () => {
        draw_details()

        text_div_6.show()
        next_button_6.show()
        prev_button_6.show()

        if (sketch.keyIsDown(sketch.LEFT_ARROW)) {
            player.rotate(-.03)
        }
        
        if (sketch.keyIsDown(sketch.RIGHT_ARROW)) {
            player.rotate(.03)
        }

        // if (sketch.keyIsDown(sketch.UP_ARROW)) {
        //     player.move(-2)
        // }

        for (var wall of walls) {
            wall.render();
        }
        player.updateFOV(slider2.value(), slider1.value())

        // player.rotate(.01)
        player.look(walls)
        render_3d(Math.floor(slider2.value() / slider1.value()))
        player.render(0)
        

        // interact_2()
    }

    // function windowResized() {
    //     resizeCanvas(windowWidth/2, windowHeight/2);
    // }
}

new p5(theory_6)