// This example uses the Phaser 2.0.4 framework

//-----------------------------------------------------------------------------
//BOOTYHUNTER: A SWASHBUCKLING ADVENTURE
//Concept by Blake Erquiaga
//Written by Blake Erquiaga, Dan Zweiner, Jason Watts, Liem Gearen
//Special thanks to Dr. Thomas Houpt and Dr. Forrest Stonedahl

//global variables
var width = 960, height = 560;
var playerKills = 0;
var score = 0;

//wind global variables
var whitecaps = new Array();
var wind = 'E'; //the direction the wind is coming from. N means the wind blows north to south
var direction = 'C';

//enemy global variables
var wave = 0;
var waveIsOver = false;
var killedBosses = [];

//-----------------------------------------------------------------------------

var GameState = function(game) {
};

// Load images and sounds
GameState.prototype.preload = function() {
  //  this.game.load.spritesheet('ship', 'assets/gfx/ship.png', 32, 32);
    this.game.load.spritesheet('ship', 'assets/boatLoRes.png', 38, 32);
    this.game.load.image('cannonball', 'assets/cannonball.png');
    this.game.load.image('whitecap', 'assets/whitecap.png');
    console.log("Hello world");
};

// Setup the example
GameState.prototype.create = function() {
    // Set stage background color
//    this.game.stage.backgroundColor = 0x111111;


  //adds islands to map
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.islands = this.game.add.group();
    this.islands.enableBody = true;
    generateIslands(width, height, 20, 100, 'ship', this.islands);

    //creates whitecaps
    this.whitecaps = new Array();
    this.whitecaps = this.game.add.group();
    this.whitecaps.enableBody = true;
    //adds whitecaps
    generateWhitecaps(15, 25);

    // Define motion constants
    this.ROTATION_SPEED = 180; // degrees/second
    this.ACCELERATION = 90; // pixels/second/second
    this.MAX_SPEED = 850; // pixels/second. This is the max max speed in the game
    this.DRAG = 50; // pixels/second
    this.wake = 0; // starting wake sprite

    // Add the ship to the stage
    this.ship = this.game.add.sprite(this.game.width/2, this.game.height/2, 'ship');
    this.ship.health = 6;
    this.ship.anchor.setTo(0.5, 0.5);
    this.ship.angle = -90; // Point the ship up

    console.log(this.game.add);
    //first weapon, fires right relative to the ship
    this.weapon = this.game.add.weapon(100, 'cannonball');
    this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.weapon.bulletLifespan = 650;
    this.weapon.bulletSpeed = 600;
    this.weapon.fireRate = 10;
    this.weapon.bulletAngleVariance = 10;
    this.weapon.bulletCollideWorldBounds = false;
    this.weapon.bulletWorldWrap = true;
    this.weapon.trackSprite(this.ship, 0, 0, false);//TODO: shift over to actual position of gun
    //second weapon, fires left relative to the ship
    this.weapon2 = this.game.add.weapon(100, 'cannonball');
    this.weapon2.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.weapon2.bulletLifespan = 650;
    this.weapon2.bulletSpeed = 600;
    this.weapon2.fireRate = 10;
    this.weapon2.bulletAngleVariance = 10;
    this.weapon2.bulletCollideWorldBounds = false;
    this.weapon2.bulletWorldWrap = true;
    this.weapon2.trackSprite(this.ship, 0, 0, false);//TODO: shift over to actual position of gun

    //TODO: have a kill counter, increase number of shots fired each shot
    //when a shot is fired, scatter them randomly a little bit
    //kill bullets when they overlap with islands or ships
    //figure out why sometimes bullets continue forever instead of dying when the
    //player spins and fires for an extended period of time


    // Enable physics on the ship
    this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);

    // Set maximum velocity
    this.ship.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); // x, y

    // Add drag to the ship that slows it down when it is not accelerating
    //this.ship.body.drag.setTo(this.DRAG, this.DRAG); // x, y
    //A game decision was made that the ship doesn't slow down unless it crashes


    // Capture certain keys to prevent their default actions in the browser.
    // This is only necessary because this is an HTML5 game. Games on other
    // platforms may not need code like this.
    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN
    ]);
    this.ship.body.collideWorldBounds = false;//lets the ship wrap around the world

};





// The update() method is called every frame
GameState.prototype.update = function() {
  this.weapon.fireAngle = this.ship.angle + 90; //make the shots fire sideways
  this.weapon2.fireAngle = this.ship.angle - 90;
  //game.physics.arcade.overlap(this.islands , this.weapon.bullets, islandWasShot());
  //game.physics.arcade.overlap(this.islands , this.weapon2.bullets, islandWasShot());

  //TODO: refactor into separate method
  //checks the direction the ship is going, and checks it agianst the wind to
  //determine if the ship is going in the correct direction

  if (this.ship.angle >= 45 && this.ship.angle <135){ //ship pointing south
      this.direction = checkWind('S');
  } else if (this.ship.angle >= 135 && this.ship.angle <225){//ship pointing west
      this.direction = checkWind('W');
  } else if (this.ship.angle < -45 && this.ship.angle >= -135){//ship pointing north
      this.direction = checkWind('N');
  } else {//east
      this.direction = checkWind('E');
  }

  switch(this.direction){
    case 'U':
      if (this.MAX_SPEED > 100){
        this.MAX_SPEED = this.MAX_SPEED - 10;
      } else {
        this.MAX_SPEED = 100;
      }
      this.ACCELERATION = 45;
      break;
    case 'D':
    if (this.MAX_SPEED < 850){
      this.MAX_SPEED += 10;
    } else {
      this.MAX_SPEED = 850;
    }
    this.ACCELERATION = 180;
      break;
    default:
    if (this.MAX_SPEED < 500){
      this.MAX_SPEED += 10;
    } else if (this.MAX_SPEED > 500){
      this.MAX_SPEED -= 10;
    } else {
      this.MAX_SPEED = 500;
    }
      this.ACCELERATION = 90;
  }

    //  Collide the ship with the islands
    game.physics.arcade.collide(this.ship, this.islands, this.ship.health = playerWasHit);
    game.physics.arcade.collide(this.whitecaps, this.islands, whiteCapHit);
    game.physics.arcade.collide(this.ship, this.whitecaps, whiteCapHit);

    if (this.game.time.fps !== 0) {
       // this.fpsText.setText(this.game.time.fps + ' FPS');

        this.fpsText.setText(frontier + ' FPS');

    }

    // Keep the ship on the screen
    if (this.ship.x > this.game.width) this.ship.x = 0;
    if (this.ship.x < 0) this.ship.x = this.game.width;
    if (this.ship.y > this.game.height) this.ship.y = 0;
    if (this.ship.y < 0) this.ship.y = this.game.height;


    //TODO: fix this, it's stupid
    var speed = Math.sqrt((this.ship.body.velocity.x * this.ship.body.velocity.x) + (this.ship.body.velocity.y * this.ship.body.velocity.y));
    var acceleration = Math.sqrt(this.ship.body.acceleration.x * this.ship.body.acceleration.x) + (this.ship.body.acceleration.y * this.ship.body.acceleration.y);

    if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        // If the LEFT key is down, rotate left
        this.ship.body.angularVelocity = -this.ROTATION_SPEED;
        this.ship.body.velocity.x = Math.cos(this.ship.rotation) * speed;
        this.ship.body.velocity.y = Math.sin(this.ship.rotation) * speed;
        this.ship.body.acceleration.x = Math.cos(this.ship.rotation) * acceleration;
        this.ship.body.acceleration.y = Math.sin(this.ship.rotation) * acceleration;

    } else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        // If the RIGHT key is down, rotate right
        this.ship.body.angularVelocity = this.ROTATION_SPEED;

        this.ship.body.velocity.x = Math.cos(this.ship.rotation) * speed;
        this.ship.body.velocity.y = Math.sin(this.ship.rotation) * speed;
        this.ship.body.acceleration.x = Math.cos(this.ship.rotation) * acceleration;
        this.ship.body.acceleration.y = Math.sin(this.ship.rotation) * acceleration;

    } else {
        // Stop rotating
        this.ship.body.angularVelocity = 0;
    }


    if (this.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        // If the UP key is down, thrust

        // Calculate acceleration vector based on this.angle and this.ACCELERATION
        this.ship.body.acceleration.x = Math.cos(this.ship.rotation) * this.ACCELERATION;
        this.ship.body.acceleration.y = Math.sin(this.ship.rotation) * this.ACCELERATION;

		this.wake = !this.wake;
        // Show the frame from the spritesheet with the engine on
        if (this.ship.body.velocity <= 50){
          this.wake = 0;
        } else if (this.ship.body.velocity <= 175){
          this.wake = 1;
        } else {
          this.wake = 2;
        }
       this.ship.frame = this.wake;
        if (this.wake === 3){
          this.wake = 0;
        }

    }  else if (this.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {

		// break...
      //  this.ship.body.acceleration.setTo(0, 0);
        // this.ship.body.velocity.setTo(0, 0);

        // Show the frame from the spritesheet with the engine off
      //  this.ship.frame = 0;

	} else {
        // Otherwise, stop thrusting
        this.ship.body.acceleration.setTo(0, 0);

        // Show the frame from the spritesheet with the engine off
        this.ship.frame = 0;
    }

//shoot both guns
  if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
    this.weapon.fire();
    this.weapon2.fire();
  }

  //changes the color of the ocean depending on the health of the player.
  //TODO: figure out optimum number of hits to take
  switch(this.health){
    case 0:
      console.log("You'd be dead if this game was finished");//run game over sequence...show score, kills ,wave,
      //maybe a fun historically accurate pirate fact too
      break;
    case 1:
      this.game.stage.backgroundColor = 0x0d2344//very dark sea
      break;
    case 2:
      this.game.stage.backgroundColor = 0x0b2c5e// dark sea, #0b2c5e
      break;
    case 3:
      this.game.stage.backgroundColor = 0x043b8e//moderately dark sea, #043b8e
      break;
    case 4:
      this.game.stage.backgroundColor = 0x065bdb//deep blue sea, #065bdb
      break;
    case 5:
      this.game.stage.backgroundColor = 0x14899b;//blue-green sea, #17b5d8
      break;
    case "invincible":
      this.game.stage.backgroundColor = 0xd81200;//invincibility power-up, red sea
      break;
    default://default health is 6. //TODO: balance health and damage
      this.game.stage.backgroundColor = 0x019ab2;// caribbean teal sea
  }

};

  //sets which sprite is being used based on the acceleration of the ship.
  //doesn't work exactly right, but works well enough.
  //TODO: add code to use left and right tack sprites
  function setWake(){
    if (this.ship.body.velocity <= 50){
      this.wake = 0;
    } else if (this.ship.body.velocity <= 175){
      this.wake = 1;
    } else {
      this.wake = 2;
    }
    this.ship.frame = this.wake;
  }

  //function to kill bullets when they hit islands. I couldn't get it working,
  //so it's commented out
/*
  function islandWasShot(){
    for (var i = 0; i < this.islands.length; i++){
      for (var b = 0; b < this.weapon.bullets.length; b++){
        //check for overlap
        //play sound
        //play explosion
        //bullet.kill();
      }
      for (var b = 0; b < this.weapon2.bullets.length; b++){
        //check for overlap
        //play sound
        //play explosion
        //bullet.kill();
      }
    }
  }
  */

function generateIslands(width, height, maxIslands, maxSize, tank, islands) {
  var numIslands = Math.random() * maxIslands;

for (var i = 0; i < numIslands; i++){
  var radius1 = Math.random() * maxSize;
  var radius2 = Math.random() * maxSize;
  var x = Math.random() * width;
  var y = Math.random() * height;
  var isDesert = Math.random()>0.5?true:false;
  //var rotation = Math.random() * 45;
  var graphics = this.game.add.graphics(0, 0);


  graphics.lineStyle(8, 0xffd900);
  if (isDesert === true){
    graphics.beginFill(0xffd900);
  } else {
    graphics.beginFill(0x249930);
  }
  graphics.drawRect(x, y, radius1, radius2);
  island = createIsland(x, y, radius1, radius2);
  islands.add(island);

}

function createIsland(x, y, radius1, radius2) {

    // create a new bitmap data object
    var bmd = this.game.add.bitmapData(radius1,radius2);
    // draw to the canvas context like normal
    bmd.ctx.beginPath();
    bmd.ctx.rect(x,y,radius1,radius2);
    bmd.ctx.fill();

    // use the bitmap data as the texture for the sprite
    var island = this.game.add.sprite(x, y, bmd);
    this.game.physics.arcade.enable(island);
    island.enableBody = true;
    island.body.collideWorldBounds = true;
    island.body.checkCollision.up = true;
	  island.body.checkCollision.down = true;
    island.body.immovable = true;
    //island.body.loadpolygon()
    return island;
}

}

//helper function to change the acceleration and top speed of the ship based on its direction
function checkWind(facing){
  switch(facing){//default is east
    case 'N':
      switch(wind){ //default is east
        case 'N':  return 'U'; break;
        case 'S': return 'D'; break;
        case 'W': return 'C'; break; //TODO: add code to use starboard-tack sprite
        default: return 'C'; //TODO: add code to use port-tack sprite
      } break;
    case 'S':
      switch(wind){
        case 'N': return 'D'; break;
        case 'S': return 'U'; break;
        case 'W': return 'C'; break; //TODO: add code to use port-tack sprite
        default:  return 'C';//TODO: add code to use starboard-tack sprite
      } break;
    case 'W':
      switch(wind){
        case 'N':  return 'C'; break;//TODO: add code to use starboard-tack sprite
        case 'S':  return 'C'; break; //TODO: add code to use port-tack sprite
        case 'W': return 'U'; break;
        default: return 'D';
      } break;
    default:
      switch(wind){
        case 'N':  return 'C'; break; //TODO: add code to use port-tack sprite
        case 'S': return 'C'; break; //TODO: add code to use starboard-tack sprite
        case 'W':  return 'D'; break;
        default:  return 'U';
      }
  }
}



//TODO: finish this function
//TODO: refactor into cleaner code
//implements whitecaps, which are ocean waves that tell the player where the wind is coming from
function generateWhitecaps(numWhiteCaps, speed){
  if (!waveIsOver){
    //make the whitecaps, make them go in the appropriate direction
    //set killWorldBounds to false so they loop around the world? or kill them and add new ones?
    switch(this.wind){//find the wind direction
      case 'N':
      for (var i = 0; i < numWhiteCaps; i++){
          //TODO: add random delay
          var x = Math.random() * this.width;
          var y = 0;
          var angle = 0;
          var xSpeed = 0;
          var ySpeed = speed;
          var whitecap = this.game.add.sprite(x, y, 'whitecap');
          this.game.physics.enable(whitecap, Phaser.Physics.ARCADE);
          whitecap.body.velocity.x = xSpeed;
          whitecap.body.velocity.y = ySpeed;
          initializeWhitecap(whitecap, angle); //add whitecap, correct angle
          this.whitecaps.push(whitecap);
      }
      break;
      case 'S':
      for (var i = 0; i < numWhiteCaps; i++){
          //TODO: add random delay
          var x = Math.random() * this.width;
          var y = this.height;
          var angle = 0;
          var xSpeed = 0;
          var ySpeed = 0 - speed;
          var whitecap = this.game.add.sprite(x, y, 'whitecap');
          this.game.physics.enable(whitecap, Phaser.Physics.ARCADE);
          whitecap.body.velocity.x = xSpeed;
          whitecap.body.velocity.y = ySpeed;
          initializeWhitecap(whitecap, angle); //add whitecap, correct angle
          this.whitecaps.push(whitecap);
        }
      break;
      case 'W':
      for (var i = 0; i < numWhiteCaps; i++){
          //TODO: add random delay
          var x = 0;
          var y = Math.random() * this.height;
          var angle = 90;
          var xSpeed = speed;
          var ySpeed = 0;
          var whitecap = this.game.add.sprite(x, y, 'whitecap');
          this.game.physics.enable(whitecap, Phaser.Physics.ARCADE);
          whitecap.body.velocity.x = xSpeed;
          whitecap.body.velocity.y = ySpeed;
          initializeWhitecap(whitecap, angle); //add whitecap, correct angle
          this.whitecaps.push(whitecap);
        }
      default: //east
      for (var i = 0; i < numWhiteCaps; i++){
          //TODO: add random delay
          var x = this.width;
          var y = Math.random() * this.height;
          var angle = -90;
          var xSpeed = 0 - speed;
          var ySpeed = 0;
          var whitecap = this.game.add.sprite(x, y, 'whitecap');
          this.game.physics.enable(whitecap, Phaser.Physics.ARCADE);
          whitecap.body.velocity.x = xSpeed;
          whitecap.body.velocity.y = ySpeed;
          initializeWhitecap(whitecap, angle, xSpeed, ySpeed); //add whitecap, correct angle
          this.whitecaps.push(whitecap);
    }
  }
    //create the whitecaps
    //make the whitecaps come from the appropriate direction
    //make the whitecaps move at the speed of the speed parameter
  } else {
    //stop making new whitecaps
    //if it's not (depending on how we implement the whitecaps), change killWorldBounds to true
    whitecap.body.collideWorldBounds = true;//let the whitecaps leave the screen
    //wait a specified amount of time
    //randomize the wind direction
    //start new whitecaps
    this.waveIsOver = false;//set waveIsOver to false again, set everything back to how it was
  }
}

function initializeWhitecap(whitecap, angle){
  whitecap.anchor.setTo(0.5, 0.5);
  whitecap.angle = angle;
  this.game.physics.enable(whitecap, Phaser.Physics.ARCADE);
  whitecap.enableBody = true;
  whitecap.body.collideWorldBounds = false;

  //in case we want to have animated whitecaps instead of static ones
  //whitecap.frame = Math.floor(Math.random() * 5);
  //whitecap.waveForm = Math.random() > 0.5 ? 1 : -1;

}

//TODO: take redundant code from this and generateWhitecaps and refactor it into a helper
function whiteCapHit(whitecap){
    //TODO: make wave crashing sound?
    //TODO: create explosion animation for whitecaps
    //var explosion = explosions.getFirstExists(false);
    //explosion.play('whitecapSound', 10, false, true);
    //explosion_sound.play("",0,.5,false,true);
    whitecap.kill();
    //TODO: add fixed delay
    var newWhiteCap = this.game.add.sprite(x, y, 'whitecap');
    this.game.physics.enable(newWhitecap, Phaser.Physics.ARCADE);
    switch(this.wind){
      case 'N':
          var x = Math.random() * this.width;
          var y = 0;
          var angle = 90;
          var xSpeed = 0;
          var ySpeed = speed;
          newWhitecap.body.velocity.x = xSpeed;
          newWhitecap.body.velocity.y = ySpeed;
          initializeWhitecap(newWhitecap, angle, xSpeed, ySpeed);
        break;
      case 'S':
          var x = Math.random() * this.width;
          var y = this.height;
          var angle = -90;
          var xSpeed = 0;
          var ySpeed = speed;
          newWhitecap.body.velocity.x = xSpeed;
          newWhitecap.body.velocity.y = ySpeed;
          initializeWhitecap(newWhitecap, angle, xSpeed, ySpeed);
        break;
      case 'W':
          var x = 0;
          var y = Math.random() * this.height;
          var angle = 0;
          var xSpeed = speed;
          var ySpeed = 0;
          newWhitecap.body.velocity.x = xSpeed;
          newWhitecap.body.velocity.y = ySpeed;
          initializeWhitecap(newWhitecap, angle, xSpeed, ySpeed);
        break;
      default://east
          var x = this.width;
          var y = Math.random() * this.height;
          var angle = 180;
          var xSpeed = speed;
          var ySpeed = 0;
          newWhitecap.body.velocity.x = xSpeed;
          newWhitecap.body.velocity.y = ySpeed;
      initializeWhitecap(newWhitecap, angle);
    }
    this.whitecaps.push(newWhiteCap);
}

/*
At the moment, this function breaks the game if the player spawns on an island.
This is something that needs to be fixed...later. For now, we can just leave the
game-breaking bit (this.ship.damage) commented out.
*/
function playerWasHit(){
    //this.ship.damage(1);
    //TODO: add bounce so the ship doesn't lose all its health from crashing into an island
    //TODO: add sound for when the player is hit
    console.log("We've been hit, Captain! " + this.ship.health);
    return this.ship.health;
}

GameState.prototype.render =function() {
  this.weapon.debug();
}

/*TODO: Long-term goals
-add enemiy ships, make them have colored rings/circles around them?
-make enemy ships avoid islands, move towards the player, and turn to shoot when in range
-implement health, perhaps by a changing sea color
-implement power-ups: temporary invincibility(red sea), health, ability to slow down,
 and ability to launch a boarding pirate that one-hits enemy ships
 -make weapons fire better after the player gets more kills
 -implement score: killed enemies drop loot, and loot  washes in from the direction of the wind,
 and must be picked up to score points.
 -implement waves of increasing difficulty
 -boss battles? multiple kinds of enemies?
 -title/intro screen
 -high score?
*/

//-----------------------------------------------------------------------------


//var game = new Phaser.Game(848, 450, Phaser.AUTO, 'game');
var game = new Phaser.Game(960, 650, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);
