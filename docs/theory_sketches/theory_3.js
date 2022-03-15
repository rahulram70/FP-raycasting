const theory_3 = ( sketch ) => {

    // const TILE_SIZE = 48;
    const MAP_NUM_ROWS = 11;
    const MAP_NUM_COLS = 15;
    var TILE_SIZE = ($(window).width()/2.5)/MAP_NUM_COLS;

    var player;
    var walls = [];
    var theory_3_canvas; 
    var blocks_drawn;

    var curr_screen_3 = 0;
    var text_div_3;
    var next_button_3;
    var prev_button_3;
    var text_fade_3 = 0;
    
    const section_3_text = 
        [
            `<p>
                How much can we do with just one ray? Currently, we only know how far a wall is directly in front of us is. <br>
            </p>
            <p>
                Let's cast out more rays in more directions! Now we can get more information about the entire area surrounding us. <br>
            </p>
            <p>
                It's also just fun to look at, try moving your mouse around the screen and see how the rays react. <br>            
            </p>`,

            `<p>
                Our world is pretty boring as it stands. Click next to add some more walls. <br>
            </p>
            <p>
                Now try moving the player around. <br>
                Notice how the rays hitting the newly made walls don't cast past the first intersection. <br>            
            </p>
            <p>
               Like before, you can also rotate where the player is looking with the arrow keys,
                though since we're casting rays in all directions, this might not be very useful...
            </p>`,

            `<p>
                Let's add even more rays!
            <p>
            </p>
                We're recording the information for every ray we cast, so if we cast more, we'll be
                keeping track of more granular data. 
            </p>`,

        ]

    function updateDisplayText(text_div_3, curr_screen) {
        text_fade_3 = 0;
        drawPlayer = false;

        if (curr_screen >= 1) {
            drawRay = true
        } else {
            drawRay = false
            lineLen = 0;
            done = false;
        }

        text_div_3.html(section_3_text[curr_screen])
    }

    sketch.setup = () => {
        var block_1 = [
            new Boundary(4*1,3*1,7*1,3*1, TILE_SIZE, sketch),
            new Boundary(4*1,4*1,7*1,4*1, TILE_SIZE, sketch),
            new Boundary(4*1,3*1,4*1,4*1, TILE_SIZE, sketch),
            new Boundary(7*1,3*1,7*1,4*1, TILE_SIZE, sketch)
        ]
        var block_2 = [
            new Boundary(10,8,10,9, TILE_SIZE,sketch),
            new Boundary(10,8,11,8, TILE_SIZE,sketch),
            new Boundary(11,8,11,9, TILE_SIZE,sketch),
            new Boundary(10,9,11,9, TILE_SIZE,sketch)
        ]
        var block_3 = [
            new Boundary(11,7,11,8, TILE_SIZE,sketch),
            new Boundary(11,7,12,7, TILE_SIZE,sketch),
            new Boundary(12,7,12,8, TILE_SIZE,sketch),
            new Boundary(11,8,12,8, TILE_SIZE,sketch)
        ]
        var block_4 = [
            new Boundary(12,6,12,7, TILE_SIZE,sketch),
            new Boundary(12,6,13,6, TILE_SIZE,sketch),
            new Boundary(13,6,13,7, TILE_SIZE,sketch),
            new Boundary(12,7,13,7, TILE_SIZE,sketch)
        ]
        var block_5 = [
            new Boundary(3,7,3,9,TILE_SIZE, sketch),
            new Boundary(3,7,4,7,TILE_SIZE, sketch),
            new Boundary(4,7,4,9,TILE_SIZE, sketch),
            new Boundary(3,9,4,9,TILE_SIZE, sketch)
        ]
        var block_6 = [
            new Boundary(8,1,9,1, TILE_SIZE, sketch),
            new Boundary(8,2,9,2, TILE_SIZE, sketch),
            new Boundary(8,1,8,2, TILE_SIZE, sketch),
            new Boundary(9,1,9,2, TILE_SIZE, sketch)
        ]

        blocks_drawn = 0

        theory_3_canvas = sketch.createCanvas(TILE_SIZE * MAP_NUM_COLS, TILE_SIZE*MAP_NUM_ROWS);
        theory_3_canvas.parent("theory_3");

        // sketch.select('#theory_3_interact_2').mouseClicked(function() { 
        //     player.updateFOV(360, 1)   
        // })
        

        walls.push(new Boundary(1,1,MAP_NUM_COLS-1,1, TILE_SIZE, sketch));
        walls.push(new Boundary(MAP_NUM_COLS - 1, 1, MAP_NUM_COLS - 1, MAP_NUM_ROWS-1,TILE_SIZE, sketch));
        walls.push(new Boundary(MAP_NUM_COLS - 1, MAP_NUM_ROWS-1, 1, MAP_NUM_ROWS-1, TILE_SIZE, sketch));
        walls.push(new Boundary(1,MAP_NUM_ROWS-1, 1, 1, TILE_SIZE, sketch));

        player = new Particle(sketch.width/2, sketch.height/2, 360, 10, sketch)

        
        text_div_3 = sketch.createDiv(section_3_text[0])
            .attribute('class', 'section_text')
            .center('horizontal')
            .position(0, 0, "relative")
            .style('opacity', text_fade_3)
            // .attribute('width', 22)
            .hide()

        next_button_3 = sketch.createButton("Next")
            .attribute('class', 'button_next')
            .center('horizontal')
            .style('border', '2px solid #5cb85c')
            .size(50, 20)
            .mousePressed(() => {

                if (curr_screen_3 === 1) {
                    if(blocks_drawn === 6) {
                        curr_screen_3++;
                        updateDisplayText(text_div_3, curr_screen_3);
                    } else {
                        switch (blocks_drawn) {
                            case 0:
                                for (var wall of block_1){
                                    walls.push(wall)
                                }   
                                break;
                            case 1:
                                for (var wall of block_2){
                                    walls.push(wall)
                                }   
                                break;
                            case 2:
                                for (var wall of block_3){
                                    walls.push(wall)
                                }
                                break;   
                            case 3:
                                for (var wall of block_4){
                                    walls.push(wall)
                                }
                                break;
                            case 4:
                                for (var wall of block_5){
                                    walls.push(wall)
                                }
                                break;    
                            case 5:
                                for (var wall of block_6) {
                                    walls.push(wall)
                                }
                        }
                        blocks_drawn++
                    }
                } else if (curr_screen_3 < section_3_text.length - 1) {
                    curr_screen_3++;
                    updateDisplayText(text_div_3, curr_screen_3);
                } else if (curr_screen_3 == section_3_text.length - 1) {
                    fullpage_api.moveTo('page4', 0);
                }
                if (curr_screen_3 == 2) {
                    player.updateFOV(360, 1)   
                }
            })
            .position(TILE_SIZE*MAP_NUM_COLS/2 + 100, 750)
            .hide()

        prev_button_3 = sketch.createButton("Back")
            .attribute('class', 'button_prev')
            .center('horizontal')
            .style('border', '2px solid #DC143C')
            .size(50, 20)
            .mousePressed(() => {
                if (curr_screen_3 === 1) {
                    if (blocks_drawn > 0) {
                        blocks_drawn--;
                        walls.pop()
                        walls.pop()
                        walls.pop()
                        walls.pop()
                    } else {
                        curr_screen_3--;
                        updateDisplayText(text_div_3, curr_screen_3);
                    }
                } else if (curr_screen_3 > 0) {
                    curr_screen_3--;
                    updateDisplayText(text_div_3, curr_screen_3);
                } else if (curr_screen_3 === 0) {
                    fullpage_api.moveTo('page2', 0);
                }
                if (curr_screen_3 < 2) {
                    player.updateFOV(360, 10)   
                }
            })
            .position(TILE_SIZE*MAP_NUM_COLS/2, 750)
            .hide()

        
        text_div_3.parent('#theory_3_text')
        next_button_3.parent('theory_3')
        prev_button_3.parent('theory_3')
        sketch.noLoop()

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
        TILE_SIZE = ($(window).width()/2.5)/MAP_NUM_COLS;
        resize()

        draw_details()

        text_div_3.show()
        next_button_3.show()
        prev_button_3.show()

        text_div_3.style('opacity', text_fade_3)

        if (text_fade_3 < 1) {
            text_fade_3 += .07;
        }


        if (blocks_drawn > 0) {
            sketch.push()
            sketch.fill(0,200)
            sketch.rect(4*TILE_SIZE,3*TILE_SIZE,3*TILE_SIZE, TILE_SIZE)
            sketch.pop()
        }
        if (blocks_drawn > 1) {
            sketch.push()
            sketch.fill(0,200)
            sketch.rect(10*TILE_SIZE,8*TILE_SIZE, TILE_SIZE, TILE_SIZE)
            sketch.pop()
        }
        if (blocks_drawn > 2) {
            sketch.push()
            sketch.fill(0,200)
            sketch.rect(11*TILE_SIZE,7*TILE_SIZE, TILE_SIZE, TILE_SIZE)
            sketch.pop()
        }
        if (blocks_drawn > 3) {
            sketch.push()
            sketch.fill(0,200)
            sketch.rect(12*TILE_SIZE,6*TILE_SIZE, TILE_SIZE, TILE_SIZE)
            sketch.pop()
        }
        if (blocks_drawn > 4) {
            sketch.push()
            sketch.fill(0,200)
            sketch.rect(3*TILE_SIZE,7*TILE_SIZE, TILE_SIZE, 2*TILE_SIZE)
            sketch.pop()
        }
        if (blocks_drawn > 5) {
            sketch.push()
            sketch.fill(0,200)
            sketch.rect(8*TILE_SIZE,1*TILE_SIZE, TILE_SIZE, TILE_SIZE)
            sketch.pop()
        }

        if (sketch.keyIsDown(sketch.LEFT_ARROW)) {
            player.rotate(-.03)
        }
        
        if (sketch.keyIsDown(sketch.RIGHT_ARROW)) {
            player.rotate(.03)
        }


        for (var wall of walls) {
            wall.render();
        }

        player.updatePos(sketch.mouseX, sketch.mouseY)

        player.look(walls)


        player.render(0)
        sketch.push()
        sketch.noStroke()
        sketch.fill(255)
        sketch.rect(0,0, TILE_SIZE*MAP_NUM_COLS, TILE_SIZE)
        sketch.fill(0,200)
        sketch.rect(0,0, TILE_SIZE*MAP_NUM_COLS, TILE_SIZE)
        sketch.fill(255)
        sketch.rect(0,0, TILE_SIZE, TILE_SIZE*MAP_NUM_ROWS)
        sketch.fill(0,200)
        sketch.rect(0,0, TILE_SIZE, TILE_SIZE*MAP_NUM_ROWS)
        sketch.fill(255)
        sketch.rect(TILE_SIZE*(MAP_NUM_COLS-1),0, TILE_SIZE, TILE_SIZE*MAP_NUM_ROWS)
        sketch.fill(0,200)
        sketch.rect(TILE_SIZE*(MAP_NUM_COLS-1),0, TILE_SIZE, TILE_SIZE*MAP_NUM_ROWS)
        sketch.fill(255)
        sketch.rect(0,TILE_SIZE * (MAP_NUM_ROWS-1), TILE_SIZE*MAP_NUM_COLS, TILE_SIZE)
        sketch.fill(0,200)
        sketch.rect(0,TILE_SIZE * (MAP_NUM_ROWS-1), TILE_SIZE*MAP_NUM_COLS, TILE_SIZE)
        sketch.pop()
        if (blocks_drawn > 0) {
            sketch.push()
            sketch.fill(255)
            sketch.rect(4*TILE_SIZE,3*TILE_SIZE,3*TILE_SIZE, TILE_SIZE)
            sketch.fill(0,200)
            sketch.rect(4*TILE_SIZE,3*TILE_SIZE,3*TILE_SIZE, TILE_SIZE)
            sketch.pop()
        }
        if (blocks_drawn > 1) {
            sketch.push()
            sketch.fill(255)
            sketch.rect(10*TILE_SIZE,8*TILE_SIZE, TILE_SIZE, TILE_SIZE)
            sketch.fill(0,200)
            sketch.rect(10*TILE_SIZE,8*TILE_SIZE, TILE_SIZE, TILE_SIZE)
            sketch.pop()
        }
        if (blocks_drawn > 2) {
            sketch.push()
            sketch.fill(255)
            sketch.rect(11*TILE_SIZE,7*TILE_SIZE, TILE_SIZE, TILE_SIZE)
            sketch.fill(0,200)
            sketch.rect(11*TILE_SIZE,7*TILE_SIZE, TILE_SIZE, TILE_SIZE)
            sketch.pop()
        }
        if (blocks_drawn > 3) {
            sketch.push()
            sketch.fill(255)
            sketch.rect(12*TILE_SIZE,6*TILE_SIZE, TILE_SIZE, TILE_SIZE)
            sketch.fill(0,200)
            sketch.rect(12*TILE_SIZE,6*TILE_SIZE, TILE_SIZE, TILE_SIZE)
            sketch.pop()
        }
        if (blocks_drawn > 4) {
            sketch.push()
            sketch.fill(255)
            sketch.rect(3*TILE_SIZE,7*TILE_SIZE, TILE_SIZE, 2*TILE_SIZE)
            sketch.fill(0,200)
            sketch.rect(3*TILE_SIZE,7*TILE_SIZE, TILE_SIZE, 2*TILE_SIZE)
            sketch.pop()
        }
    }
    
    function resize() {
        sketch.resizeCanvas(TILE_SIZE*MAP_NUM_COLS, TILE_SIZE*MAP_NUM_ROWS);
        player.updatePos(x=sketch.width/2, y=sketch.height/2)
        for (var wall of walls) {
            wall.update_tile_size(TILE_SIZE)
        }
        next_button_3.position(TILE_SIZE*MAP_NUM_COLS/2 + 50, $(window).height()/2 + 50 + TILE_SIZE*MAP_NUM_ROWS/2)
        prev_button_3.position(TILE_SIZE*MAP_NUM_COLS/2 - 50, $(window).height()/2 + 50 + TILE_SIZE*MAP_NUM_ROWS/2)
    }

}

var theory_3_page = new p5(theory_3)