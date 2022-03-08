const theory_7 = ( sketch ) => {

    const TILE_SIZE = 48;
    const MAP_NUM_ROWS = 11;
    const MAP_NUM_COLS = 15;

    const CANVAS_HEIGHT = TILE_SIZE * MAP_NUM_ROWS
    const CANVAS_WIDTH = TILE_SIZE * MAP_NUM_COLS

    const FOV = 90

    var player;
    var theory_7_canvas; 
    var walls = [];
    var slider;

    var dist

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
        theory_7_canvas = sketch.createCanvas(TILE_SIZE * MAP_NUM_COLS, 1.5*TILE_SIZE*MAP_NUM_ROWS);
        theory_7_canvas.parent("theory_7");

        var slider_min = 10
        var slider_max = 150
        var slider_start = 90
        var slider_step = 1

        slider = sketch.createSlider(slider_min, slider_max, slider_start, slider_step)
        slider.parent("#theory_7_slider")

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
        player.updateFOV(slider.value(), .5)

        sketch.line(CANVAS_WIDTH/2 - 75, CANVAS_HEIGHT/2, CANVAS_WIDTH/2 + 75, CANVAS_HEIGHT/2)
        // player.rotate(.01)
        player.look(walls)
        render_3d(slider.value()*2)
        player.render(0)
        

        // interact_2()
    }

    // function windowResized() {
    //     resizeCanvas(windowWidth/2, windowHeight/2);
    // }
}

new p5(theory_7)