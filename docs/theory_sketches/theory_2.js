const theory_2 = ( sketch ) => {

    // const TILE_SIZE = 48;
    const MAP_NUM_ROWS = 11;
    const MAP_NUM_COLS = 15;
    var TILE_SIZE = ($(window).width()/2.5)/MAP_NUM_COLS;

    var player;
    var walls = [];
    var lineLen = 0;
    var drawRay = false
    var done = false
    var theory_2_canvas; 
    var e = new p5.Ease()

    var curr_screen_2 = 0
    var text_div_2
    var next_button_2;
    var prev_button_2;
    var text_fade_2 = 0;
    
    const section_2_text = 
        [
            `<p>
                In this world, we will use our distance from our surroundings to construct our first person view. <br>
            </p>`,

            `<p>
                To do this, let's cast a ray out from ourself and stop it once it hits a wall. <br>
            </p>
            <p>
                For now let's keep track of this length, it will come in handly later.
            </p>`
            ,

            `<p>
                Of course, this wouldn't be very useful if we couldn't move or look around. <br>
                Try and move and look around with the arrow keys on your keyboard! <br>

            </p>
            <p>
                We already have some sort of game made by casting rays! Though it's not very fun...
                And we don't have a first person view! This will come soon enough, let's continue. 
            </p>`,
        ]

    function updateDisplayText(text_div_2, curr_screen) {
        text_fade_2 = 0;
        drawPlayer = false;

        if (curr_screen >= 1) {
            drawRay = true
        } else {
            drawRay = false
            lineLen = 0;
            done = false;
        }

        text_div_2.html(section_2_text[curr_screen])
    }

    sketch.setup = () => {
        theory_2_canvas = sketch.createCanvas(TILE_SIZE * MAP_NUM_COLS, TILE_SIZE*MAP_NUM_ROWS);
        theory_2_canvas.parent("theory_2");
        
        walls.push(new Boundary(1,1,MAP_NUM_COLS-1,1, TILE_SIZE, sketch));
        walls.push(new Boundary(MAP_NUM_COLS - 1, 1, MAP_NUM_COLS - 1, MAP_NUM_ROWS-1,TILE_SIZE, sketch));
        walls.push(new Boundary(MAP_NUM_COLS - 1, MAP_NUM_ROWS-1, 1, MAP_NUM_ROWS-1, TILE_SIZE, sketch));
        walls.push(new Boundary(1,MAP_NUM_ROWS-1, 1, 1, TILE_SIZE, sketch));

        player = new Particle(sketch.width/2, sketch.height/2, 1, 1, sketch)

        text_div_2 = sketch.createDiv(section_2_text[0])
            .attribute('class', 'section_text')
            .center('horizontal')
            .position(0, 0, "relative")
            .style('opacity', text_fade_2)
            // .attribute('width', 22)
            .hide()

        next_button_2 = sketch.createButton("Next")
            .attribute('class', 'button_next')
            .center('horizontal')
            .style('border', '2px solid #5cb85c')
            .size(50, 20)
            .mousePressed(() => {
                if (curr_screen_2 < section_2_text.length - 1) {
                    curr_screen_2++;
                    updateDisplayText(text_div_2, curr_screen_2);
                } else if (curr_screen_2 == section_2_text.length - 1) {
                    fullpage_api.moveTo('page3', 0);
                }
            })
            .position(TILE_SIZE*MAP_NUM_COLS/2 + 100, 750)
            .hide()

        prev_button_2 = sketch.createButton("Back")
            .attribute('class', 'button_prev')
            .center('horizontal')
            .style('border', '2px solid #5bc0de')
            .size(50, 20)
            .mousePressed(() => {
                if (curr_screen_2 > 0) {
                    curr_screen_2--;
                    updateDisplayText(text_div_2, curr_screen_2);
                } else if (curr_screen_2 === 0) {
                    fullpage_api.moveTo('page1', 0);
                }
            })
            .position(TILE_SIZE*MAP_NUM_COLS/2, 750)
            .hide()

        
        text_div_2.parent('#theory_2_text')
        next_button_2.parent('theory_2')
        prev_button_2.parent('theory_2')
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
    }

    sketch.draw = () => {
        // console.log("hi!")
        TILE_SIZE = ($(window).width()/2.5)/MAP_NUM_COLS;
        resize()
        draw_details()
        text_div_2.show()
        next_button_2.show()
        prev_button_2.show()

        text_div_2.style('opacity', text_fade_2)

        if (text_fade_2 < 1) {
            text_fade_2 += .07;
        }


        if (done) {
            if (sketch.keyIsDown(sketch.LEFT_ARROW)) {
                player.rotate(-.03)
            }
            
            if (sketch.keyIsDown(sketch.RIGHT_ARROW)) {
                player.rotate(.03)
            }

            if (sketch.keyIsDown(sketch.UP_ARROW)) {
                player.move(-1)
            }

            if (sketch.keyIsDown(sketch.DOWN_ARROW)) {
                player.move(1)
            }
        }
        for (var wall of walls) {
            wall.render();
        }
        if (drawRay && !done) {
            sketch.push()
            sketch.stroke('red')
            sketch.line(player.pos.x, player.pos.y, player.pos.x, player.pos.y - (sketch.height/2 - TILE_SIZE) * e.cubicInOut(lineLen))
            sketch.pop()
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

    function resize() {
        sketch.resizeCanvas(TILE_SIZE*MAP_NUM_COLS, TILE_SIZE*MAP_NUM_ROWS);
        player.updatePos(x=sketch.width/2, y=sketch.height/2)
        for (var wall of walls) {
            wall.update_tile_size(TILE_SIZE)
        }
        next_button_2.position(TILE_SIZE*MAP_NUM_COLS/2 + 50, $(window).height()/2 + 50 + TILE_SIZE*MAP_NUM_ROWS/2)
        prev_button_2.position(TILE_SIZE*MAP_NUM_COLS/2 - 50, $(window).height()/2 + 50 + TILE_SIZE*MAP_NUM_ROWS/2)
    }

}

var theory_2_page = new p5(theory_2)