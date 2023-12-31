const raycast_no_walls = ( sketch ) => {

  const TILE_SIZE = 48;
  const MAP_NUM_ROWS = 11;
  const MAP_NUM_COLS = 15;

  const WINDOW_WIDTH = MAP_NUM_COLS * TILE_SIZE;
  const WINDOW_HEIGHT = MAP_NUM_ROWS * TILE_SIZE;


  console.log(WINDOW_WIDTH);
  console.log(WINDOW_HEIGHT);

  var FOV = 60 * (Math.PI / 180);

  const NUM_RAYS = WINDOW_WIDTH/4;

  var mouse;

  class Map {
    constructor() {
      this.grid = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
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
          let tileColor = this.grid[i][j] == 1 ? "#222" : "#fff";
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
      this.rotationAngle = Math.PI / 2;
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

      // a line for showing the direction of the player
      /*sketch.line(
        this.x,
        this.y,
        this.x + Math.cos(this.rotationAngle) * 30,
        this.y + Math.sin(this.rotationAngle) * 30
      );*/
    }
  }

  class RayLine {
    constructor(rayAngle) {
      this.rayAngle = normalizeAngle(rayAngle); // the angle will be normalized
      this.wallHitX = 0;
      this.wallHitY = 0;
      this.distance = 0;

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
      }
      if (horizontalDistance < verticalDistance) {
        this.color = 255;
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
      player.walkDirection = 1;
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

          // rayAngle += FOV / NUM_RAYS;

          columnId++; //useless
      }
  }

  function setFOV(angle) {
    FOV = angle * (Math.PI/180);
  }

  function isColliding() {
    var posX = player.x;
    var posY = player.y;

    //if (!grid.hasWallAt(this.x, this.y)) {
    // only do that if the player is not colliding
    let moveStep = player.walkDirection * player.moveSpeed;
    posX += Math.cos(player.rotationAngle) * moveStep;
    posY += Math.sin(player.rotationAngle) * moveStep;
    //}
    //console.log(posX);
    //console.log(posY);
    return grid.hasWallAt(posX, posY);
  }


  let slider2;
  sketch.setup = () => {
    var myCanvas = sketch.createCanvas(WINDOW_WIDTH*2, WINDOW_HEIGHT);
    slider2 = sketch.createSlider(1, NUM_RAYS, NUM_RAYS);
    slider2.parent("#slider2");
    myCanvas.parent("gameWindow")
    //bg = sketch.loadImage('image2.jpg');
    sketch.mouse = sketch.mouseX;
    sketch.noLoop()

  }

  function update() {
    player.update();

  }



  sketch.draw = () => {
    update();
    //sketch.image(bg,WINDOW_WIDTH,0, sketch.width, sketch.height);
    grid.render();
    castAllRays(slider2.value());

    for (rayLine of rays) {
      rayLine.render();
    }
    player.render();

    //console.log("num rays: " + NUM_RAYS);
    for (var i = 0; i < slider2.value(); i++) {
      var lineHeight = 32*(WINDOW_HEIGHT) / rays[i].distance;

      var drawStart = -lineHeight / 2 + (WINDOW_HEIGHT + 100) / 2;
      if (drawStart < 0)
        drawStart = 0;
      var drawEnd   = lineHeight / 2 + WINDOW_HEIGHT / 2;
      if (drawEnd >= WINDOW_HEIGHT)
        drawEnd = WINDOW_HEIGHT - 1;



      // where 3d stuff is being rendered
      sketch.noStroke();
      sketch.stroke(rays[i].color);
      sketch.strokeWeight(4);
      sketch.fill(255, 0, 0);
      sketch.rect((i*4) + WINDOW_WIDTH, (drawStart-TILE_SIZE), 0, (drawEnd-drawStart)+TILE_SIZE);
      sketch.stroke(0);
      sketch.rect((i*4) + WINDOW_WIDTH, 0, 0, (drawStart));
      // sketch.stroke(255);
      sketch.rect((i*4) + WINDOW_WIDTH, (drawEnd), 0, WINDOW_HEIGHT);
      sketch.strokeWeight(2);
    }
    var unusedRays = NUM_RAYS - slider2.value();
    var startVal = WINDOW_WIDTH + slider2.value()*4 - 2;
    //sketch.rect(slider2.value() * 4 + WINDOW_WIDTH, WINDOW_HEIGHT, unusedRays * WINDOW_WIDTH / NUM_RAYS, WINDOW_HEIGHT);
    console.log(WINDOW_HEIGHT);
    sketch.noStroke();
    sketch.fill(211, 211, 211);
    sketch.rect(startVal, 0, unusedRays*4, WINDOW_HEIGHT);
    sketch.describe('white rect with black outline in mid-right of canvas');

    /*for (var i = slider2.value(); i < NUM_RAYS; i++) {
      var lineHeight = 32*(WINDOW_HEIGHT) / rays[i].distance;

      var drawStart = -lineHeight / 2 + (WINDOW_HEIGHT + 100) / 2;
      if (drawStart < 0)
        drawStart = 0;
      var drawEnd   = lineHeight / 2 + WINDOW_HEIGHT / 2;
      if (drawEnd >= WINDOW_HEIGHT)
        drawEnd = WINDOW_HEIGHT - 1;



      // where 3d stuff is being rendered
      sketch.noStroke();
      sketch.stroke("white");
      sketch.strokeWeight(4);
      sketch.fill(255, 0, 0);
      sketch.rect((i*4) + WINDOW_WIDTH, (drawStart-TILE_SIZE), 0, (drawEnd-drawStart)+TILE_SIZE);
      sketch.stroke(0);
      sketch.rect((i*4) + WINDOW_WIDTH, 0, 0, (drawStart));
      // sketch.stroke(255);
      sketch.rect((i*4) + WINDOW_WIDTH, (drawEnd), 0, WINDOW_HEIGHT);
      sketch.strokeWeight(2);
    }*/
  }

  window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
  }, false);

}

new p5(raycast_no_walls)