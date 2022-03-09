const theory_5 = ( sketch ) => {

    const TILE_SIZE = 48;
    const MAP_NUM_ROWS = 11;
    const MAP_NUM_COLS = 15;

    const FOV =  90
    var NUM_RAYS = FOV * 2;

    const CANVAS_HEIGHT = TILE_SIZE * MAP_NUM_ROWS
    const CANVAS_WIDTH = TILE_SIZE * MAP_NUM_COLS

    var player;
    var theory_5_canvas; 
    var walls = [];
    var e = new p5.Ease()

    var curr_screen_5 = 0
    var text_div_5
    var next_button_5;
    var prev_button_5;
    var toggle_button;
    var text_fade_5 = 0;
    
    const section_5_text = 
        [
            `<p>
            Now that all of our pieces are in place, let's start creating our first person view! <br>
            For this section, we will be sticking with a fixed field of view of 90, and casting 180 rays in this view.
            </p>`,

            `<p>
                Let's first consider the very first ray cast out, the ray pointing furthest to the left. <br>
                We will take this rays distance from the player, and draw it below in our first person view, which we will put below. <br>
                We will use red to represent the color of the wall, and darker colors to represent the floor and ceiling.
            </p>`,

            `<p>
                Now, let's cast the ray out again, this time actually drawing how our player will see what this ray is casting to. <br> 
                Notice how as the ray casts further out, the wall appears to get smaller. This is simulating the wall appearing further away! 
            </p>`,

            `<p>
                However, this is just one of the 180 different rays being cast in this small field of view. <br>
                Our view would be huge if we considered all of these rays as this size! <br>
                Let's scale down this ray's contribution to our view to its correct size.
            </p>`,

            `<p>
                Then, we're drawing the leftmost ray aren't we? It shouldn't appear in the very middle of our view! <br>
                Let's move it where it should be.
            </p>`,

            `<p>
                Now, let's repeat these steps again for ALL of the rays in our field of view. <br>
                Of course, we'll be skipping to the final render size and position. <br>
                The wall on our left will be red, the world border will be green, and the wall right next to the world border will be blue.
            </p>`,

            `<p>
                Our view looks a little skewed doesn't it? <br>
                Look at the red wall in particular. We are standing, looking straight on towards the wall but it the parts of the wall on the left most part of our screen look smaller? <br>
                
                This is called the fisheye effect. This is because the distance we are using to calculate the size of the wall on our first person render is the true distance of the ray being cast <br>
                But look! The rays at an angle further away from where we are looking will be longer than ones at a smaller angle when looking at a wall perpendicular to us. <br>
                
                Let's introduce the camera plane. The camera plane is a plane perpendicular to where we are looking and represents the screen that our first person view is being displayed on. <br>
                EXPLKAIN THIS BETTER <br>
                Instead, we will use this distance, the perpendicular distance from the camera plane, instead of the true distance of the ray.
            </p>`,

            `<p>
                Look at how our view updates when we use this perpendicular distance instead of the true ray length. <br>

                Try toggling back and forth to really see the difference between our adjusted view and the fisheye
            </p>`
        ]

    function updateDisplayText(text_div_5, curr_screen_5) {
        text_fade_5 = 0;


        text_div_5.html(section_5_text[curr_screen_5])
    }
    
    var lineLen = 0;
    var interaction_1_start = false;
    var interaction_1_done = false;
    var interaction_1_ray
    function interact_1() {
        if (!interaction_1_done) {
            if (lineLen > 1) {
                interaction_1_done = true
            }

            sketch.push()
            sketch.stroke('green')
            sketch.strokeWeight(2)
            sketch.line(player.pos.x, 
                        player.pos.y, 
                        player.pos.x - (player.pos.x - interaction_1_ray.dest_pos.x)*e.cubicInOut(lineLen), 
                        player.pos.y - (player.pos.y - interaction_1_ray.dest_pos.y)*e.cubicInOut(lineLen))
                
            sketch.pop()
    
            lineLen += .01
        } else {
            sketch.push()
            sketch.stroke('green')
            sketch.strokeWeight(2)
            sketch.line(player.pos.x, 
                        player.pos.y, 
                        interaction_1_ray.dest_pos.x, 
                        interaction_1_ray.dest_pos.y)
            sketch.pop()
        }
    }

    var dist

    function interact_2() {
        for (var i = 0; i < 240; i++) {
            dist = player.rays[i].len * Math.cos(player.rays[i].angle - player.heading)
            var lineHeight = 48*(CANVAS_HEIGHT) / dist;
        
            var drawStart = -lineHeight / 2 + (CANVAS_HEIGHT) / 2;
            if (drawStart < 0)
                drawStart = 0;
            var drawEnd   = lineHeight / 2 + CANVAS_HEIGHT / 2;
            if (drawEnd >= CANVAS_HEIGHT)
                drawEnd = CANVAS_HEIGHT - 1;

        
            sketch.noStroke();
            // sketch.strokeWeight(4);
            sketch.fill(player.rays[i].color);
            
            sketch.rect((i*2), drawStart, 2, drawEnd - drawStart);
            sketch.fill(60, 0, 0);
            sketch.rect((i*2), 0, 2, drawStart);
            sketch.fill(0, 0, 23);
            sketch.rect((i*2), drawEnd, 2, TILE_SIZE*MAP_NUM_ROWS);
            // sketch.rect((i*4), (drawStart-TILE_SIZE), 0, (drawEnd-drawStart)+TILE_SIZE);
            // sketch.stroke(0);
            // sketch.rect((i*4), 0, 0, (drawStart));
            // sketch.stroke(255);
            // sketch.rect((i*4), (drawEnd), 0, TILE_SIZE*MAP_NUM_ROWS);
            sketch.strokeWeight(2);
        }
    }

    var interaction_3_len = 0
    var interaction_3_start = false;
    var interaction_3_done = false;
    function interact_3() {
        // dist = interaction_1_ray.len * Math.cos(interaction_1_ray.angle - player.heading)
        dist = interaction_1_ray.len
        if (!interaction_3_done) {
            if (interaction_3_len > 1) {
                interaction_3_done = true
            }

            sketch.push()
            sketch.stroke('green')
            sketch.strokeWeight(2)
            sketch.line(player.pos.x, 
                        player.pos.y, 
                        player.pos.x - (player.pos.x - interaction_1_ray.dest_pos.x)*e.cubicInOut(interaction_3_len), 
                        player.pos.y - (player.pos.y - interaction_1_ray.dest_pos.y)*e.cubicInOut(interaction_3_len))
                
            sketch.pop()
    
            interaction_3_len += .01
        } else {
            sketch.push()
            sketch.stroke('green')
            sketch.strokeWeight(2)
            sketch.line(player.pos.x, 
                        player.pos.y, 
                        interaction_1_ray.dest_pos.x, 
                        interaction_1_ray.dest_pos.y)
            sketch.pop()
        }

        var interaction_height = .5*CANVAS_HEIGHT - e.cubicInOut(interaction_3_len)*(.5*CANVAS_HEIGHT - 48*.5*CANVAS_HEIGHT/dist) ;
        var drawStart = -interaction_height / 2 + (.5*CANVAS_HEIGHT) / 2;
        if (drawStart < 0)
            drawStart = 0;
        var drawEnd   = interaction_height / 2 + .5*CANVAS_HEIGHT / 2;
        if (drawEnd >= .5*CANVAS_HEIGHT)
            drawEnd = .5* CANVAS_HEIGHT - 1;


        sketch.push()
        sketch.noStroke();

        sketch.fill(interaction_1_ray.color);
        
        sketch.rect(CANVAS_WIDTH/2-60, CANVAS_HEIGHT + drawStart, 120, CANVAS_HEIGHT + drawEnd - drawStart);
        sketch.fill(60, 0, 0);
        sketch.rect(CANVAS_WIDTH/2-60, CANVAS_HEIGHT, 120, drawStart);
        sketch.fill(0, 0, 23);
        sketch.rect(CANVAS_WIDTH/2-60, CANVAS_HEIGHT + drawEnd, 120, .5*CANVAS_HEIGHT - drawEnd);

        sketch.strokeWeight(2);
        sketch.pop()
    }


    var interaction_4_width = 0
    var interaction_4_start = false;
    var interaction_4_done = false;
    var interaction_4_reset = false;
    function interact_4() {
        sketch.push()
        sketch.stroke('green')
        sketch.strokeWeight(2)
        sketch.line(player.pos.x, 
                    player.pos.y, 
                    interaction_1_ray.dest_pos.x, 
                    interaction_1_ray.dest_pos.y)
        sketch.pop()
        dist = interaction_1_ray.len

        var interaction_height = 48*.5*CANVAS_HEIGHT/dist ;
        var drawStart = -interaction_height / 2 + (.5*CANVAS_HEIGHT) / 2;
        if (drawStart < 0)
            drawStart = 0;
        var drawEnd   = interaction_height / 2 + .5*CANVAS_HEIGHT / 2;
        if (drawEnd >= .5*CANVAS_HEIGHT)
            drawEnd = .5* CANVAS_HEIGHT - 1;

        if (!interaction_4_done) {
            if (interaction_4_width > 119) {
                interaction_4_done = true
            }


            sketch.push()
            sketch.noStroke();
            sketch.fill(interaction_1_ray.color);
            sketch.rect(CANVAS_WIDTH/2-(60 - e.cubicInOut(interaction_4_width/120) * interaction_4_width/2), CANVAS_HEIGHT + drawStart, 120-e.cubicInOut(interaction_4_width/120) * interaction_4_width, CANVAS_HEIGHT + drawEnd - drawStart);
            sketch.fill(60, 0, 0);
            sketch.rect(CANVAS_WIDTH/2-(60 - e.cubicInOut(interaction_4_width/120) * interaction_4_width/2), CANVAS_HEIGHT, 120-e.cubicInOut(interaction_4_width/120) * interaction_4_width, drawStart);
            sketch.fill(0, 0, 23);
            sketch.rect(CANVAS_WIDTH/2-(60 - e.cubicInOut(interaction_4_width/120) * interaction_4_width/2), CANVAS_HEIGHT + drawEnd, 120-e.cubicInOut(interaction_4_width/120) * interaction_4_width, .5*CANVAS_HEIGHT - drawEnd);
    
            sketch.strokeWeight(2);
            sketch.pop()

            interaction_4_width += 2
        } 
        if (interaction_4_reset) {
            if (interaction_4_width > 0) {
                sketch.push()
                sketch.noStroke();
                sketch.fill(interaction_1_ray.color);
                sketch.rect(CANVAS_WIDTH/2-(60 - e.cubicInOut(interaction_4_width/120) * interaction_4_width/2), CANVAS_HEIGHT + drawStart, 120-e.cubicInOut(interaction_4_width/120) * interaction_4_width, CANVAS_HEIGHT + drawEnd - drawStart);
                sketch.fill(60, 0, 0);
                sketch.rect(CANVAS_WIDTH/2-(60 - e.cubicInOut(interaction_4_width/120) * interaction_4_width/2), CANVAS_HEIGHT, 120-e.cubicInOut(interaction_4_width/120) * interaction_4_width, drawStart);
                sketch.fill(0, 0, 23);
                sketch.rect(CANVAS_WIDTH/2-(60 - e.cubicInOut(interaction_4_width/120) * interaction_4_width/2), CANVAS_HEIGHT + drawEnd, 120-e.cubicInOut(interaction_4_width/120) * interaction_4_width, .5*CANVAS_HEIGHT - drawEnd);
        
                sketch.strokeWeight(2);
                sketch.pop()
            } else {
                interaction_4_reset = false
                interaction_4_done = false;
            }

            interaction_4_width -= 2

        } if (interaction_4_done) {
            sketch.push()
            sketch.noStroke();
            sketch.fill(interaction_1_ray.color);
            sketch.rect(CANVAS_WIDTH/2-1, CANVAS_HEIGHT + drawStart, 2, CANVAS_HEIGHT + drawEnd - drawStart);
            sketch.fill(60, 0, 0);
            sketch.rect(CANVAS_WIDTH/2-1, CANVAS_HEIGHT, 2, drawStart);
            sketch.fill(0, 0, 23);
            sketch.rect(CANVAS_WIDTH/2-1, CANVAS_HEIGHT + drawEnd, 2, .5*CANVAS_HEIGHT - drawEnd);
    
            sketch.strokeWeight(2);
            sketch.pop()
        }
    }

    var interaction_5_pos = 0
    var interaction_5_start = false;
    var interaction_5_done = false;
    function interact_5() {
        sketch.push()
        sketch.stroke('green')
        sketch.strokeWeight(2)
        sketch.line(player.pos.x, 
                    player.pos.y, 
                    interaction_1_ray.dest_pos.x, 
                    interaction_1_ray.dest_pos.y)
        sketch.pop()
        // dist = interaction_1_ray.len * Math.cos(interaction_1_ray.angle - player.heading)
        dist = interaction_1_ray.len

        var interaction_height = 48*.5*CANVAS_HEIGHT/dist ;
        var drawStart = -interaction_height / 2 + (.5*CANVAS_HEIGHT) / 2;
        if (drawStart < 0)
            drawStart = 0;
        var drawEnd   = interaction_height / 2 + .5*CANVAS_HEIGHT / 2;
        if (drawEnd >= .5*CANVAS_HEIGHT)
            drawEnd = .5* CANVAS_HEIGHT - 1;

        if (!interaction_5_done) {
            if (interaction_5_pos > CANVAS_WIDTH/2 - 2) {
                interaction_5_done = true
            }

            
            sketch.push()
            sketch.noStroke();
            sketch.fill(interaction_1_ray.color);
            console.log(e.cubicInOut(interaction_5_pos/(CANVAS_WIDTH/2)))
            sketch.rect(CANVAS_WIDTH/2 - CANVAS_WIDTH/2*e.cubicInOut(interaction_5_pos/(CANVAS_WIDTH/2))-1, CANVAS_HEIGHT + drawStart, 2, CANVAS_HEIGHT + drawEnd - drawStart);
            sketch.fill(60, 0, 0);
            sketch.rect(CANVAS_WIDTH/2 - CANVAS_WIDTH/2*e.cubicInOut(interaction_5_pos/(CANVAS_WIDTH/2))-1, CANVAS_HEIGHT, 2, drawStart);
            sketch.fill(0, 0, 23);
            sketch.rect(CANVAS_WIDTH/2 - CANVAS_WIDTH/2*e.cubicInOut(interaction_5_pos/(CANVAS_WIDTH/2))-1, CANVAS_HEIGHT + drawEnd, 2, .5*CANVAS_HEIGHT - drawEnd);
    
            sketch.strokeWeight(2);
            sketch.pop()

            interaction_5_pos += 4
        } else {
            sketch.push()
            sketch.noStroke();
            sketch.fill(interaction_1_ray.color);
            sketch.rect(0, CANVAS_HEIGHT + drawStart, 2, CANVAS_HEIGHT + drawEnd - drawStart);
            sketch.fill(60, 0, 0);
            sketch.rect(0, CANVAS_HEIGHT, 2, drawStart);
            sketch.fill(0, 0, 23);
            sketch.rect(0, CANVAS_HEIGHT + drawEnd, 2, .5*CANVAS_HEIGHT - drawEnd);

            sketch.strokeWeight(2);
            sketch.pop()
        }
    }

    var interaction_6_cur_ray = 1
    var interaction_6_len = 0
    var interaction_6_start = false;
    var interaction_6_done = false;
    function interact_6() {

        // dist = player.rays[interaction_6_cur_ray].len * Math.cos(player.rays[interaction_6_cur_ray].angle - player.heading)
        dist = player.rays[interaction_6_cur_ray].len

        if (!interaction_6_done) {
            for (var i = 0; i <= interaction_6_cur_ray; i++) {
                // sketch.push()
                // sketch.stroke('green')
                // sketch.strokeWeight(2)
                // sketch.line(player.pos.x, 
                //             player.pos.y, 
                //             player.rays[i].dest_pos.x, 
                //             player.rays[i].dest_pos.y)
                    
                // sketch.pop()
                    
                // dist = player.rays[i].len * Math.cos(player.rays[i].angle - player.heading)
                dist = player.rays[i].len
                var interaction_height = .5*CANVAS_HEIGHT - (.5*CANVAS_HEIGHT - 48*.5*CANVAS_HEIGHT/dist) ;
                    var drawStart = -interaction_height / 2 + (.5*CANVAS_HEIGHT) / 2;
                    if (drawStart < 0)
                        drawStart = 0;
                    var drawEnd   = interaction_height / 2 + .5*CANVAS_HEIGHT / 2;
                    if (drawEnd >= .5*CANVAS_HEIGHT)
                        drawEnd = .5* CANVAS_HEIGHT - 1;
            
            
                    sketch.push()
                    sketch.noStroke();
            
                    sketch.fill(player.rays[i].color);
                    
                    sketch.rect((i*4), CANVAS_HEIGHT + drawStart, 4, CANVAS_HEIGHT + drawEnd - drawStart);
                    sketch.fill(60, 0, 0);
                    sketch.rect((i*4), CANVAS_HEIGHT, 4, drawStart);
                    sketch.fill(0, 0, 23);
                    sketch.rect((i*4), CANVAS_HEIGHT + drawEnd, 4, .5*CANVAS_HEIGHT - drawEnd);
            
                    sketch.strokeWeight(2);
                    sketch.pop()
    
            }
            if (interaction_6_len > 1 && interaction_6_cur_ray != NUM_RAYS-1) {
                interaction_6_cur_ray += 1
                interaction_6_len = 0
            } else if (interaction_6_cur_ray == NUM_RAYS - 1) {
                interaction_6_done = true
            } else {
                sketch.push()
                sketch.stroke('green')
                sketch.strokeWeight(2)
                sketch.line(player.pos.x, 
                            player.pos.y, 
                            player.rays[interaction_6_cur_ray].dest_pos.x, 
                            player.rays[interaction_6_cur_ray].dest_pos.y)
                    
                sketch.pop()

                var interaction_height = .5*CANVAS_HEIGHT - e.cubicInOut(interaction_6_len)*(.5*CANVAS_HEIGHT - 48*.5*CANVAS_HEIGHT/dist) ;
                var drawStart = -interaction_height / 2 + (.5*CANVAS_HEIGHT) / 2;
                if (drawStart < 0)
                    drawStart = 0;
                var drawEnd   = interaction_height / 2 + .5*CANVAS_HEIGHT / 2;
                if (drawEnd >= .5*CANVAS_HEIGHT)
                    drawEnd = .5* CANVAS_HEIGHT - 1;
        
        
                sketch.push()
                sketch.noStroke();
        
                sketch.fill(player.rays[interaction_6_cur_ray].color);
                
                sketch.rect((interaction_6_cur_ray*4), CANVAS_HEIGHT + drawStart, 4, CANVAS_HEIGHT + drawEnd - drawStart);
                sketch.fill(60, 0, 0);
                sketch.rect((interaction_6_cur_ray*4), CANVAS_HEIGHT, 4, drawStart);
                sketch.fill(0, 0, 23);
                sketch.rect((interaction_6_cur_ray*4), CANVAS_HEIGHT + drawEnd, 4, .5*CANVAS_HEIGHT - drawEnd);
        
                sketch.strokeWeight(2);
                sketch.pop()

                interaction_6_len += 1
            }
        } else {
            for (var i = 0; i <= interaction_6_cur_ray; i++) {
                // sketch.push()
                // sketch.stroke('green')
                // sketch.strokeWeight(2)
                // sketch.line(player.pos.x, 
                //             player.pos.y, 
                //             player.rays[i].dest_pos.x, 
                //             player.rays[i].dest_pos.y)
                    
                // sketch.pop()
                    
                // dist = player.rays[i].len * Math.cos(player.rays[i].angle - player.heading)
                dist = player.rays[i].len
                var interaction_height = .5*CANVAS_HEIGHT - (.5*CANVAS_HEIGHT - 48*.5*CANVAS_HEIGHT/dist) ;
                var drawStart = -interaction_height / 2 + (.5*CANVAS_HEIGHT) / 2;
                if (drawStart < 0)
                    drawStart = 0;
                var drawEnd   = interaction_height / 2 + .5*CANVAS_HEIGHT / 2;
                if (drawEnd >= .5*CANVAS_HEIGHT)
                    drawEnd = .5* CANVAS_HEIGHT - 1;
        
        
                sketch.push()
                sketch.noStroke();
        
                sketch.fill(player.rays[i].color);
                
                sketch.rect((i*4), CANVAS_HEIGHT + drawStart, 4, CANVAS_HEIGHT + drawEnd - drawStart);
                sketch.fill(60, 0, 0);
                sketch.rect((i*4), CANVAS_HEIGHT, 4, drawStart);
                sketch.fill(0, 0, 23);
                sketch.rect((i*4), CANVAS_HEIGHT + drawEnd, 4, .5*CANVAS_HEIGHT - drawEnd);
        
                sketch.strokeWeight(2);
                sketch.pop()
            }
        }
        
    }

    // Draw camera plane and perp line
    var interaction_7_len = 0
    var interaction_7_start = false;
    var interaction_7_done = false;
    var interaction_7_camera_drawn = false
    var interaction_7_camera_len = 0
    var interaction_7_perp_dist;
    function interact_7() {
        if (!interaction_7_camera_drawn) {
            if (interaction_7_camera_len > 1) {
                interaction_7_camera_drawn = true
            }

            sketch.line(CANVAS_WIDTH/2 - 90 * e.cubicInOut(interaction_7_camera_len), CANVAS_HEIGHT/2, CANVAS_WIDTH/2 + 90* e.cubicInOut(interaction_7_camera_len), CANVAS_HEIGHT/2)
            interaction_7_camera_len += .01
        } else if (!interaction_7_done) {            
            interaction_7_perp_dist = player.rays[0].len * Math.cos(player.rays[0].angle - player.heading)
            sketch.line(CANVAS_WIDTH/2 - 90, CANVAS_HEIGHT/2, CANVAS_WIDTH/2 + 90, CANVAS_HEIGHT/2)
            if (interaction_7_len > 1) {
                interaction_7_done = true
            }

            sketch.push()
            sketch.stroke('green')
            sketch.strokeWeight(2)
            sketch.line(player.rays[0].dest_pos.x, 
                        player.rays[0].dest_pos.y + interaction_7_perp_dist, 
                        player.rays[0].dest_pos.x, 
                        player.rays[0].dest_pos.y + interaction_7_perp_dist*e.cubicInOut(1 - interaction_7_len))
                
            sketch.pop()
    
            interaction_7_len += .01
        } else {
            sketch.line(CANVAS_WIDTH/2 - 90, CANVAS_HEIGHT/2, CANVAS_WIDTH/2 + 90, CANVAS_HEIGHT/2)
            sketch.push()
            sketch.stroke('green')
            sketch.strokeWeight(2)
            sketch.line(player.rays[0].dest_pos.x, 
                        player.rays[0].dest_pos.y,
                        player.rays[0].dest_pos.x,
                        player.rays[0].dest_pos.y + interaction_7_perp_dist)
            sketch.pop()
        }
    }

    var interaction_8_start = false;
    var interaction_8_is_fisheye = true;
    function interact_8() {
        for (var i = 0; i < FOV*2; i++) {
            var non_fisheye_dist = player.rays[i].len * Math.cos(player.rays[i].angle - player.heading)
            var fish_eye_dist = player.rays[i].len

            if (interaction_8_is_fisheye) {
                var interaction_height = .5*CANVAS_HEIGHT - (.5*CANVAS_HEIGHT - 48*.5*CANVAS_HEIGHT/fish_eye_dist) ;
                var drawStart = -interaction_height / 2 + (.5*CANVAS_HEIGHT) / 2;
                if (drawStart < 0)
                    drawStart = 0;
                var drawEnd   = interaction_height / 2 + .5*CANVAS_HEIGHT / 2;
                if (drawEnd >= .5*CANVAS_HEIGHT)
                    drawEnd = .5* CANVAS_HEIGHT - 1;
        
        
                sketch.push()
                sketch.noStroke();
        
                sketch.fill(player.rays[i].color);
                
                sketch.rect((i*4), CANVAS_HEIGHT + drawStart, 4, CANVAS_HEIGHT + drawEnd - drawStart);
                sketch.fill(60, 0, 0);
                sketch.rect((i*4), CANVAS_HEIGHT, 4, drawStart);
                sketch.fill(0, 0, 23);
                sketch.rect((i*4), CANVAS_HEIGHT + drawEnd, 4, .5*CANVAS_HEIGHT - drawEnd);
        
                sketch.strokeWeight(2);
                sketch.pop()
            } else {
                var interaction_height = .5*CANVAS_HEIGHT - (.5*CANVAS_HEIGHT - 48*.5*CANVAS_HEIGHT/non_fisheye_dist) ;
                var drawStart = -interaction_height / 2 + (.5*CANVAS_HEIGHT) / 2;
                if (drawStart < 0)
                    drawStart = 0;
                var drawEnd   = interaction_height / 2 + .5*CANVAS_HEIGHT / 2;
                if (drawEnd >= .5*CANVAS_HEIGHT)
                    drawEnd = .5* CANVAS_HEIGHT - 1;
        
        
                sketch.push()
                sketch.noStroke();
        
                sketch.fill(player.rays[i].color);
                
                sketch.rect((i*4), CANVAS_HEIGHT + drawStart, 4, CANVAS_HEIGHT + drawEnd - drawStart);
                sketch.fill(60, 0, 0);
                sketch.rect((i*4), CANVAS_HEIGHT, 4, drawStart);
                sketch.fill(0, 0, 23);
                sketch.rect((i*4), CANVAS_HEIGHT + drawEnd, 4, .5*CANVAS_HEIGHT - drawEnd);
        
                sketch.strokeWeight(2);
                sketch.pop()
            }

        }
    }


    sketch.setup = () => {
        theory_5_canvas = sketch.createCanvas(TILE_SIZE * MAP_NUM_COLS, 1.5*TILE_SIZE*MAP_NUM_ROWS);
        theory_5_canvas.parent("theory_5");

                // World Boundaries
        walls.push(new Boundary_Color(TILE_SIZE,TILE_SIZE,sketch.width - TILE_SIZE,TILE_SIZE, 'rgb(0,255,0)', sketch));
        walls.push(new Boundary_Color(sketch.width - TILE_SIZE, TILE_SIZE, sketch.width - TILE_SIZE, CANVAS_HEIGHT - TILE_SIZE, 'rgb(0,150,0)',sketch));
        walls.push(new Boundary_Color(sketch.width - TILE_SIZE, CANVAS_HEIGHT - TILE_SIZE, TILE_SIZE, CANVAS_HEIGHT - TILE_SIZE, 'rgb(0,255,0)', sketch));
        walls.push(new Boundary_Color(TILE_SIZE, CANVAS_HEIGHT - TILE_SIZE, TILE_SIZE, TILE_SIZE, 'rgb(0,150,0)', sketch));

        // Walls added last section, colored now
        walls.push(new Boundary_Color(4*TILE_SIZE,3*TILE_SIZE,7*TILE_SIZE,3*TILE_SIZE, 'rgb(255,0,0)', sketch))
        walls.push(new Boundary_Color(4*TILE_SIZE,4*TILE_SIZE,7*TILE_SIZE,4*TILE_SIZE, 'rgb(255,0,0)', sketch))
        walls.push(new Boundary_Color(4*TILE_SIZE,3*TILE_SIZE,4*TILE_SIZE,4*TILE_SIZE, 'rgb(100,0,0)', sketch))
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

        
        text_div_5 = sketch.createDiv(section_5_text[0])
            .attribute('class', 'section_text')
            .center('horizontal')
            .position(0, sketch.height/3)
            .style('opacity', text_fade_5)
            // .attribute('width', 22)
            .hide()

        next_button_5 = sketch.createButton("Next")
            .attribute('class', 'button_next')
            .center('horizontal')
            .style('border', '2px solid #5cb85c')
            .size(50, 20)
            .mousePressed(() => {

                // interaction_3_start = true;
                // sketch.select("#theory_5_interact_4").mouseClicked(
                //     function() {
                //         interaction_4_start = true;
                //     })
                // sketch.select("#theory_5_interact_5").mouseClicked(
                //     function() {
                //         interaction_5_start = true;
                //     })
                // sketch.select("#theory_5_interact_6").mouseClicked(
                //     function() {
                //         interaction_6_start = true;
                //     })
                // sketch.select("#theory_5_interact_7").mouseClicked(
                //     function() {
                //         if (!interaction_7_start) {
                //             interaction_7_start = true;
                //         } else {
                //             interaction_7_len = 0
                //             interaction_7_done = false;
                //             interaction_7_camera_drawn = false
                //             interaction_7_camera_len = 0
                //         }
                //     })
                // sketch.select("#theory_5_interact_8").mouseClicked(
                //         function() {
                //             interaction_8_start = true
                //             interaction_8_is_fisheye = !interaction_8_is_fisheye;
                //         })
                if (curr_screen_5 < section_5_text.length - 1) {
                    curr_screen_5++;
                    if (curr_screen_5 == 1) {
                        interaction_1_start = true;
                        lineLen = 0;
                    } else if (curr_screen_5 == 2) {
                        interaction_1_done = false;
                        interaction_1_start = false;
                        interaction_3_start = true;
                        interaction_3_len = 0
                    } else if (curr_screen_5 == 4) {
                        interaction_3_done = true;
                        interaction_3_start = false;
                        interaction_4_width = 0
                        interaction_4_start = true;
                        interaction_4_done = false;
                    } else if (curr_screen_5 == 5) {
                        interaction_4_done = false;
                        interaction_4_start = false;
                        interaction_5_start = true;
                    } else if (curr_screen_5 == 6) {
                        interaction_5_done = false;
                        interaction_5_start = false;
                        interaction_6_start = true;
                    } else if (curr_screen_5 == 7) {
                        // interaction_6_done = false;
                        // interaction_6_start = false;
                        interaction_7_start = true;
                    }

                    if (curr_screen_5 == 7) {
                        toggle_button.show()
                    } else {
                        toggle_button.hide()
                    }
                    updateDisplayText(text_div_5, curr_screen_5);
                } else if (curr_screen_5 == section_5_text.length - 1) {
                    fullpage_api.moveTo('page6', 0);
                }
            })
            .position(TILE_SIZE*MAP_NUM_COLS/2 + 100, 880)
            .hide()

        toggle_button = sketch.createButton("Toggle Fisheye")
            .attribute('class', 'button_prev')
            .center('horizontal')
            .style('border', '2px solid #5bc0de')
            .size(150, 20)
            .mousePressed(() => {
                interaction_8_start = true
                interaction_8_is_fisheye = !interaction_8_is_fisheye;
            })
            .position(TILE_SIZE*MAP_NUM_COLS/2 + 200, 880)
            .hide()
        
        prev_button_5 = sketch.createButton("Back")
            .attribute('class', 'button_prev')
            .center('horizontal')
            .style('border', '2px solid #5bc0de')
            .size(50, 20)
            .mousePressed(() => {
                if (curr_screen_5 > 0) {
                    curr_screen_5--;
                    updateDisplayText(text_div_5, curr_screen_5);
                }
                if (curr_screen_5 == 0) {
                    interaction_1_done = false;
                    interaction_1_start = false;
                    lineLen = 0;
                } else if (curr_screen_5 == 1) {
                    interaction_1_done = false;
                    interaction_1_start = true;
                    lineLen = 0;
                    interaction_3_done = false;
                    interaction_3_start = false;
                } else if (curr_screen_5 == 2) {
                    interaction_3_done = false;
                    interaction_3_start = true;
                    interaction_3_len = 0;

                    interaction_4_width = 0
                    interaction_4_start = false;
                    interaction_4_done = true;
                } else if (curr_screen_5 == 3) {
                    interaction_4_reset = true
                } else if (curr_screen_5 == 4) {
                    interaction_3_done = true;
                    interaction_3_start = false;
                    interaction_3_len = 0;
                    interaction_4_width = 0
                    interaction_4_start = true;
                    interaction_4_done = false;
                }

                if (curr_screen_5 != 7) {
                    toggle_button.hide()
                }
            })
            .position(TILE_SIZE*MAP_NUM_COLS/2, 880)
            .hide()

        
        text_div_5.parent('#theory_5_text')
        next_button_5.parent('theory_5')
        prev_button_5.parent('theory_5')
        toggle_button.parent('theory_5')
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
        interaction_1_ray = player.rays[0]

        draw_details()

        text_div_5.show()
        next_button_5.show()
        prev_button_5.show()

        text_div_5.style('opacity', text_fade_5)

        if (text_fade_5 < 1) {
            text_fade_5 += .07;
        }        
        
        for (var wall of walls) {
            wall.render();
        }

        // sketch.line(CANVAS_WIDTH/2 - 75, CANVAS_HEIGHT/2, CANVAS_WIDTH/2 + 75, CANVAS_HEIGHT/2)
        // player.rotate(.01)
        player.look(walls)
        
        // console.log(mouseX)
        player.render(0)
        
        if (interaction_1_start) {
            interact_1()
        }

        if (interaction_3_start) {
            interaction_1_start = false
            interact_3()
        }

        if (interaction_4_start) {
            interaction_3_start = false;
            interact_4()
        }

        if (interaction_5_start) {
            interaction_4_start = false;
            interact_5()
        }

        if (interaction_6_start) {
            interaction_5_start = false;
            interact_6()
        }
        
        if (interaction_7_start) {
            // interaction_6_start = false;
            interact_7()
        }

        if (interaction_8_start) {
            interaction_6_start = false;
            interact_8()
        }

        // interact_2()
    }

    // function windowResized() {
    //     resizeCanvas(windowWidth/2, windowHeight/2);
    // }
}

new p5(theory_5)