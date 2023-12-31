const raycast_test = ( sketch ) => {

    var TILE_SIZE = 36;
    var MAP_NUM_ROWS = 11;
    var MAP_NUM_COLS = 15;

    var WINDOW_WIDTH = MAP_NUM_COLS * TILE_SIZE;
    var WINDOW_HEIGHT = MAP_NUM_ROWS * TILE_SIZE;
    const RAYWIDTH = Math.ceil((WINDOW_HEIGHT / WINDOW_WIDTH) * (WINDOW_WIDTH / 300));
    const TEX_WIDTH = 64;
    const TEX_HEIGHT = 64;

    var next_button;
    var prev_button;
    var text_div_7;

    let magicWallX = null; // noclip grid position X
    let magicWallY = null; // noclip grid position Y

    var FOV = 60 * (Math.PI / 180);

    var NUM_RAYS = Math.floor(WINDOW_WIDTH/4);

    var mouse;

    const section_7_text = 
    [
      `<p>
          Now that you understand raycasting, let’s build our own maze! Any maze worth its salt has walls. 
          Fortunately, raycasters makes creating 3D walls from a 2D grid no sweat.
        </p>
        <p>
            Without further ado, let’s create our own maze. We can simply click on any of the white tiles to add a wall and click
            a black wall within the grid to remove a wall. Collision detection is included, so you can’t simply go through the walls. 
            When you’re done creating, use the arrow keys to explore your world.
        </p>`
    ]

    class Map {
      constructor() {
        this.grid = [
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1],
          [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1],
          [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
      }

      // a very userful function for checking if there is a wall at a point
      hasWallAt(x, y) {
        return this.grid[Math.floor(y / TILE_SIZE)][Math.floor(x / TILE_SIZE)];
      }

      render() {
        for (var i = 0; i < MAP_NUM_ROWS; i++) {
          for (var j = 0; j < MAP_NUM_COLS; j++) {
            let tileX = j * TILE_SIZE;
            let tileY = i * TILE_SIZE;
            let tileColor = this.grid[i][j] >= 1 ? "#222" : "#fff";

          // paint magicwall's grid loc and store it's position into variables
            sketch.fill(tileColor);
            sketch.stroke("#222");
            sketch.rect(tileX, tileY, TILE_SIZE, TILE_SIZE);
          }
        }
      }
    }

    class Player {
      constructor() {
        this.x = WINDOW_WIDTH / 2;
        this.y = WINDOW_HEIGHT / 2;
        this.radius = 3;
        this.turnDirection = 0;
        this.walkDirection = 0;
        this.rotationAngle = 3*Math.PI / 2;
        this.moveSpeed = 2.5;
        this.rotationSpeed = 2 * (Math.PI / 180);
      }

      update() {
        this.rotationAngle += this.turnDirection * this.rotationSpeed;

        if (!isColliding()) {
          // only do that if the player is not colliding
          let moveStep = this.walkDirection * this.moveSpeed;
          this.x += Math.cos(this.rotationAngle) * moveStep;
          this.y += Math.sin(this.rotationAngle) * moveStep;
        }

        // reseting angle
        if (this.rotationAngle < 0)
          this.rotationAngle += 2 * Math.PI;
        if (this.rotationAngle > 2 * Math.PI)
          this.rotationAngle -= 2 * Math.PI;

      }


      render() {
        sketch.noStroke();
        sketch.fill("red");
        sketch.circle(this.x, this.y, this.radius);
        sketch.stroke("red");
      }
    }

    class RayLine {
      constructor(rayAngle) {
        this.rayAngle = normalizeAngle(rayAngle); // the angle will be normalized
        this.wallHitX = 0;
        this.wallHitY = 0;
        this.distance = 0;
        this.side = 0;

        this.color = 255;

        // booleans to check if the player is looking at the directions
        this.isRayFacingDown = this.rayAngle > 0 && this.rayAngle < Math.PI; // the y is inverted, so the up is down wow
        this.isRayFacingUp = !this.isRayFacingDown;
        this.isRayFacingRight = this.rayAngle < 0.5 * Math.PI || this.rayAngle > 1.5 * Math.PI;
        this.isRayFacingLeft = !this.isRayFacingRight;
      }

      cast(columnId) {
        var xintersect, yintersect; // variables for storing the first intersection (that one that has the player position)
        var xstep, ystep;           // variables for storing the xstep and the ystep after finding the xintersect and yintersect

        ////////////////////////////////////////////////
        // HORIZONTAL INTERSECTION CHECKING
        ///////////////////////////////////////////////
        var foundHorizontalWall = false; // we have to check if we found a wall (horizontal)
        var horizontalWallHitX = 0;      // var to store the X position of the wall in horizontal which was hit
        var horizontalWallHitY = 0;      // var to store the Y position of the wall in horizontal which was hit

        yintersect = Math.floor(player.y / TILE_SIZE) * TILE_SIZE; // the position of the first intersection

        // TODO: explain the math behind this shit
        if (this.rayAngle > 0 && this.rayAngle < Math.PI) // looking down
          yintersect += TILE_SIZE;

        xintersect = player.x + (yintersect - player.y) / Math.tan(this.rayAngle); // the x position of the first intersection

        ystep = TILE_SIZE; // the y step for the horizontal checking will be the same as the tile size (only if the player is looking down)
        if (!(this.rayAngle > 0 && this.rayAngle < Math.PI)) // looking up
          ystep *= -1;

        xstep = ystep/Math.tan(this.rayAngle); // TODO: explain the math behind this thing

        // the next intersection starts at the first intersection (with the player)
        var nextHorizontalX = xintersect;
        var nextHorizontalY = yintersect;

        // TODO: explain the math behind this
        if (!(this.rayAngle > 0 && this.rayAngle < Math.PI)) // looking up (see that is the same as the above)
          nextHorizontalY -= 0.01;


        // checking the horizontal lines //

        // while the it is inside the window
        while (nextHorizontalX <= WINDOW_WIDTH && nextHorizontalX >= 0 && nextHorizontalY <= WINDOW_HEIGHT && nextHorizontalY >= 0) {
          // if there is a wall at the position found in nextHorizontalX and Y
          if (grid.hasWallAt(nextHorizontalX, nextHorizontalY)) {
            foundHorizontalWall = true;
            // we need to store the position of the wall found
            horizontalWallHitX = nextHorizontalX;
            horizontalWallHitY = nextHorizontalY;
            break;
          } else {
            // if we didn't found a wall, we need to keep checking
            nextHorizontalX += xstep;
            nextHorizontalY += ystep;
          }
        }

        /////////////////////////////////////
        // VERTICAL INTERSECTION CHECKING
        ////////////////////////////////////
        var foundVerticalWall = false;
        var verticalWallHitX = 0;
        var verticalWallHitY = 0;

        xintersect = Math.floor(player.x / TILE_SIZE) * TILE_SIZE;
        if (this.rayAngle < 0.5 * Math.PI || this.rayAngle > 1.5 * Math.PI) // facing right
          xintersect += TILE_SIZE;

        yintersect = player.y + (xintersect - player.x) * Math.tan(this.rayAngle); // TODO: see why is player.x + ...

        xstep = TILE_SIZE;

        if (!(this.rayAngle < 0.5 * Math.PI || this.rayAngle > 1.5 * Math.PI)) // facing left
          xstep *= -1;

        ystep = xstep * Math.tan(this.rayAngle);

        var nextVerticalX = xintersect;
        var nextVerticalY = yintersect;


        if (this.isRayFacingLeft)
          nextVerticalX -= 0.01;



        while (nextVerticalX >= 0 && nextVerticalX <= WINDOW_WIDTH && nextVerticalY >= 0 && nextVerticalY <= WINDOW_HEIGHT) {

          if (grid.hasWallAt(nextVerticalX, nextVerticalY)) {
            foundVerticalWall = true;
            verticalWallHitX = nextVerticalX;
            verticalWallHitY = nextVerticalY;

            break;
          } else {
            nextVerticalX += xstep;
            nextVerticalY += ystep;
          }
        }


        /////////////////////////////////////////////////////////////////////////
        // Distance calculation
        /////////////////////////////////////////////////////////////////////////
        // we need to compare the horizontal distance with the vertical distance.
        // then check which one is the nearest to the player
        /////////////////////////////////////////////////////////////////////////
        var horizontalDistance;
        var verticalDistance;

        if (foundHorizontalWall) {
          horizontalDistance = distanceBetween(player.x, player.y, horizontalWallHitX, horizontalWallHitY);
        } else {
          horizontalDistance = Number.MAX_VALUE;
        }
        if (foundVerticalWall) {
          verticalDistance = distanceBetween(player.x, player.y, verticalWallHitX, verticalWallHitY);
        } else {
          verticalDistance = Number.MAX_VALUE;
        }

        this.wallHitX = (horizontalDistance < verticalDistance) ? horizontalWallHitX : verticalWallHitX;
        this.wallHitY = (horizontalDistance < verticalDistance) ? horizontalWallHitY : verticalWallHitY;

        this.distance = (horizontalDistance < verticalDistance) ? horizontalDistance : verticalDistance;
        this.distance *= Math.cos(player.rotationAngle - this.rayAngle);

        if (verticalDistance < horizontalDistance) {
          this.color = 160;
          this.side = 0;

        }
        if (horizontalDistance < verticalDistance) {
          this.color = 255;
          this.side = 1;
        }



      }

      render() {
        sketch.stroke("red");
        sketch.line(
          player.x,
          player.y,
          this.wallHitX,
          this.wallHitY
        );
      }
    }

    var grid = new Map();
    var player = new Player();
    var rays = [];

    sketch.keyPressed = () => {
      if (sketch.keyCode == sketch.UP_ARROW) {
        player.walkDirection = 1
      } else if (sketch.keyCode == sketch.DOWN_ARROW) {
        player.walkDirection = -1;
      } else if (sketch.keyCode == sketch.RIGHT_ARROW) {
        player.turnDirection = 1;
      } else if (sketch.keyCode == sketch.LEFT_ARROW) {
        player.turnDirection = -1;
      }
    }

    sketch.keyReleased = () => {
      if (sketch.keyCode == sketch.UP_ARROW) {
        player.walkDirection = 0;
      } else if (sketch.keyCode == sketch.DOWN_ARROW) {
        player.walkDirection = 0;
      } else if (sketch.keyCode == sketch.RIGHT_ARROW) {
        player.turnDirection = 0;
      } else if (sketch.keyCode == sketch.LEFT_ARROW) {
        player.turnDirection = 0;
      }
    }

    function normalizeAngle(angle) {
        angle = angle % (2 * Math.PI);
        if (angle < 0) {
            angle = (2 * Math.PI) + angle;
        }
        return angle;
    }

    function distanceBetween(x1, y1, x2, y2) {
      // TODO: TROCAR ISSO AQUI PELO O QUE TA NO PAPEL PRA VER NO QUE DÁ
      return Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1));
    }

    function castAllRays(sliderRays) {
        var columnId = 0;

        // start first ray subtracting half of the FOV

        rays = [];

        // loop all columns casting the rays
        for (var i = 0; i < sliderRays; i++) {
            var rayAngle = (player.rotationAngle - FOV/2.0) + (i/NUM_RAYS) * FOV; // TODO: REVIEW AND TRY TO EXPLAIN THIS LINE OF CODE
            var rayLine = new RayLine(rayAngle);
            rayLine.cast();
            rays.push(rayLine);

            columnId++; //useless
        }
    }

    function setFOV(angle) {
      FOV = angle * (Math.PI/180);
    }

    function isColliding() {
      var posX = player.x;
      var posY = player.y;

      // only do that if the player is not colliding
      let moveStep = player.walkDirection * player.moveSpeed;
      posX += Math.cos(player.rotationAngle) * moveStep;
      posY += Math.sin(player.rotationAngle) * moveStep;

      if (Math.floor(posX / TILE_SIZE) == magicWallX && (Math.floor(posY / TILE_SIZE)) == magicWallY) {
        return false;
      }

      return grid.hasWallAt(posX, posY);
    }

    sketch.setup = () => {
      var myCanvas = sketch.createCanvas(WINDOW_WIDTH, 1.5*WINDOW_HEIGHT);
      myCanvas.parent("slide7")
      sketch.mouse = sketch.mouseX;

      text_div_7 = sketch.createDiv(section_7_text[0])
        .attribute('class', 'section_text')
        .center('horizontal')
        .position(0, 0, "relative")
        .hide()

      next_button = sketch.createButton("Next")
        .attribute('class', 'button_next')
        .center('horizontal')
        .style('border', '2px solid #5cb85c')
        .size(50, 20)
        .mousePressed(() => {
          fullpage_api.moveTo('page8', 0);
        })
        .position(TILE_SIZE*MAP_NUM_COLS/2 + 175, $(window).height()/2 + 25 + 1.5*TILE_SIZE*MAP_NUM_ROWS/2)
        .hide()

      prev_button = sketch.createButton("Back")
          .attribute('class', 'button_prev')
          .center('horizontal')
          .style('border', '2px solid #DC143C')
          .size(50, 20)
          .mousePressed(() => {
            fullpage_api.moveTo('page6', 0);
          })
          .position(TILE_SIZE*MAP_NUM_COLS/2 + 100, $(window).height()/2 + 25 + 1.5*TILE_SIZE*MAP_NUM_ROWS/2)
          .hide()

      next_button.parent('slide7')
      text_div_7.parent('#game_1_text')
      prev_button.parent('slide7')
      sketch.noLoop()

    
    }

    function update() {
      player.update();
    }

    sketch.mousePressed = () => {
      var tileX = Math.floor(sketch.mouseX / TILE_SIZE);
      var tileY = Math.floor(sketch.mouseY / TILE_SIZE);
      var posTileX = Math.floor(player.x / TILE_SIZE);
      var posTileY = Math.floor(player.y / TILE_SIZE);
      var sameTile = posTileX == tileX && posTileY == tileY;
      if (tileX >= 1 && tileX < (MAP_NUM_COLS - 1)
          && tileY >= 1 && tileY < (MAP_NUM_ROWS - 1)
          && !sameTile) {

        if (grid.grid[tileY][tileX] >= 1) {
            grid.grid[tileY][tileX] = 0;
        } else {
            grid.grid[tileY][tileX] = 4;
        }

      }
      grid.render();
    }

    sketch.draw = () => {
      //resize();
      update();
      next_button.position(TILE_SIZE*MAP_NUM_COLS/2 + 175, $(window).height()/2 + 25 + 1.5*TILE_SIZE*MAP_NUM_ROWS/2)
      prev_button.position(TILE_SIZE*MAP_NUM_COLS/2 + 100, $(window).height()/2 + 25 + 1.5*TILE_SIZE*MAP_NUM_ROWS/2)
      next_button.show()
      prev_button.show()
      text_div_7.show()
      //sketch.background(bg);
      grid.render();
      castAllRays(NUM_RAYS);

      for (rayLine of rays) {
        rayLine.render();
      }
      player.render();

      for (var i = 0; i < NUM_RAYS; i++) {
        var lineHeight = 32*(WINDOW_HEIGHT / 2) / rays[i].distance;

        var drawStart = Math.floor(-lineHeight / 2) + Math.floor((WINDOW_HEIGHT / 2) / 2);
        if (drawStart < 0)
            drawStart = 0;
        var drawEnd   = Math.floor(lineHeight / 2) + Math.floor(WINDOW_HEIGHT / (2*2));
        if (drawEnd >= WINDOW_HEIGHT / 2)
          drawEnd = WINDOW_HEIGHT / 2 - 1;

        // where 3d stuff is being rendered
        var darknessCoefficient = 1;
        if (rays[i].color == 160) {
            darknessCoefficient = 0.5;
        }

        var blockColor = sketch.color(255, 255, 255);
        var hitTileX = Math.floor(rays[i].wallHitX / TILE_SIZE);
        var hitTileY = Math.floor(rays[i].wallHitY / TILE_SIZE);
        if (grid.grid[hitTileY][hitTileX] == 1) {
            blockColor = sketch.color(0,255 * darknessCoefficient,0);
        } else if (grid.grid[hitTileY][hitTileX] == 2) {
            blockColor = sketch.color(255 * darknessCoefficient, 0, 0);
        } else if (grid.grid[hitTileY][hitTileX] == 3) {
            blockColor = sketch.color(0, 0, 255*darknessCoefficient);
        } else {
            blockColor = sketch.color(255*darknessCoefficient, 255*darknessCoefficient, 0);
        }

        sketch.noStroke();
        sketch.stroke(blockColor);
        sketch.strokeWeight(4);
        sketch.fill(255, 0 , 0);

        var actualDrawStart = (drawStart-TILE_SIZE) + WINDOW_HEIGHT;
        if (actualDrawStart < WINDOW_HEIGHT) {
            actualDrawStart = WINDOW_HEIGHT;
        }
        if (rays[i].distance / TILE_SIZE > 0) {
          sketch.rect((i*4), actualDrawStart, 0, (drawEnd-drawStart)+TILE_SIZE);
          sketch.stroke(0);
          sketch.rect((i*4), WINDOW_HEIGHT, 0, (drawStart));
          sketch.rect((i*4), (drawEnd)+WINDOW_HEIGHT, 0, WINDOW_HEIGHT);
          sketch.strokeWeight(2);
        } else {
          sketch.stroke(blockColor);
          //sketch.strokeWeight(4);
          sketch.fill(255, 0 , 0);
          sketch.rect((i*4), actualDrawStart, 0, 0.5*WINDOW_HEIGHT);
        }
      }
    }

    window.addEventListener("keydown", function(e) {
      if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
          e.preventDefault();
      }
    }, false);

    function resize() {
      if ($(window).width() > 750) {
        TILE_SIZE = 36;
      } else if ($(window).width() > 300) {
        TILE_SIZE = 24;
      }
      WINDOW_WIDTH = MAP_NUM_COLS * TILE_SIZE;
      WINDOW_HEIGHT = MAP_NUM_ROWS * TILE_SIZE;
      sketch.resizeCanvas(WINDOW_WIDTH, 1.5*WINDOW_HEIGHT);
      NUM_RAYS = Math.floor(WINDOW_WIDTH/4);
    }

  }

var raycast_add_blocks =  new p5(raycast_test)