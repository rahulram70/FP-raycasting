const theory_5 = ( sketch ) => {

    // const TILE_SIZE = 48;
    const MAP_NUM_ROWS = 11;
    const MAP_NUM_COLS = 15;
    var TILE_SIZE = ($(window).width()/2.7)/MAP_NUM_COLS;

    const FOV =  90
    var NUM_RAYS = FOV * 2;

    var CANVAS_HEIGHT = TILE_SIZE * MAP_NUM_ROWS
    var CANVAS_WIDTH = TILE_SIZE * MAP_NUM_COLS

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
                Let's first consider the very first ray cast out, the ray pointing furthest to the left. It is highlighted on the view on the right.<br>
            </p>
            <p>
                We will take this rays distance from the player, and draw it below in our first person view, which we will place directly below the map. <br>
            </p>
            <p>
                In the next slide, we will re-highlight this ray and draw in our first person view what that ray will contribute to our entire view.
                We will use red to represent the color of the wall, and darker colors to represent the floor and ceiling.
            </p>`,

            `<p> 
                Notice how as the ray casts further out, the wall appears to get smaller. This is simulating the wall appearing further away!
            </p>
            <p>
                And note that the view drawn below is expanded to show more detail.
            </p>`,

            `<p>
                However, this is just one of the 180 different rays being cast in this field of view.
            </p>
            <p>
                Our first person view would be huge if we drew all of these rays as this size! <br>
                Click next to scale down this ray's contribution to our view to its correct size.
            </p>`,

            `<p>
                Then, we're drawing the leftmost ray aren't we? It shouldn't appear in the very middle of our view!
            </p>
            <p>
                Move to the next step to watch the ray move it where it should be.
            </p>`,

            `<p>
                Now, let's repeat these steps again for ALL of the rays in our field of view. <br>
            </p>
            <p>
                Of course, we'll be skipping to the final render size and position. We don't want to play these animations for all 180 rays (that would take a while) <br>

            </p>
            <p>
                The wall on our left will be red, the world border will be green, and the wall right next to the world border will be blue.
            </p>`,

            `<p>
                The top view is looping over all of the rays being cast from left to right and the bottom view is adding each ray that's been cast to our first person rendering
            </p>
            <p>
                Though you might notice as it runs, our view looks a little odd doesn't it?
            </p>
            <p>
                Look at the red wall in particular. We can see in our top down view, we are standing, looking straight on towards the wall but it looks like the parts of the wall on the left most part of our screen look smaller? <br>
            </p>
            <p>
                This is called the fisheye effect. Because the distance we are using to calculate the size of the wall on our first person render 
                is the true distance of the ray being cast, rays at an angle further from the middle of the screen will be longer, which will in turn
                make the rendering of said rays look smaller!
            </p>
            <p>
                In the next section, we will introduce something called the camera plane which will help us fix this problem.
            </p>`,

            `<p>
                Let's introduce the camera plane. The camera plane is a plane perpendicular to the direction where we are looking and represents 
                the screen that our first person view will being displayed on. You can see the camera plane as the black line perpendicular
                to the direction our player is looking in the top down view.
            </p>
            <p>
                In the last section we used the distance from the player to the ray's end point to draw our 3D rendering. But if we want to remove
                the fisheye effect, we need to use the distance from the ray's end point and the camera plane!
            </p>
            <p>
                Try toggling back and forth to really see the difference between our adjusted view and the fisheye with the toggle button! <br> 
                Look at how our view updates when we use this perpendicular distance instead of the true ray length. <br>
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
    
            lineLen += .005
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

        var interaction_height = .5*MAP_NUM_ROWS*TILE_SIZE - e.cubicInOut(interaction_3_len)*(.5*MAP_NUM_ROWS*TILE_SIZE - 48*.5*MAP_NUM_ROWS*TILE_SIZE/dist) ;
        var drawStart = -interaction_height / 2 + (.5*MAP_NUM_ROWS*TILE_SIZE) / 2;
        if (drawStart < 0)
            drawStart = 0;
        var drawEnd   = interaction_height / 2 + .5*MAP_NUM_ROWS*TILE_SIZE / 2;
        if (drawEnd >= .5*MAP_NUM_ROWS*TILE_SIZE)
            drawEnd = .5* MAP_NUM_ROWS*TILE_SIZE - 1;


        sketch.push()
        sketch.noStroke();

        sketch.fill(interaction_1_ray.color);
        sketch.rect(MAP_NUM_COLS*TILE_SIZE/2-60, MAP_NUM_ROWS*TILE_SIZE + drawStart, 120, MAP_NUM_ROWS*TILE_SIZE + drawEnd - drawStart);
        sketch.fill(60, 0, 0);
        sketch.rect(MAP_NUM_COLS*TILE_SIZE/2-60, MAP_NUM_ROWS*TILE_SIZE, 120, drawStart);
        sketch.fill(0, 0, 23);
        sketch.rect(MAP_NUM_COLS*TILE_SIZE/2-60, MAP_NUM_ROWS*TILE_SIZE + drawEnd, 120, .5*MAP_NUM_ROWS*TILE_SIZE - drawEnd);

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

            {
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
            }

            interaction_4_width += 2
        } 

        if (interaction_4_reset) {
            if (interaction_4_width > 0) {
                {
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
                }
            } else {
                interaction_3_start = true;
                interaction_3_done = true;
                interaction_4_width = 0
            }

            interaction_4_width -= 2

        } else if (interaction_4_done) {
            {
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
        var draw_x_step = CANVAS_WIDTH/NUM_RAYS
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
                    sketch.rect((i*draw_x_step), CANVAS_HEIGHT + drawStart, Math.ceil(draw_x_step) + 1, drawEnd - drawStart);
                    sketch.fill(60, 0, 0);
                    sketch.rect((i*draw_x_step), CANVAS_HEIGHT, Math.ceil(draw_x_step) + 1, drawStart);
                    sketch.fill(0, 0, 23);
                    sketch.rect((i*draw_x_step), CANVAS_HEIGHT + drawEnd, Math.ceil(draw_x_step)+ 1, .5*CANVAS_HEIGHT - drawEnd);
            
                    sketch.strokeWeight(2);
                    sketch.pop()
    
            }
            if (interaction_6_len > 1 && interaction_6_cur_ray != NUM_RAYS-1) {
                interaction_6_cur_ray += 2
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
                

                sketch.rect((i*draw_x_step), CANVAS_HEIGHT + drawStart, Math.ceil(draw_x_step) + 1, drawEnd - drawStart);
                sketch.fill(60, 0, 0);
                sketch.rect((i*draw_x_step), CANVAS_HEIGHT, Math.ceil(draw_x_step) + 1, drawStart);
                sketch.fill(0, 0, 23);
                sketch.rect((i*draw_x_step), CANVAS_HEIGHT + drawEnd, Math.ceil(draw_x_step)+ 1, .5*CANVAS_HEIGHT - drawEnd);
                sketch.strokeWeight(2);
                sketch.pop()

                interaction_6_len += 1
            }
        } else {
            for (var i = 0; i <= interaction_6_cur_ray; i++) {
                    
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

                sketch.rect((i*draw_x_step), CANVAS_HEIGHT + drawStart, Math.ceil(draw_x_step) + 1, drawEnd - drawStart);
                sketch.fill(60, 0, 0);
                sketch.rect((i*draw_x_step), CANVAS_HEIGHT, Math.ceil(draw_x_step) + 1, drawStart);
                sketch.fill(0, 0, 23);
                sketch.rect((i*draw_x_step), CANVAS_HEIGHT + drawEnd, Math.ceil(draw_x_step)+ 1, .5*CANVAS_HEIGHT - drawEnd);
        
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
            interaction_7_perp_dist = player.rays[0].len * Math.cos(player.rays[0].angle - player.heading)
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
        var draw_x_step = CANVAS_WIDTH/NUM_RAYS
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
                
                sketch.rect((i*draw_x_step), CANVAS_HEIGHT + drawStart, Math.ceil(draw_x_step) + 1,  drawEnd - drawStart);
                sketch.fill(60, 0, 0);
                sketch.rect((i*draw_x_step), CANVAS_HEIGHT, Math.ceil(draw_x_step) + 1, drawStart);
                sketch.fill(0, 0, 23);
                sketch.rect((i*draw_x_step), CANVAS_HEIGHT + drawEnd, Math.ceil(draw_x_step) + 1, .5*CANVAS_HEIGHT - drawEnd);
        
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
                sketch.rect((i*draw_x_step), CANVAS_HEIGHT + drawStart, Math.ceil(draw_x_step) + 1,  drawEnd - drawStart);
                sketch.fill(60, 0, 0);
                sketch.rect((i*draw_x_step), CANVAS_HEIGHT, Math.ceil(draw_x_step) + 1, drawStart);
                sketch.fill(0, 0, 23);
                sketch.rect((i*draw_x_step), CANVAS_HEIGHT + drawEnd, Math.ceil(draw_x_step) + 1, .5*CANVAS_HEIGHT - drawEnd);
        
                sketch.strokeWeight(2);
                sketch.pop()
            }

        }
    }


    sketch.setup = () => {
        theory_5_canvas = sketch.createCanvas(TILE_SIZE * MAP_NUM_COLS, 3*TILE_SIZE*MAP_NUM_ROWS);
        theory_5_canvas.parent("theory_5");

        walls.push(new Boundary_Color(1,1,MAP_NUM_COLS-1,1, 'rgb(0,255,0)', TILE_SIZE, sketch));
        walls.push(new Boundary_Color(MAP_NUM_COLS - 1, 1, MAP_NUM_COLS - 1, MAP_NUM_ROWS-1, 'rgb(0,150,0)',TILE_SIZE, sketch));
        walls.push(new Boundary_Color(MAP_NUM_COLS - 1, MAP_NUM_ROWS-1, 1, MAP_NUM_ROWS-1, 'rgb(0,255,0)', TILE_SIZE, sketch));
        walls.push(new Boundary_Color(1,MAP_NUM_ROWS-1, 1, 1, 'rgb(0,150,0)', TILE_SIZE, sketch));
        // Walls added last section, colored now
        walls.push(new Boundary_Color(4,3,7,3, 'rgb(255,0,0)', TILE_SIZE, sketch))
        walls.push(new Boundary_Color(4,4,7,4, 'rgb(255,0,0)', TILE_SIZE, sketch))
        walls.push(new Boundary_Color(4,3,4,4, 'rgb(100,0,0)', TILE_SIZE, sketch))
        walls.push(new Boundary_Color(7,3,7,4, 'rgb(100,0,0)', TILE_SIZE, sketch))  
        walls.push(new Boundary_Color(8,1,9,1, 'rgb(0,0,255)', TILE_SIZE, sketch))
        walls.push(new Boundary_Color(8,2,9,2, 'rgb(0,0,255)', TILE_SIZE, sketch))
        walls.push(new Boundary_Color(8,1,8,2, 'rgb(0,0,100)', TILE_SIZE, sketch))
        walls.push(new Boundary_Color(9,1,9,2, 'rgb(0,0,255)', TILE_SIZE, sketch))    
        walls.push(new Boundary_Color(3,7,3,9, 'rgb(0,150,0)', TILE_SIZE, sketch))
        walls.push(new Boundary_Color(3,7,4,7, 'rgb(0,255,0)', TILE_SIZE, sketch))
        walls.push(new Boundary_Color(4,7,4,9, 'rgb(0,150,0)', TILE_SIZE, sketch))
        walls.push(new Boundary_Color(3,9,4,9, 'rgb(0,150,0)', TILE_SIZE, sketch))    

        player = new Particle(TILE_SIZE*MAP_NUM_COLS/2, TILE_SIZE*MAP_NUM_ROWS/2, FOV, .5, sketch)

        
        text_div_5 = sketch.createDiv(section_5_text[0])
            .attribute('class', 'section_text')
            .center('horizontal')
            .position(0, 0, "relative")
            .style('opacity', text_fade_5)
            // .attribute('width', 22)
            .hide()

        next_button_5 = sketch.createButton("Next")
            .attribute('class', 'button_next')
            .center('horizontal')
            .style('border', '2px solid #5cb85c')
            .size(50, 20)
            .mousePressed(() => {

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
                        interaction_4_reset = false
                    } else if (curr_screen_5 == 5) {
                        interaction_4_done = false;

                        interaction_4_start = false;
                        interaction_5_start = true;
                        interaction_5_pos = 0;
                    } else if (curr_screen_5 == 6) {
                        interaction_5_done = false;
                        interaction_5_start = false;

                        interaction_6_cur_ray = 1;
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
            .style('border', '2px solid #DC143C')
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
            .style('border', '2px solid #DC143C')
            .size(50, 20)
            .mousePressed(() => {

                if (curr_screen_5 == 0) {
                    fullpage_api.moveTo('page4', 0);
                }

                if (curr_screen_5 > 0) {
                    curr_screen_5--;
                    console.log(curr_screen_5)
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

                    interaction_4_start = false;
                    interaction_4_done = false;
                } else if (curr_screen_5 == 3) {
                    interaction_4_reset = true
                    interaction_3_start = false;

                } else if (curr_screen_5 == 4) {
                    interaction_4_start = true;
                    interaction_4_done = true;
                    interaction_5_pos = 0
                    interaction_5_start = false;
                    interaction_5_done = false;
                } else if (curr_screen_5 == 5) {
                    interaction_5_start = true;
                    interaction_5_done = true;

                    interaction_6_start = false;
                    interaction_6_done = false;
                } else if (curr_screen_5 = 6) {
                    interaction_6_cur_ray = 1;
                    interaction_6_start = true;
                    interaction_6_done = false;


                    interaction_7_len = 0
                    interaction_7_start = false;
                    interaction_7_done = false;
                    interaction_7_camera_drawn = false
                    interaction_7_camera_len = 0

                    interaction_8_is_fisheye = true;
                    interaction_8_start = false;
                } else if (curr_screen_5 == 7) {

                    interaction_8_is_fisheye = true;
                    interaction_8_start = false;
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

        interaction_1_ray = player.rays[0]

        draw_details()
        // sketch.strokeWeight(19)
        // // sketch.fill("red")
        // sketch.rect(0,0,sketch.width, sketch.height)

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
            // interaction_1_start = false
            interact_3()
        }

        if (interaction_4_start) {
            // interaction_3_start = false;
            interact_4()
        }

        if (interaction_5_start) {
            // interaction_4_start = false;
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

    function resize() {
        sketch.resizeCanvas(TILE_SIZE*MAP_NUM_COLS, 1.5*TILE_SIZE*MAP_NUM_ROWS);
        player.updatePos(TILE_SIZE*MAP_NUM_COLS/2, TILE_SIZE*MAP_NUM_ROWS/2)
        CANVAS_HEIGHT = TILE_SIZE * MAP_NUM_ROWS
        CANVAS_WIDTH = TILE_SIZE * MAP_NUM_COLS
        for (var wall of walls) {
            wall.update_tile_size(TILE_SIZE)
        }

        next_button_5.position(TILE_SIZE*(MAP_NUM_COLS + 1)/2 + 50, $(window).height()/2  + 20 + 1.5*TILE_SIZE*MAP_NUM_ROWS/2)
        prev_button_5.position(TILE_SIZE*(MAP_NUM_COLS + 1)/2 - 25, $(window).height()/2 + 20 + 1.5*TILE_SIZE*MAP_NUM_ROWS/2)
        toggle_button.position(TILE_SIZE*(MAP_NUM_COLS + 1)/2 + 125, $(window).height()/2 + 20 + 1.5*TILE_SIZE*MAP_NUM_ROWS/2)

    }
}

var theory_5_page = new p5(theory_5)