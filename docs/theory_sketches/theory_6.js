const theory_6 = ( sketch ) => {

    // const TILE_SIZE = 48;
    const MAP_NUM_ROWS = 11;
    const MAP_NUM_COLS = 15;
    var TILE_SIZE = ($(window).width()/2.7)/MAP_NUM_COLS;

    var CANVAS_HEIGHT = TILE_SIZE * MAP_NUM_ROWS
    var CANVAS_WIDTH = TILE_SIZE * MAP_NUM_COLS

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
    var fov_div_6;
    var density_div_6;
    
    
    const section_6_text = 
        [
            `<p>
               Now that we have our 3D render created, it becomes very easy to tweak some settings about our raycasting!
               Let's look at what happens when we change our FOV and ray density.
            </p>
            <p>
                When we change the FOV and keep the screen width fixed, a smaller FOV can make the screen
                look more zoomed in and a larger FOV will make it seem zoomed out.
            </p>
            <p>
                Then the ray density determines how many rays will be cast. A smaller ray density can create a nice
                retro effect and boost performance, while a larger density makes the view look much smoother.
            </p>
            <p>
                Try messing with the FOV and density of the rays with the sliders below and see how
                the 3D render gets changed!
            </p>
            <p>
                Then you can use the arrow keys and look around the world we have built!
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

        var slider1_min = .25
        var slider1_max = 10
        var slider1_start = .5
        var slider1_step = .25

        slider1 = sketch.createSlider(slider1_min, slider1_max, slider1_start, slider1_step)
        slider1.parent("#theory_6_slider1")

        slider1.addClass("fov_slider")
        slider1.attribute("list", "ticks1")

        var slider2_min = 10
        var slider2_max = 150
        var slider2_start = 90
        var slider2_step = 1

        slider2 = sketch.createSlider(slider2_min, slider2_max, slider2_start, slider2_step)
        slider2.parent("#theory_6_slider2")

        slider2.addClass("fov_slider")
        slider2.attribute("list", "ticks2")


        // World Boundaries
        walls.push(new Boundary_Color(1,1,MAP_NUM_COLS-1,1, 'rgb(0,255,0)', TILE_SIZE, sketch));
        walls.push(new Boundary_Color(MAP_NUM_COLS - 1, 1, MAP_NUM_COLS - 1, MAP_NUM_ROWS-1, 'rgb(0,150,0)',TILE_SIZE, sketch));
        walls.push(new Boundary_Color(MAP_NUM_COLS - 1, MAP_NUM_ROWS-1, 1, MAP_NUM_ROWS-1, 'rgb(0,255,0)', TILE_SIZE, sketch));
        walls.push(new Boundary_Color(1,MAP_NUM_ROWS-1, 1, 1, 'rgb(0,150,0)', TILE_SIZE, sketch));
        // Walls added last section, colored now
        walls.push(new Boundary_Color(4,3,7,3, 'rgb(255,0,0)', TILE_SIZE, sketch))
        walls.push(new Boundary_Color(4,4,7,4, 'rgb(255,0,0)', TILE_SIZE, sketch))
        walls.push(new Boundary_Color(4,3,4,4, 'rgb(255,0,0)', TILE_SIZE, sketch))
        walls.push(new Boundary_Color(7,3,7,4, 'rgb(100,0,0)', TILE_SIZE, sketch))    
        walls.push(new Boundary_Color(8,1,9,1, 'rgb(0,0,255)', TILE_SIZE, sketch))
        walls.push(new Boundary_Color(8,2,9,2, 'rgb(0,0,255)', TILE_SIZE, sketch))
        walls.push(new Boundary_Color(8,1,8,2, 'rgb(0,0,100)', TILE_SIZE, sketch))
        walls.push(new Boundary_Color(9,1,9,2, 'rgb(0,0,255)', TILE_SIZE, sketch))    
        walls.push(new Boundary_Color(3,7,3,9, 'rgb(150,0,0)', TILE_SIZE, sketch))
        walls.push(new Boundary_Color(3,7,4,7, 'rgb(255,0,0)', TILE_SIZE, sketch))
        walls.push(new Boundary_Color(4,7,4,9, 'rgb(150,0,0)', TILE_SIZE, sketch))
        walls.push(new Boundary_Color(3,9,4,9, 'rgb(150,0,0)', TILE_SIZE, sketch))    

   
        walls.push(new Boundary_Color(10,8,10,9, 'rgb(0,0,150)', TILE_SIZE, sketch))
        walls.push(new Boundary_Color(10,8,11,8, 'rgb(0,0,255)', TILE_SIZE, sketch))
        walls.push(new Boundary_Color(11,8,11,9, 'rgb(0,0,255)', TILE_SIZE, sketch))
        walls.push(new Boundary_Color(10,9,11,9, 'rgb(0,0,150)', TILE_SIZE, sketch))    
        walls.push(new Boundary_Color(11,7,11,8, 'rgb(0,0,150)', TILE_SIZE, sketch))
        walls.push(new Boundary_Color(11,7,12,7, 'rgb(0,0,255)', TILE_SIZE, sketch))
        // walls.push(new Boundary_Color(12*TILE_SIZE,7*TILE_SIZE,12*TILE_SIZE,8*TILE_SIZE, 'rgb(0,0,255)', sketch))
        // walls.push(new Boundary_Color(11*TILE_SIZE,8*TILE_SIZE,12*TILE_SIZE,8*TILE_SIZE, 'rgb(0,0,255)', sketch))    
        walls.push(new Boundary_Color(12,6,12,7, 'rgb(0,0,150)', TILE_SIZE, sketch))
        walls.push(new Boundary_Color(12,6,13,6, 'rgb(0,0,255)', TILE_SIZE, sketch))
        // walls.push(new Boundary_Color(13*TILE_SIZE,6*TILE_SIZE,13*TILE_SIZE,7*TILE_SIZE, 'rgb(0,0,255)', sketch))
        // walls.push(new Boundary_Color(12*TILE_SIZE,7*TILE_SIZE,13*TILE_SIZE,7*TILE_SIZE, 'rgb(0,0,150)', sketch))    


        player = new Particle(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, FOV, .5, sketch)

    text_div_6 = sketch.createDiv(section_6_text[0])
        .attribute('class', 'section_text')
        .center('horizontal')
        .attribute('id', "text_div_6")
        .position(0, sketch.height/5)
        // .attribute('width', 22)
        .hide()

    fov_div_6 = sketch.createDiv("Current FOV: " + slider2.value())
        .attribute('class', 'section_text')
        .center('horizontal')
        .position(0,0, "relative")
        .hide()

    density_div_6 = sketch.createDiv("Current Ray Density: " + slider1.value())
        .attribute('class', 'section_text')
        .center('horizontal')
        .position(0,0, "relative")
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
        density_div_6.parent("#text_div_6")
        slider1.parent("#text_div_6")
        fov_div_6.parent("#text_div_6")
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
        TILE_SIZE = ($(window).width()/2.7)/MAP_NUM_COLS;
        resize()
        draw_details()

        text_div_6.show()
        next_button_6.show()
        prev_button_6.show()
        fov_div_6.show()
        density_div_6.show()

        fov_div_6.html("Current FOV: " + slider2.value())
        density_div_6.html("Current Ray Density: " + slider1.value())

        if (sketch.keyIsDown(sketch.LEFT_ARROW)) {
            player.rotate(-.03)
        }
        
        if (sketch.keyIsDown(sketch.RIGHT_ARROW)) {
            player.rotate(.03)
        }

        if (sketch.keyIsDown(sketch.UP_ARROW)) {
            player.move(-1.5)
        }

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

    function resize() {
        sketch.resizeCanvas(TILE_SIZE*MAP_NUM_COLS, 1.5*TILE_SIZE*MAP_NUM_ROWS);
        player.updatePos(TILE_SIZE*MAP_NUM_COLS/2, TILE_SIZE*MAP_NUM_ROWS/2)
        CANVAS_HEIGHT = TILE_SIZE * MAP_NUM_ROWS
        CANVAS_WIDTH = TILE_SIZE * MAP_NUM_COLS
        for (var wall of walls) {
            wall.update_tile_size(TILE_SIZE)
        }

        next_button_6.position(TILE_SIZE*(MAP_NUM_COLS + 1)/2 + 50, $(window).height()/2  + 20 + 1.5*TILE_SIZE*MAP_NUM_ROWS/2)
        prev_button_6.position(TILE_SIZE*(MAP_NUM_COLS + 1)/2 - 25, $(window).height()/2 + 20 + 1.5*TILE_SIZE*MAP_NUM_ROWS/2)
    }
}

new p5(theory_6)