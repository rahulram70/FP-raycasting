const game_sketch = function(p) {

  p.TILE_SIZE = 36;
  p.MAP_NUM_ROWS = 11;
  p.MAP_NUM_COLS = 23;

  p.WINDOW_WIDTH = p.MAP_NUM_COLS * p.TILE_SIZE;
  p.WINDOW_HEIGHT = p.MAP_NUM_ROWS * p.TILE_SIZE;
  p.RAYWIDTH = Math.ceil((p.WINDOW_HEIGHT / p.WINDOW_WIDTH) * (p.WINDOW_WIDTH / 300));
  p.TEX_WIDTH = 64;
  p.TEX_HEIGHT = 64;

  p.FOV = 60 * (Math.PI / 180);
  p.NUM_RAYS = Math.floor(p.WINDOW_WIDTH / 4);

  p.magicWallCol = null; // noclip grid position X
  p.magicWallRow = null; // noclip grid position Y

  p.mouse; // ???

  p.maps = [
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],  // 0
    [1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1],  // 1
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],  // 2
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],  // 3
    [1, 2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1],  // 4
    [1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1],  // 5
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1],  // 6
    [1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1],  // 7
    [1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],  // 8
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],  // 9
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]   // 10
],// 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],  // 0
    [1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1],  // 1
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],  // 2
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],  // 3
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1],  // 4
    [1, 0, 2, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1],  // 5
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1],  // 6
    [1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1],  // 7
    [1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],  // 8
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],  // 9
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]   // 10
]  //0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22
];

  class Map {
    constructor() {
      this.grid = p.maps[Math.floor(Math.random() * p.maps.length)];
    }

    // a very userful function for checking if there is a wall at a point
    hasWallAt(x, y) {
      return this.grid[Math.floor(y / p.TILE_SIZE)][Math.floor(x / p.TILE_SIZE)];
    }

    render() {
      for (var i = 0; i < p.MAP_NUM_ROWS; i++) {
        for (var j = 0; j < p.MAP_NUM_COLS; j++) {
          let tileX = j * p.TILE_SIZE;
          let tileY = i * p.TILE_SIZE;
          let tileColor = this.grid[i][j] == 1 ? "#222" : "#fff";

        // paint magicwall's grid loc and store it's position into variables
        if (this.grid[i][j] == 2) {
          tileColor = "green";
          p.magicWallRow = (this.grid.findIndex(arr => arr.includes(2)));
          p.magicWallCol = (this.grid[p.magicWallRow].indexOf(2));
          // console.log("magic wall row:", p.magicWallRow,
                      // "magic wall col:", p.magicWallCol);
        };

          p.fill(tileColor);
          p.stroke("#222");
          p.rect(tileX, tileY, p.TILE_SIZE, p.TILE_SIZE);
        }
      }
    }
  }

  class Player {
    constructor() {
      this.x = p.WINDOW_WIDTH / 16;
      this.y = p.WINDOW_HEIGHT / 8;
      this.radius = 3;
      this.turnDirection = 0;
      this.walkDirection = 0;
      this.rotationAngle = Math.PI / 2;
      this.moveSpeed = 2.5;
      this.rotationSpeed = 2 * (Math.PI / 180);
    }

    update() {
      this.rotationAngle += this.turnDirection * this.rotationSpeed;

      // no clip
      if (Math.floor(this.x / p.TILE_SIZE) == p.magicWallCol && (Math.floor(this.y / p.TILE_SIZE)) == p.magicWallRow) {

      }

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
      p.noStroke();
      p.fill("red");
      p.circle(this.x, this.y, this.radius);
      p.stroke("red");

      // a line for showing the direction of the player
      /*p.line(
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

      yintersect = Math.floor(p.player.y / p.TILE_SIZE) * p.TILE_SIZE; // the position of the first intersection

      // TODO: explain the math behind this shit
      if (this.rayAngle > 0 && this.rayAngle < Math.PI) // looking down
        yintersect += p.TILE_SIZE;

      xintersect = p.player.x + (yintersect - p.player.y) / Math.tan(this.rayAngle); // the x position of the first intersection

      ystep = p.TILE_SIZE; // the y step for the horizontal checking will be the same as the tile size (only if the player is looking down)
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
      while (nextHorizontalX <= p.WINDOW_WIDTH && nextHorizontalX >= 0 && nextHorizontalY <= p.WINDOW_HEIGHT && nextHorizontalY >= 0) {
        // if there is a wall at the position found in nextHorizontalX and Y
        if (p.grid.hasWallAt(nextHorizontalX, nextHorizontalY)) {
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

      xintersect = Math.floor(p.player.x / p.TILE_SIZE) * p.TILE_SIZE;
      if (this.rayAngle < 0.5 * Math.PI || this.rayAngle > 1.5 * Math.PI) // facing right
        xintersect += p.TILE_SIZE;

      yintersect = p.player.y + (xintersect - p.player.x) * Math.tan(this.rayAngle); // TODO: see why is player.x + ...

      xstep = p.TILE_SIZE;

      if (!(this.rayAngle < 0.5 * Math.PI || this.rayAngle > 1.5 * Math.PI)) // facing left
        xstep *= -1;

      ystep = xstep * Math.tan(this.rayAngle);

      var nextVerticalX = xintersect;
      var nextVerticalY = yintersect;

      if (this.isRayFacingLeft)
        nextVerticalX -= 0.01;

      while (nextVerticalX >= 0 && nextVerticalX <= p.WINDOW_WIDTH && nextVerticalY >= 0 && nextVerticalY <= p.WINDOW_HEIGHT) {

        if (p.grid.hasWallAt(nextVerticalX, nextVerticalY)) {
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
        horizontalDistance = distanceBetween(p.player.x, p.player.y, horizontalWallHitX, horizontalWallHitY);
      } else {
        horizontalDistance = Number.MAX_VALUE;
      }
      if (foundVerticalWall) {
        verticalDistance = distanceBetween(p.player.x, p.player.y, verticalWallHitX, verticalWallHitY);
      } else {
        verticalDistance = Number.MAX_VALUE;
      }

      this.wallHitX = (horizontalDistance < verticalDistance) ? horizontalWallHitX : verticalWallHitX;
      this.wallHitY = (horizontalDistance < verticalDistance) ? horizontalWallHitY : verticalWallHitY;

      this.distance = (horizontalDistance < verticalDistance) ? horizontalDistance : verticalDistance;
      this.distance *= Math.cos(p.player.rotationAngle - this.rayAngle);

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
      p.stroke("red");
      p.line(
        p.player.x,
        p.player.y,
        this.wallHitX,
        this.wallHitY
      );
    }
  }


  p.grid = new Map();
  p.player = new Player();
  p.rays = [];


  p.keyPressed = () => {
    if (p.keyCode == p.UP_ARROW) {
      p.player.walkDirection = 1
    } else if (p.keyCode == p.DOWN_ARROW) {
      p.player.walkDirection = -1;
    } else if (p.keyCode == p.RIGHT_ARROW) {
      p.player.turnDirection = 1;
    } else if (p.keyCode == p.LEFT_ARROW) {
      p.player.turnDirection = -1;
    }
  }

  p.keyReleased = () => {
    if (p.keyCode == p.UP_ARROW) {
      p.player.walkDirection = 0;
    } else if (p.keyCode == p.DOWN_ARROW) {
      p.player.walkDirection = 0;
    } else if (p.keyCode == p.RIGHT_ARROW) {
      p.player.turnDirection = 0;
    } else if (p.keyCode == p.LEFT_ARROW) {
      p.player.turnDirection = 0;
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
          var rayAngle = (p.player.rotationAngle - p.FOV/2.0) + (i / p.NUM_RAYS) * p.FOV; // TODO: REVIEW AND TRY TO EXPLAIN THIS LINE OF CODE
          var rayLine = new RayLine(rayAngle);
          rayLine.cast();
          rays.push(rayLine);

          // rayAngle += p.FOV / p.NUM_RAYS;

          columnId++; //useless
      }
  }

  function setFOV(angle) {
    p.FOV = angle * (Math.PI/180);
  }

  function isColliding() {
    //console.log(grid.grid);
    let posX = p.player.x;
    let posY = p.player.y;

    //if (!grid.hasWallAt(this.x, this.y)) {
    // only do that if the player is not colliding
    let moveStep = p.player.walkDirection * p.player.moveSpeed;
    posX += Math.cos(p.player.rotationAngle) * moveStep;
    posY += Math.sin(p.player.rotationAngle) * moveStep;

    // if you enter the magicwall grid something magical happens
    if (Math.floor(posX / p.TILE_SIZE) == p.magicWallCol && (Math.floor(posY / p.TILE_SIZE)) == p.magicWallRow) {
      magicMethod();
      return false;
    }
    //}
    //console.log(posX);
    //console.log(posY);
    return p.grid.hasWallAt(posX, posY);
  }

  function goodLoad() {
    console.log("Successfully loaded the image");
  }

  function badLoad() {
    console.log("Failed to load the image");
  }

  let tex;
  let buffer = [];
  let texture = [];
  let d = p.pixelDensity();
  let img;
  let bg;
  p.preload = () => {
    //img = p.loadImage("texture.png");
    img = p.loadImage("../docs/video_game/redbrick.png");
    bg = p.loadImage("../docs/video_game/image.jpg", goodLoad, badLoad);
  }
  //let slider2;
  p.setup = function() {
    p.myCanvas = p.createCanvas(p.WINDOW_WIDTH, 1.5 * p.WINDOW_HEIGHT);
    p.gameWindow = p.myCanvas.parent("gameWindow"); // gameWindow as a variable for manipulation of css
    p.mouse = p.mouseX;

    //slider2 = p.createSlider(1, p.NUM_RAYS, p.NUM_RAYS);
    //slider2.parent("#slider2");
    //bg = p.loadImage('https://raw.githubusercontent.com/daviskauffmann/raycaster/master/assets/images/eagle.png');
    // load texture array
    //console.log("buff len: " + buffer.length);
    //p.loadPixels();

  }

  p.update = function() {
    p.player.update();
  }

  p.draw = function() {
    p.update();
    p.background(bg);
    p.grid.render();
    castAllRays(p.NUM_RAYS);

    for (rayLine of rays) {
      rayLine.render();
    }
    p.player.render();

    for (var i = 0; i < p.NUM_RAYS; i++) {
      var lineHeight = 32 * (p.WINDOW_HEIGHT / 2) / rays[i].distance;

      var drawStart = Math.floor(-lineHeight / 2) + Math.floor((p.WINDOW_HEIGHT / 2) / 2);
      if (drawStart < 0)
      drawStart = 0;
      var drawEnd   = Math.floor(lineHeight / 2) + Math.floor(p.WINDOW_HEIGHT / (2*2));
      if (drawEnd >= p.WINDOW_HEIGHT / 2)
        drawEnd = p.WINDOW_HEIGHT / 2 - 1;


        // where 3d stuff is being rendered
        p.noStroke();
        p.stroke(rays[i].color);
        p.strokeWeight(4);
      p.fill(255, 0, 0);
      let sampleX = Math.abs(rays[i].wallHitX - Math.floor(rays[i].wallHitX));
      if (sampleX < 0.001 || sampleX > 0.999) {
        sampleX = Math.abs(rays[i].wallHitY - Math.floor(rays[i].wallHitY));
      }

      var wallX;
      var rayDirX = Math.cos(rays[i].rayAngle);
      var rayDirY = Math.sin(rays[i].rayAngle);
      var step = 1.0 * p.TEX_HEIGHT / lineHeight;
      var texPos = (drawStart - Math.floor(p.WINDOW_HEIGHT / 4) + Math.floor(lineHeight / 2)) * step;

      if (p.player.side == 0) {
        wallX = p.player.y / p.TILE_SIZE + rays[i].distance / p.TILE_SIZE * rayDirY;
      } else {
        wallX = p.player.x / p.TILE_SIZE + rays[i].distance / p.TILE_SIZE * rayDirX;
      }
      wallX -= Math.floor(wallX);
      var texX = Math.floor(wallX * p.TEX_WIDTH);
      if (p.player.side == 0 && rayDirX > 0)
      texX = p.TEX_WIDTH - texX - 1;
      if (p.player.side == 1 && rayDirY < 0)
      texX = p.TEX_WIDTH - texX - 1;

      var start = i*4;
      //console.log("start: " + start);

      var end = start + 4;
      var red;
      var green;
      var blue;

      p.stroke(255, 255, 0);
      //p.rect((i*4) + p.WINDOW_WIDTH, (drawStart-p.TILE_SIZE), 0, (drawEnd-drawStart)+p.TILE_SIZE);
      //p.stroke(0);
      //p.strokeWeight(2);
      var hitX =  rays[i].wallHitX / p.TILE_SIZE;
      var hitY =  rays[i].wallHitY / p.TILE_SIZE;
      sampleX = Math.abs(hitX - Math.floor(hitX));
      if (sampleX < 0.001 || sampleX > 0.999) {
        sampleX = Math.abs(hitY - Math.floor(hitY));
      }
      //p.tint(rays[i].color);
      for (var x = start; x < end; x++) {
        var sx = i;
        if (sx > img.width) {
          sx -= img.width
        }
        //p.tint(rays[i].color);
        if (rays[i].distance / p.TILE_SIZE > 1) {
          p.image(img, x, drawStart-p.TILE_SIZE + p.WINDOW_HEIGHT, 1, drawEnd - drawStart + p.TILE_SIZE,
            Math.floor(sampleX * img.width), 0, img.width / p.NUM_RAYS, img.height);
          } else {
          var sx = x % img.width;
          /*if (sx > img.width) {
            sx -= img.width;
          }*/
          p.image(img, x, drawStart-p.TILE_SIZE + p.WINDOW_HEIGHT, 1, drawEnd - drawStart + p.TILE_SIZE,
            sx, 0, img.width / p.NUM_RAYS, img.height);
        }
        if (rays[i].color == 160) {

          p.stroke(0, 0, 0, 50);
          p.fill(0, 0, 0, 50);
          p.rect(x, drawStart-p.TILE_SIZE + p.WINDOW_HEIGHT, 1, drawEnd - drawStart + p.TILE_SIZE);
        }
      }
    }

  }

  // what happens when enter a magicwall grid
  function magicMethod() {
    // console.log("YOU WIN");
    // isVisible(1);
    // player.walkDirection = -1; // send backwards
    // player.moveSpeed = 5; // double speed
    p.player.x = p.WINDOW_WIDTH / 16; // teleport to start of level
    p.player.y = p.WINDOW_HEIGHT / 8; // teleport to start of level
    magicMessage();
  }

  // message displayed on screen
  function magicMessage() {
/////////////////////////////////////////////////////
////////////////////////// to do ////////////////////
/////////////////////////////////////////////////////
// idk();
}


window.addEventListener("keydown", function(e) {
  if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
  }, false);

};


// function idk() {
// const game_messages = function(msg)  {
//   let x = game_p5.WINDOW_WIDTH; // use the whole screen width
//   let y = game_p5.WINDOW_HEIGHT; // use the whole screen height

//   msg.setup = function() {
//     var msgCanvas = msg.createCanvas(x, y);
//     msgCanvas.parent("gameMessages");
//     // msgCanvas.hide();
//   };

//   msg.draw = function() {
//     msg.background(0);
//     msg.fill(255);
//     msg.rect(0, 0, x, y);
//     msg.textSize(64);
//     msg.fill(0);
//     msg.text("hello world!", x / 2, y / 2);
//   };
// };
// new p5(game_messages);

// };


var game_p5 = new p5(game_sketch);
// var msg_p5 = new p5(msg_sketch);

// function resetBackground() {
//   game_p5.WINDOW_WIDTH = 0;
//   game_p5.WINDOW_HEIGHT = 0;
// }

// setTimeout(resetBackground, 3000);