const theory_1 = ( sketch ) => {

    const MAP_NUM_ROWS = 11;
    const MAP_NUM_COLS = 15;
    var TILE_SIZE = ($(window).width()/3)/MAP_NUM_COLS;

    var player;
    var wallFade;
    var WallFadeAmount = 1;
    var playerFade;
    var playerFadeAmount = 1;
    var walls = [];
    var drawWalls = false
    var drawPlayer = false
    var theory_1_canvas;

    var curr_screen_1 = 0
    var text_div_1
    var next_button_1;
    var prev_button_1;
    var text_fade_1 = 0;
    
    const section_1_text = 
        [
            `<p>The first thing our game needs is a world! <br> 
            Right now we just have a blank canvas, so click on next to create our world. <br>
            </p>`,

            `<p>For now, it's pretty basic. We'll be making our world a grid, and if a grid cell is filled then there will exist a wall there, and otherwise its free space. <br>
            </p>
            <p>
            
            Currently, we just have a border around the edge of our world, but we'll add more soon enough!</p>`,

            `<p>Though, a world is hardly any fun without anyway to explore it. <br>
            So now let's make a player to represent us. </p>`,

            `<p>That's us! We're right now we're just a little dot in the center of our world. <br>
            </p>
            <p>
            Then, notice the little line sticking out from us, that will represent where our player is looking, right now we're looking towards the top of the screen<br>
            </p>
            <p>
            Though as it stands, we're blind and motionless...</p>
            
            <p>
            Hit next to move to the next steps!
            </p>`
        ]

    function updateDisplayText(text_div_1, curr_screen_1) {
        text_fade_1 = 0;
        drawPlayer = false;

        if (curr_screen_1 >= 1) {
            drawWalls = true;
        } else {
            drawWalls = false;
        }
        if (curr_screen_1 == 3) { 
            drawPlayer = true;
        }

        text_div_1.html(section_1_text[curr_screen_1])
    }

    sketch.setup = () => {
        theory_1_canvas = sketch.createCanvas(TILE_SIZE * MAP_NUM_COLS, TILE_SIZE*MAP_NUM_ROWS);
        theory_1_canvas.parent("theory_1");

        wallFade = 255;
        playerFade = 255;

        player = new Particle(x=sketch.width/2, y=sketch.height/2, 360, 1, sketch)

        text_div_1 = sketch.createDiv(section_1_text[0])
            .attribute('class', 'section_text')
            .center('horizontal')
            .position(0, sketch.height/3)
            .style('opacity', text_fade_1)
            // .attribute('width', 22)
            .hide()

        next_button_1 = sketch.createButton("Next")
            .attribute('class', 'button_next')
            .center('horizontal')
            .style('border', '2px solid #5cb85c')
            .size(50, 20)
            .mousePressed(() => {
                if (curr_screen_1 < section_1_text.length - 1) {
                    curr_screen_1++;
                    updateDisplayText(text_div_1, curr_screen_1);
                } else if (curr_screen_1 == section_1_text.length - 1) {
                    console.log($("fullPage"))
                    fullpage_api.moveTo('page2', 0);
                }
                console.log(curr_screen_1)
            })
            .position(TILE_SIZE*MAP_NUM_COLS/2 + 100, 750)
            .hide()

        prev_button_1 = sketch.createButton("Back")
            .attribute('class', 'button_prev')
            .center('horizontal')
            .style('border', '2px solid #5bc0de')
            .size(50, 20)
            .mousePressed(() => {
                if (curr_screen_1 == 0) {
                    fullpage_api.moveTo('page0', 0);
                }
                if (curr_screen_1 > 0) {
                    curr_screen_1--;
                    updateDisplayText(text_div_1, curr_screen_1);
                }
                console.log(curr_screen_1)
            })
            .position(TILE_SIZE*MAP_NUM_COLS/2, 750)
            .hide()

        
        text_div_1.parent('#theory_1_text')
        next_button_1.parent('theory_1')
        prev_button_1.parent('theory_1')
        sketch.noLoop()

    }

    function draw_details(opacity) {
        sketch.background(255);
        sketch.push()
        // sketch.stroke(0, 200);
        sketch.fill(opacity, 200)
        sketch.rect(0,0, TILE_SIZE*MAP_NUM_COLS, TILE_SIZE*MAP_NUM_ROWS)
        
        
        
        sketch.fill(255)
        sketch.rect(TILE_SIZE, TILE_SIZE, TILE_SIZE* (MAP_NUM_COLS - 2), TILE_SIZE*(MAP_NUM_ROWS - 2))
        sketch.pop()

        sketch.push()
        sketch.strokeWeight(1)
        sketch.stroke(opacity, 75);
        for (var col = 2; col < MAP_NUM_COLS-1; col++) {
            sketch.line(col * TILE_SIZE, TILE_SIZE, col*TILE_SIZE, TILE_SIZE*(MAP_NUM_ROWS-1))
        }
        for (var row = 2; row < MAP_NUM_ROWS-1; row++) {
            sketch.line(TILE_SIZE, row * TILE_SIZE, TILE_SIZE * (MAP_NUM_COLS - 1), row*TILE_SIZE)
        }
        sketch.pop()
    }

    sketch.draw = () => {
        console.log("hi!")
        TILE_SIZE = ($(window).width()/2.5)/MAP_NUM_COLS;
        windowResized()


        text_div_1.show()
        next_button_1.show()
        prev_button_1.show()

        text_div_1.style('opacity', text_fade_1)

        if (text_fade_1 < 1) {
            text_fade_1 += .07;
        }

        sketch.background(255);

        if (drawWalls) {
            for (var wall of walls) {
                wall.render(wallFade);
            }

            draw_details(wallFade)

            if (wallFade > 0) {
                wallFade -= 6*WallFadeAmount
            }
        } else if (wallFade < 255) {
            for (var wall of walls) {
                wall.render(wallFade);
            }

            draw_details(wallFade)

            wallFade += 6*WallFadeAmount
        }
        if (drawPlayer) {
            player.render(playerFade)

            if (playerFade > 0) {
                playerFade -= 6*playerFadeAmount
            }
        } else if (playerFade < 255) {
            player.render(playerFade)
            playerFade += 6*playerFadeAmount

        }
        // console.log("xd")
        // player.look(walls)
    }

    function windowResized() {
        sketch.resizeCanvas(TILE_SIZE*MAP_NUM_COLS, TILE_SIZE*MAP_NUM_ROWS);
        player.updatePos(x=sketch.width/2, y=sketch.height/2)
        next_button_1.position(TILE_SIZE*MAP_NUM_COLS/2 + 50, $(window).height()/2 + 50 + TILE_SIZE*MAP_NUM_ROWS/2)
        prev_button_1.position(TILE_SIZE*MAP_NUM_COLS/2 - 50, $(window).height()/2 + 50 + TILE_SIZE*MAP_NUM_ROWS/2)
    }
}

var theory_1_page = new p5(theory_1)