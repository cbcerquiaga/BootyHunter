// This example uses the Phaser 2.0.4 framework

//-----------------------------------------------------------------------------
//BOOTYHUNTER: A SWASHBUCKLING ADVENTURE
//Concept by Blake Erquiaga
//Written by Blake Erquiaga, Dan Zweiner, Jason Watts, Liem Gearen, David Queen
//Special thanks to Dr. Thomas Houpt and Dr. Forrest Stonedahl

//global variables
var player1;//represents playable character
var storage1;//stores things like the wave count and the
var width = 960, height = 650;
var score = 0;
var fireButtonHeld = 0;
var treasureMinVal = {'silverCoin': 10, 'goldCoin': 80, 'emerald': 100, 'purpleGem': 150, 'diamond': 0};
var numRandTreasure = 0;
var alreadyTreasure = false;

//wind global variables
var wind = 'S'; //the direction the wind is coming from. N means the wind blows north to south, N,S,E,W
var direction = 'C'; //P, S, U, D
var startWake = 0;

//enemy global variables
var wave;
var numEnemies;
var enemyDownWindSpeed = {'gunboat': 100, 'manowar': 400, 'normal': 650, 'dhow': 500};
var enemyCrossWindSpeed = {'gunboat': 60, 'manowar': 250, 'normal': 300, 'dhow': 850};//the dhow goes faster across the wind than down
var enemyUpWindSpeed = {'gunboat': 35, 'manowar': 100, 'normal': 150, 'dhow': 250};
var enemyHealth = {'gunboat': 1, 'manowar': 12, 'normal': 6, 'dhow': 3};
var enemyDifficulty = {'gunboat': 1, 'manowar': 10, 'normal': 5, 'dhow': 10};
var enemyTurnRate = {'gunboat': 120, 'manowar': 135, 'normal': 180, 'dhow': 240};
var waveDifficulty;

//-----------------------------------------------------------------------------

var GameState = function(game) {
};

// Load images and sounds
GameState.prototype.preload = function() {
  //  this.game.load.spritesheet('ship', 'assets/gfx/ship.png', 32, 32);
    this.game.load.spritesheet('ship', 'assets/boatLoRes.png', 38, 32);
    this.game.load.image('cannonball', 'assets/cannonball.png');
    this.game.load.image('treasureChest', 'assets/treasureChest.png');
    this.game.load.image('whitecap', 'assets/whitecap.png');
    this.game.load.spritesheet('gunboat', 'assets/gunBoat.png', 25, 19);
    this.game.load.spritesheet('manowar', 'assets/manOwar.png', 59, 32);
    this.game.load.spritesheet('normal', 'assets/enemyBoatLoRes.png', 38, 32);
    this.game.load.spritesheet('dhow', 'assets/dhow.png', 40, 32);
    this.game.load.image('silverCoin', 'assets/silverCoin.png');
    this.game.load.image('goldCoin', 'assets/goldCoin.png');
    this.game.load.image('emerald', 'assets/emerald.png');
    this.game.load.image('purpleGem', 'assets/purpleGem.png');
    this.game.load.image('diamond', 'assets/diamond.png');
    this.game.load.image('kraken', 'assets/Kraken.png');
    this.game.load.spritesheet('tentacle', 'assets/tentacles.png', 38, 8);
    this.game.load.image('seagull', 'assets/seagull.png');
    this.game.load.image('pelican', 'assets/pelican.png');
    this.game.load.image('albatross', 'assets/albatross.png');
    this.game.load.image('parrot', 'assets/parrot.png');
    this.game.load.image('gameOver', 'assets/gameOver.png');
    console.log("Hello world");
};

// Setup the example
GameState.prototype.create = function() {
    // Set stage background color
//    this.game.stage.backgroundColor = 0x111111;
  var scoreIndicator = this.game.add.sprite(16, 22, 'treasureChest');
  this.scoreText = game.add.text(40, 16, '', { fontSize: '16px', fill: '#FFF' });

  //TODO: remove redundant code
  this.numEnemies = 2;
  //console.log("wave: " + wave + " waveDifficulty: " + waveDifficulty);

  //player1.kills = 0;
  //console.log("kills: " + playerKills);

  this.fireButtonHeld = 0;

  //instantiates boss data
    this.killedBosses = new Array();
    this.allBosses = ['kraken'];

  //adds islands to map
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.islands = this.game.add.group();
    this.islands.enableBody = true;
    generateIslands(width, height, 20, 100, 'ship', this.islands);

    //creates whitecaps group
    this.whitecaps = this.game.add.group();
    this.whitecaps.enableBody = true;

    //creates powerups group
    this.powerups = this.game.add.group();
    this.powerups.enableBody = true;

    //creates enemies group
    this.enemies = this.game.add.group();
    this.enemies.enableBody = true;


    // Define motion constants
    this.ROTATION_SPEED = 180; // degrees/second
    this.ACCELERATION = 90; // pixels/second/second
    this.MAX_SPEED = 850; // pixels/second. This is the max max speed in the game
    this.DRAG = 50; // pixels/second
    this.wake = this.startWake; // starting wake sprite

    // Add the ship to the stage
    var place = new Array();
    var searchDirection = 'S'
    var searchDistance = 10;
    player1 = new ship(this.game.add.sprite(this.game.width/2, this.game.height/2, 'ship'));
    var treasureGroup = this.game.add.group();
    storage1 = new  storage(treasureGroup);
    //makes sure the ship isn't overlapping with any islands
    console.log(player1.sprite.overlap(island));
    /*for (var i = 0; i < this.islands.children.length; i++){
      var island = this.islands.children[i];
      game.physics.arcade.collide(player1.sprite, island);

      while (player1.sprite.overlap(island) === true){
        switch(searchDirection){
          case 'N':
            player1.y -= searchDistance;
            searchDistance += 10;
            searchDirection = 'W';
          break;
          case 'S':
            player1.y += searchDistance;
            searchDistance += 10;
            searchDirection = 'E';
          break;
          case 'W':
            player1.x -= searchDistance;
            searchDistance += 10;
            searchDirection = 'S';
          break;
          default://east
            player1.x += searchDistance;
            searchDistance += 10;
            searchDirection = 'N';
        }
      }
    }*/
    /*this.ship.health = 6;//moved to ship.js
    //this.ship.setHealth(6);
    //this.ship.anchor.setTo(0.5, 0.5);
    //this.ship.angle = -90; // Point the ship up
    //this.ship.enableBody = true;*///all of this was moved to ship.js


    //console.log(this.game.add);
    //first weapon, fires right relative to the ship
    this.weapon = this.game.add.weapon(100, 'cannonball');
    this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.weapon.bulletLifespan = 650;
    this.weapon.bulletSpeed = 600;
    this.weapon.fireRate = 10;
    this.weapon.bulletAngleVariance = 10;
    this.weapon.bulletCollideWorldBounds = false;
    this.weapon.bulletWorldWrap = true;
    this.weapon.trackSprite(player1.sprite, 0, 0, false);//TODO: shift over to actual position of gun
    //second weapon, fires left relative to the ship
    this.weapon2 = this.game.add.weapon(100, 'cannonball');
    this.weapon2.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.weapon2.bulletLifespan = 650;
    this.weapon2.bulletSpeed = 600;
    this.weapon2.fireRate = 10;
    this.weapon2.bulletAngleVariance = 10;
    this.weapon2.bulletCollideWorldBounds = false;
    this.weapon2.bulletWorldWrap = true;
    this.weapon2.trackSprite(player1.sprite, 0, 0, false);//TODO: shift over to actual position of gun
    //boarding pirate, can only be used when hasPirate === true
    //TODO: make the andle point towards the nearest enemy
    this.boarder = this.game.add.weapon(1, 'parrot'); //TODO: add pirate sprite and animation
    this.boarder.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.boarder.bulletLifespan = 650;
    this.boarder.bulletSpeed = 100;
    this.boarder.bulletInheritSpriteSpeed = true;
    this.boarder.bulletCollideWorldBounds = false;
    this.boarder.bulletWorldWrap = true;
    this.boarder.trackSprite(player1.sprite, 0, 0, false);

    // Enable physics on the ship
    this.game.physics.enable(player1.sprite, Phaser.Physics.ARCADE);
    player1.enablePhysics();

    // Set maximum velocity
    //this.ship.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); // x, y// Moved to ship.js

    // Add drag to the ship that slows it down when it is not accelerating
    //this.ship.body.drag.setTo(this.DRAG, this.DRAG); // x, y
    //A game decision was made that the ship doesn't slow down unless it crashes


    // Capture certain keys to prevent their default actions in the browser.
    // This is only necessary because this is an HTML5 game. Games on other
    // platforms may not need code like this.
    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.A,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.D,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.W,
        Phaser.Keyboard.DOWN,
        Phaser.Keyboard.S,
        Phaser.Keyboard.SPACEBAR

    ]);
    //this.ship.body.collideWorldBounds = false;//lets the ship wrap around the world

};





// The update() method is called every frame
GameState.prototype.update = function () {
    this.weapon.fireAngle = player1.sprite.angle + 90; //make the shots fire sideways
    this.weapon2.fireAngle = player1.sprite.angle - 90;
    this.boarder.fireAngle = player1.sprite.angle;//TODO: point towards nearest enemy
  //collides whitecaps with the world
  game.physics.arcade.overlap(player1.sprite, this.whitecaps, whiteCapHitShip);
  game.physics.arcade.overlap(this.islands, this.whitecaps, whiteCapHitIsland);
  game.physics.arcade.overlap(this.enemies, this.whitecaps, whiteCapHitShip);

  game.physics.arcade.overlap(this.islands, this.weapon.bullets, islandWasShot);
  game.physics.arcade.overlap(this.islands, this.weapon2.bullets, islandWasShot);
  game.physics.arcade.overlap(this.islands, this.boarder.bullets, islandWasShot);
  game.physics.arcade.overlap(this.enemies, this.weapon.bullets, enemyWasShot);
  game.physics.arcade.overlap(this.enemies, this.weapon2.bullets, enemyWasShot);
  game.physics.arcade.overlap(this.enemies, this.boarder.bullets, enemyBoarded);

  game.physics.arcade.overlap(player1.sprite, storage1.getTreasures(), collectTreasure);
  game.physics.arcade.collide(storage1.getTreasures(), this.enemies);
  game.physics.arcade.collide(storage1.getTreasures(), this.islands);

  game.physics.arcade.overlap(player1.sprite, this.powerups, collectPowerUp);

  //  Collide the player and enemy ships with the islands
  game.physics.arcade.collide(player1.sprite, this.islands, playerHitIsland);
  game.physics.arcade.collide(this.enemies, this.islands, enemyHitIsland);

  game.physics.arcade.collide(player1.sprite, this.enemies, shipsCollided);//TODO: add function to check if the player is invincible
  game.physics.arcade.collide(this.enemies, this.enemies, shipsCollided);

  //console.log(player1.sprite.body.velocity.x + " " + player1.sprite.body.velocity.y);
  //if there are no enemies, then the game moves to the next wave
  //console.log(this.enemies.countLiving());


  //score
  var scoreString = player1.getScore().toString();
  this.scoreText.text = scoreString;


  if (this.enemies.countLiving() <= 0){ //all enemies are dead, the wave is over
    //sets up the initial wave: randomizes the wind and generates 2 gunboats
    if (storage1.getWave() === 0){
      storage1.nextWave();
      generateEnemies(storage1.getWave(), 2, this.wind, this.enemies, true);
    } else if (storage1.getWave() === 5 || storage1.getWave() === 15 || storage1.getWave() === 25 || storage1.getWave() === 35 || storage1.getWave() === 45 || storage1.getWave() >= 55){ //boss wave
      if (this.allBosses.length - 1 <= this.killedBosses.length){
        this.killedBosses = [];
      }
      //TODO: implement this with a hashmap for random access rather than fixed order
      for (var i = 0; i < this.allBosses.length; i++){
        var bossType = this.allBosses[i];
        if (this.allBosses[i], this.killedBosses.indexOf(bossType) === -1){
          var boss = bossWave(bossType);
          this.enemies.add(boss);
        }
      }
    } else {
      storage1.nextWave();
      this.numEnemies += Math.round(1.5 * storage1.getWave());
      console.log("Wave: " + storage1.getWave() + "NumEnemies: " + this.numEnemies);
      generateEnemies(storage1.getWave(), this.numEnemies, this.wind, this.enemies, false);
    }
      var randWind = Math.random();
      if (randWind < 0.25){
        this.wind = 'N';
      } else if (randWind < 0.5){
        this.wind = 'S';
      } else if (randWind < 0.75){
        this.wind = 'W';
      } else {
        this.wind = 'E';
      }
      //console.log(this.wind + " wind global");
    //console.log(this.wind + " wind global");
  }

  //keeps a steady flow of whitecaps on the screen
  generateWhitecaps(45, this.whitecaps, this.wind);
  //console.log(player1.getKills());

  //randomly adds powerups
  this.alreadyTreasure = randomPowerUp(this.powerups, this.alreadyTreasure);

  //washes up treasure once per wave
  if (numRandTreasure < storage1.getWave()){
    //console.log("We need more treasure!");
    var treasure = randTreasure(numRandTreasure, this.wind);
    if (treasure != undefined){
      numRandTreasure++;
      storage1.addTreasure(treasure);
    }
  }


  for (var i = 0; i < this.enemies.countLiving(); i++){
    var enemy = this.enemies.children[i];
    //console.log(enemy + " looping through living enemies.");
    var oldXSpeed = enemy.body.velocity.x;
    var oldYSpeed = enemy.body.velocity.y;
      //console.log(enemy + " in loop");
      if (enemy.key === 'gunboat'){
        //console.log("it's a gunboat");
        enemy.frame = squareSailCheckWind(enemy.angle, this.wind); //figure out the ship's orientation
        enemy.maxSpeed = enemyMaxSpeed(enemy.frame, enemy.maxSpeed, 'gunboat'); //adjust the sprite accordingly
        var speedArray = enemyActualSpeed(enemy.maxSpeed, enemy.body.velocity.x, enemy.body.velocity.y);
        enemy.body.velocity.x = speedArray[0];
        enemy.body.velocity.y = speedArray[1];
        gunBoatAI(enemy, this.wind); //the ship chases the player or runs away, turns to shoot
        avoidIslands(enemy, this.islands); //the ship tries to avoid islands
      } else if (enemy.key === 'normal'){
        enemy.frame = squareSailCheckWind(enemy.angle, this.wind);
        enemy.maxSpeed = enemyMaxSpeed(enemy.frame, enemy.maxSpeed, 'normal');
        var speedArray = enemyActualSpeed(enemy.maxSpeed, enemy.body.velocity.x, enemy.body.velocity.y);
        enemy.body.velocity.x = speedArray[0];
        enemy.body.velocity.y = speedArray[1];
        normalAI(enemy, this.wind);
        avoidIslands(enemy, this.islands);
      } else if (enemy.key === 'manOwar'){
        enemy.frame = squareSailCheckWind(enemy.angle, this.wind);
        enemy.maxSpeed = enemyMaxSpeed(enemy.frame, enemy.maxSpeed, 'manOwar');
        var speedArray = enemyActualSpeed(enemy.maxSpeed, enemy.body.velocity.x, enemy.body.velocity.y);
        enemy.body.velocity.x = speedArray[0];
        enemy.body.velocity.y = speedArray[1];
        manOwarAI(enemy, this.wind);
        avoidIslands(enemy, this.islands);
      } else if (enemy.key === 'dhow'){
        enemy.frame = dhowCheckWind(enemy.angle, this.wind);
        enemy.maxSpeed = enemyMaxSpeed(enemy.frame, enemy.maxSpeed, 'normal');
        var speedArray = enemyActualSpeed(enemy.maxSpeed, enemy.body.velocity.x, enemy.body.velocity.y);
        enemy.body.velocity.x = speedArray[0];
        enemy.body.velocity.y = speedArray[1];
        normalAI(enemy, this.wind);
        avoidIslands(enemy, this.islands);
      } else {//boss

      }
      if (Math.abs(enemy.body.velocity.x) > oldXSpeed || Math.abs(enemy.body.velocity.y) > oldYSpeed){
        enemy.frame += 2;
    }
  }


  //TODO: refactor into separate method
  //checks the direction the ship is going, and checks it agianst the wind to
  //determine what sprites the ship should be using
  if (player1.sprite.angle >= 45 && player1.sprite.angle <135){ //ship pointing south

      this.direction = checkWind('S', this.wind);
      switch(this.direction){
        case 'D': this.startWake = 0; break;
        case 'P': this.startWake = 6; break;
        case 'S': this.startWake = 3; break;
        default:
          this.startWake = 9;
    }
  } else if ((player1.sprite.angle >= 135 && player1.sprite.angle <225) || (player1.sprite.angle >= -225 && player1.sprite.angle < -135)){//ship pointing west
      this.direction = checkWind('W', this.wind);
      switch(this.direction){
        case 'D': this.startWake = 0; break;
        case 'P': this.startWake = 6; break;
        case 'S': this.startWake = 3; break;
        default:
          this.startWake = 9;
    }
  } else if ((player1.sprite.angle < -45 && player1.sprite.angle >= -135)|| (player1.sprite.angle < 315 && player1.sprite.angle >= 225)){//ship pointing north
      this.direction = checkWind('N', this.wind);
      switch(this.direction){
        case 'D': this.startWake = 0; break;
        case 'P': this.startWake = 6; break;
        case 'S': this.startWake = 3; break;
        default:
          this.startWake = 9;
    }
  } else {//east
      this.direction = checkWind('E', this.wind);
      switch(this.direction){
        case 'D': this.startWake = 0; break;
        case 'P': this.startWake = 6; break;
        case 'S': this.startWake = 3; break;
        default:
          this.startWake = 9;
    }
  }

  switch(this.direction){
    case 'U':
      if (this.MAX_SPEED > 150){
        this.MAX_SPEED = this.MAX_SPEED - 10;
      } else {
        this.MAX_SPEED = 150;
      }
      this.ACCELERATION = 30;//previously 50
      break;
    case 'D':
    if (this.MAX_SPEED < 650){//previously 850
      this.MAX_SPEED += 20;
    } else {
      this.MAX_SPEED = 650;
    }
    this.ACCELERATION = 180;
      break;
    default://P or S
    if (this.MAX_SPEED < 300){//previously 500
      this.MAX_SPEED += 10;
    } else if (this.MAX_SPEED > 300){
      this.MAX_SPEED -= 10;
    } else {
      this.MAX_SPEED = 300;
    }
      this.ACCELERATION = 90;
  }

  if (Math.abs(player1.sprite.body.velocity.x) > this.MAX_SPEED){
    if (player1.sprite.body.velocity.x > 0){
      player1.sprite.body.velocity.x -= 10;
    } else {
      player1.sprite.body.velocity.x += 10;
    }
  }
  if (Math.abs(player1.sprite.body.velocity.y) > this.MAX_SPEED){
    if (player1.sprite.body.velocity.y > 0){
      player1.sprite.body.velocity.y -= 10;
    } else {
      player1.sprite.body.velocity.y += 10;
    }
  }




    if (this.game.time.fps !== 0) {
       // this.fpsText.setText(this.game.time.fps + ' FPS');

        this.fpsText.setText(frontier + ' FPS');

    }

    // Keep the ship on the screen
    if (player1.sprite.x > this.game.width) player1.sprite.x = 0;
    if (player1.sprite.x < 0) player1.sprite.x = this.game.width;
    if (player1.sprite.y > this.game.height) player1.sprite.y = 0;
    if (player1.sprite.y < 0) player1.sprite.y = this.game.height;

    //keep the enemies on the screen
    for (var i = 0; i < this.enemies.children.length; i++){
      var enemy = this.enemies.children[i];
      if (enemy.centerX > this.game.width) enemy.centerX = 0;
      if (enemy.centerX < 0) enemy.centerX = this.game.width;
      if (enemy.centerY > this.game.height) enemy.centerY = 0;
      if (enemy.centerY < 0) enemy.centerY = this.game.height;
    }



    var speed = Math.sqrt((player1.sprite.body.velocity.x * player1.sprite.body.velocity.x) + (player1.sprite.body.velocity.y * player1.sprite.body.velocity.y));
    var acceleration = Math.sqrt(player1.sprite.body.acceleration.x * player1.sprite.body.acceleration.x) + (player1.sprite.body.acceleration.y * player1.sprite.body.acceleration.y);

    if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)  || this.input.keyboard.isDown(Phaser.Keyboard.A)) {
        // If the LEFT key is down, rotate left
        player1.sprite.body.angularVelocity = -this.ROTATION_SPEED;
        player1.sprite.body.velocity.x = Math.cos(player1.sprite.rotation) * speed;
        player1.sprite.body.velocity.y = Math.sin(player1.sprite.rotation) * speed;
        player1.sprite.body.acceleration.x = Math.cos(player1.sprite.rotation) * acceleration;
        player1.sprite.body.acceleration.y = Math.sin(player1.sprite.rotation) * acceleration;

    } else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)  || this.input.keyboard.isDown(Phaser.Keyboard.D)) {
        // If the RIGHT key is down, rotate right
        player1.sprite.body.angularVelocity = this.ROTATION_SPEED;

        player1.sprite.body.velocity.x = Math.cos(player1.sprite.rotation) * speed;
        player1.sprite.body.velocity.y = Math.sin(player1.sprite.rotation) * speed;
        player1.sprite.body.acceleration.x = Math.cos(player1.sprite.rotation) * acceleration;
        player1.sprite.body.acceleration.y = Math.sin(player1.sprite.rotation) * acceleration;

    } else {
        // Stop rotating
        player1.sprite.body.angularVelocity = 0;
    }


    if (this.input.keyboard.isDown(Phaser.Keyboard.UP)  || this.input.keyboard.isDown(Phaser.Keyboard.W)) {
        // If the UP key is down, thrust

        // Calculate acceleration vector based on this.angle and this.ACCELERATION
        player1.sprite.body.acceleration.x = Math.cos(player1.sprite.rotation) * this.ACCELERATION;
        player1.sprite.body.acceleration.y = Math.sin(player1.sprite.rotation) * this.ACCELERATION;

        //TODO: figure out why the partially accelerated sprite isn't used
      	this.wake = !this.wake;
        //console.log("start wake: " + this.startWake);
        // Show the frame from the spritesheet with the engine on
        //console.log("start wake " + this.startWake);
        if (player1.sprite.body.velocity <= 50){
          this.wake = this.startWake;
        } else if (player1.sprite.body.velocity <= 300){
          this.wake = this.startWake + 1;
        } else {
          this.wake = this.startWake + 2;
        }
        if (this.wake > this.startWake + 3 || this.wake < this.startWake){
          this.wake = this.startWake;
        }
      player1.sprite.frame = this.wake;

    }  else if (this.input.keyboard.isDown(Phaser.Keyboard.DOWN) || this.input.keyboard.isDown(Phaser.Keyboard.S)) {
      //console.log("pressing DOWN " + player1.getPirate());
          if (player1.getPirate()){
            //console.log("prepare the boarding party!");
            this.boarder.fire();
            player1.removePirate();
          }

	} else {
        // Otherwise, stop thrusting
        player1.sprite.body.acceleration.setTo(0, 0);

        // Show the frame from the spritesheet with the engine off
        player1.sprite.frame = this.startWake;
    }

//shoot both guns
  if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
    this.weapon.fire();
    this.weapon2.fire();
    this.fireButtonHeld++;
  } else { //reduce the fireButtonHeld value
      if (this.fireButtonHeld > 0)
        this.fireButtonHeld -= 1; //TODO: balance cooldown time vs spam time. Should it be longer? Should it be shorter?
      if (this.fireButtonHeld < 0)
        this.fireButtonHeld = 0;
  }

  if (player1.getKills() >= 10){
    this.weapon.bulletLifespan = 650;
    this.weapon2.bulletLifespan = 650;
  } else {
    this.weapon.bulletLifespan = 200 + 50 * (player1.getKills());
    this.weapon2.bulletLifespan = 200 + 50 * (player1.getKills());
  }

    //forces the player to not hold down the fire button by reducing the fireRate
    //originally wanted this in a separate function, but it didn't work for some reason
    //TODO: balance out the spam time value. Is 90 too long? Is it too short?
    //TODO: balance out slow down rate. Is 10% of the fireButtonHeld time too harsh?
      var newFireRate = 10;
      if (this.fireButtonHeld >= 90){
        newFireRate = newFireRate * (this.fireButtonHeld/10);
      }
    this.weapon.fireRate = newFireRate;
    this.weapon2.fireRate = newFireRate;


  //changes the color of the ocean depending on the health of the player.
  if(player1.health < 0) {
    player1.health = 0;
  }
  switch(player1.health){
    case 0:
      console.log("You'd be dead if this game was finished");//run game over sequence...show score, kills ,wave,
      gameOverSequence(player1.getScore(), storage1.getWave(), player1.getKills(), this.bossesKilled);
      //maybe a fun historically accurate pirate fact too
      break;
    case 1:
      if (this.game.stage.backgroundColor != 0x0d2344) {
          this.game.stage.backgroundColor = 0x0d2344
      }
      break;
    case 2:
      if (this.game.stage.backgroundColor != 0x0b2c5e) {
        this.game.stage.backgroundColor = 0x0b2c5e// dark sea, #0b2c5e
      }
      break;
    case 3:
      if (this.game.stage.backgroundColor != 0x124375) {
        this.game.stage.backgroundColor = 0x124375//moderately dark sea
      }
      break;
    case 4:
      if (this.game.stage.backgroundColor != 0x136875){
        this.game.stage.backgroundColor = 0x136875//dark blue-green sea
      }
      break;
    case 5:
      if(this.game.stage.backgroundColor != 0x14899b){
        this.game.stage.backgroundColor = 0x14899b;//blue-green sea
      }
      break;
    case "invincible":
      if(this.game.stage.backgroundColor != 0xb52012){
        this.game.stage.backgroundColor = 0xb52012;//invincibility power-up, red sea
      }
      break;
    default://default health is 6.
      if(this.game.stage.backgroundColor != 0x019ab2){
        this.game.stage.backgroundColor = 0x019ab2;// caribbean teal sea
      }
  }


};

function generateEnemies(wave, numEnemies, wind, enemies, isFirstWave){
//  console.log(wind + " wind in generateEnemies");
  var enemy;
  //TODO: figure out if this is redundant or efficient
  if (isFirstWave){
    enemy = initializeEnemy('gunboat', wind, enemies);
    enemies.add(enemy);
    enemy = initializeEnemy('gunboat', wind, enemies);
    enemies.add(enemy);
    //console.log("live enemies after production: " + enemies.countLiving());
  } else {
    //console.log("not the first wave");
    for (var i = 0; i <= numEnemies; i++){
    //console.log("in the loop: " + enemies.countLiving());
    //TODO: find a way to weight the selection to favor a certain type of enemy if one of that type has already been added to the wave
      var shipChosen = false;
      if ((wave) >= 4 && !shipChosen){ //difficulty value of the man o' war and dhow
        var useThisSprite = Math.random()>0.5?true:false; //TODO: balance frequency of selecting hardest available enemy
        if (useThisSprite){
          shipChosen = true;
          var useDhow =  Math.random()>0.5?true:false; //determines whether to use dhow or man o' war
          if (useDhow){//create a dhow
            enemy = initializeEnemy('dhow', wind);
            enemies.add(enemy);
            i += 10;
          } else {// create a man o war
            enemy = initializeEnemy('manowar', wind);
            enemies.add(enemy);
            i +=10;
          }
        }
    }
    if ((waveDifficulty) >= 2 && !shipChosen){
      var useThisSprite = Math.random()>0.5?true:false;//TODO: balance freequency of selecting hardest available enemy
      if (useThisSprite){
        shipChosen = true;
        enemy = initializeEnemy('normal', wind);
        enemies.add(enemy);
        i += 2;
      }
    }
    if (!shipChosen){//no other ship was chosen and/or the remaining difficulty value is too low
      shipChosen = true;
      enemy = initializeEnemy('gunboat', wind);
      enemies.add(enemy);
      i ++;
    }
  }
}
}

  //function to kill bullets when they hit islands. I couldn't get it working,
  //so it's commented out

  function islandWasShot(island, bullet){
    bullet.kill();
    //TODO: add explosion
    //play explosion sound
    /*
    var explosion = explosions.getFirstExists(false);

    explosion.reset( bullet.body.x ,bullet.body.y);
    explosion.play('explosion', 10, false, true);
    explosion_sound.play("",0,.5,false,true);
    */
  }

  function enemyWasShot(enemy, bullet){
    bullet.kill();
    enemy.health--;
    console.log("bang! " + enemy.health);
    //TODO: add explosion
    //play explosion sound
    if (enemy.type === 'kraken'){
      if (enemy.health > 0){
        moveKraken(enemy);
        return 0;
      } else {
        spawnTreasure(enemy.x, enemy.y, 10);
        enemy.kill();
        player1.addKill();
        storage1.nextWave();
      }
    } else {

    if (enemy.health <= 0){
      spawnTreasure(enemy.x, enemy.y, 4);//spawn treasure
      enemy.kill();
      player1.addKill();
      //play explosion and sound
    }
    }
  }

  function enemyBoarded(enemy, boarder){
    var retVal = 0;
    boarder.kill();
    if (enemy.type === 'kraken'){retVal = 1;}
    enemy.kill();
    player1.addKill();
    var booty = spawnTreasure(enemy.x, enemy.y, 6);
    for (var i = 0; i < booty.length; i++){
      collectTreasure(player1, booty[i]);
    }
    return retVal;
  }

  function collectPowerUp(player, powerup){
    var type = powerup.key;
    switch(type){
      case 'seagull': player1.addHealth(1); break;
      case 'pelican': player1.addHealth(6); break;
      case 'parrot': player1.sprite.health = "invincible"; break; //TODO: make this work
      default://albatross
        player1.addPirate();
    //  console.log("The player has a pirate? " + player1.getPirate());
    }
    powerup.kill();
  }


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

//implements whitecaps, which are ocean waves that tell the player where the wind is coming from
function generateWhitecaps(speed, whitecaps, wind){
  var makeOrNot = Math.random()>0.02?false:true; //keeps the screen from being completely full of them
   if (makeOrNot){
    switch(wind){//find the wind direction
      case 'N':
          game.time.events.add(Math.random() * 10000, function(){
            var x = Math.random() * this.width;
            var y = 0;
            var angle = 0;
            var xSpeed = 0;
            var ySpeed = speed;
            var whitecap = this.game.add.sprite(x, y, 'whitecap');
            this.game.physics.enable(whitecap, Phaser.Physics.ARCADE);
            whitecap.body.velocity.x = xSpeed;
            whitecap.body.velocity.y = ySpeed;
            whitecap = initializeWhitecap(whitecap, angle); //add whitecap, correct angle
            whitecaps.add(whitecap);
          });
      break;
      case 'S':
          game.time.events.add(Math.random() * 10000, function(){
            var x = Math.random() * this.width;
            var y = this.height;
            var angle = 0;
            var xSpeed = 0;
            var ySpeed = 0 - speed;
            var whitecap = this.game.add.sprite(x, y, 'whitecap');
            this.game.physics.enable(whitecap, Phaser.Physics.ARCADE);
            whitecap.body.velocity.x = xSpeed;
            whitecap.body.velocity.y = ySpeed;
            whitecap = initializeWhitecap(whitecap, angle); //add whitecap, correct angle
            whitecaps.add(whitecap);
          });
      break;
      case 'W':
          game.time.events.add(Math.random() * 10000, function(){
            var x = 0;
            var y = Math.random() * this.height;
            var angle = 90;
            var xSpeed = speed;
            var ySpeed = 0;
            var whitecap = this.game.add.sprite(x, y, 'whitecap');
            this.game.physics.enable(whitecap, Phaser.Physics.ARCADE);
            whitecap.body.velocity.x = xSpeed;
            whitecap.body.velocity.y = ySpeed;
            whitecap = initializeWhitecap(whitecap, angle); //add whitecap, correct angle
            whitecaps.add(whitecap);
          });
        break;
      default: //east
          game.time.events.add(Math.random() * 10000, function(){
            var x = this.width;
            var y = Math.random() * this.height;
            var angle = -90;
            var xSpeed = 0 - speed;
            var ySpeed = 0;
            var whitecap = this.game.add.sprite(x, y, 'whitecap');
            this.game.physics.enable(whitecap, Phaser.Physics.ARCADE);
            whitecap.body.velocity.x = xSpeed;
            whitecap.body.velocity.y = ySpeed;
            whitecap = initializeWhitecap(whitecap, angle); //add whitecap, correct angle
            whitecaps.add(whitecap);
    });//end of delay
  }//end of switch
}//end of conditional

function initializeWhitecap(whitecap, angle){
  whitecap.lifespan = 23000;//kills the whitecap after it leaves the screen
  whitecap.anchor.setTo(0.5, 0.5);
  whitecap.angle = angle;
  whitecap.enableBody = true;
  this.game.physics.enable(whitecap, Phaser.Physics.ARCADE);
  whitecap.body.collideWorldBounds = false;
  whitecap.body.width = 55;
  whitecap.body.height = 4;
  return whitecap;

  //in case we want to have animated whitecaps instead of static ones
  //whitecap.frame = Math.floor(Math.random() * 5);
  //whitecap.waveForm = Math.random() > 0.5 ? 1 : -1;

}

}

  //creates a randomly selected powerup which will fly around the screen
  function randomPowerUp(powerups, alreadyTreasure){
    if (!alreadyTreasure){
      var randVal = Math.random() * Math.random();
      if (randVal > 0.94){//TODO: balance this
        var powerup;
        var side = Math.random();
        if (randVal > 0.96){ //1 health 0.97 normal, .2 for testing
          randVal = Math.random();
        if (randVal < 0.5){ //50% chance
          powerup = initializePowerup('seagull', side);//seagull, 1 health
        } else if (randVal < 0.65){ //15% chance
          powerup = initializePowerup('albatross', side);// albatross, boarding pirate
        } else if (randVal < 0.80){ //15% chance
          powerup = initializePowerup('parrot', side);//parrot, invincibility
        } else {//20% chance
          powerup = initializePowerup('pelican', side);//pelican, full health
        }
        powerups.add(powerup);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

    function initializePowerup(type, side){
      var powerup;
      var x, y, angle, xSpeed, ySpeed = 0;
      if (side < 0.25){ //north
        x = Math.random() * this.width;
        y = 0;
        angle = 90;
        ySpeed = 45;
      } else if (side < 0.5){ //west
        x = 0;
        y = Math.random() * this.height;
        angle = 0;
        xSpeed = 45;
      } else if (0.75){ //south
        x = Math.random() * this.width;
        y = this.height;
        angle = -90;
        ySpeed = -45;
      } else { //east
        x = this.width;
        y = Math.random() * this.height;
        angle = 180;
        xSpeed = -45;
      }
      powerup = this.game.add.sprite(x, y, type);
      this.game.physics.enable(powerup, Phaser.Physics.ARCADE);
      powerup.body.collideWorldBounds = false;
      powerup.enableBody = true;
      powerup.lifespan = 30000;
      powerup.anchor.setTo(0.5, 0.5);
      powerup.body.velocity.x = xSpeed;
      powerup.body.velocity.y = ySpeed;
      powerup.angle = angle;
      return powerup;
    }
  }
}




//helper function to change the acceleration and top speed of the ship based on its direction
function checkWind(facing, wind){
  switch(facing){//default is east
    case 'N':
      switch(wind){ //default is east
        case 'N':  return 'U'; break;
        case 'S': return 'D'; break;
        case 'W': return 'P'; break;
        default: return 'S';
      } break;
    case 'S':
      switch(wind){
        case 'N': return 'D'; break;
        case 'S': return 'U'; break;
        case 'W': return 'S'; break;
        default:  return 'P';
      } break;
    case 'W':
      switch(wind){
        case 'N':  return 'S'; break;
        case 'S':  return 'P'; break;
        case 'W': return 'U'; break;
        default: return 'D';
      } break;
    default:
      switch(wind){
        case 'N':  return 'P'; break;
        case 'S': return 'S'; break;
        case 'W':  return 'D'; break;
        default:  return 'U';
      }
  }
}



function whiteCapHitIsland(island, whitecap){
  whitecap.kill();
    //TODO: make wave crashing sound?
    //TODO: create explosion animation for whitecaps
    //var explosion = explosions.getFirstExists(false);
    //explosion.play('whitecapSound', 10, false, true);
    //explosion_sound.play("",0,.5,false,true);
}

function whiteCapHitShip(ship, whitecap){
  whitecap.kill();
    //TODO: make wave crashing sound?
    //TODO: create explosion animation for whitecaps
    //var explosion = explosions.getFirstExists(false);
    //explosion.play('whitecapSound', 10, false, true);
    //explosion_sound.play("",0,.5,false,true);
}

//damages the ship, after crashing into an island
function playerHitIsland(ship, island){
    //ship.damage(1);
    player1.health--;
    player1.resetKills();
    //TODO: add sound for when the player is hit
    //TODO: add "explosion" of water/sand pixels?
    //console.log("We've been hit, Captain! " + ship.health);
  }

  function enemyHitIsland(enemy, island){
    enemy.health--;
    //TODO: copy whatever the playerHitisland function does
    if (enemy.health <= 0){
      spawnTreasure(enemy.x, enemy.y, 4);//spawn treasure
      enemy.kill();
      player1.addKill();
      //TODO: explosion, sound
    }
  }

  function shipsCollided(ship1, ship2){
    if ((Math.abs(ship1.body.velocity.x) + Math.abs(ship1.body.velocity.y) + Math.abs(ship2.body.velocity.x) + Math.abs(ship2.body.velocity.y) ) >= 300){
      ship1.health--;
      ship2.health--;
    }
  }

  //spawns treasure from a fallen enemy
  function spawnTreasure(x, y, maxTreasure){
    x += ((Math.random()>0.5?-1:1) * (Math.random() * 20));//shifts x between -20 and +20 pixels
    y += ((Math.random()>0.5?-1:1) * (Math.random() * 20));//shifts y between -20 and 20 pixels
    var numTreasure = Math.random() * maxTreasure; //spawn between 1 and the max number treasures
    var treasureType = 0;
    for (var i = 0; i < numTreasure; i++){
      treasureType = Math.random();
      if (treasureType < 0.04){ //4% chance
        var treasure = createTreasure('diamond', x, y);//spawn a diamond
        storage1.addTreasure(treasure);
      } else if (treasureType < 0.12){ //8% chance
        var treasure = createTreasure('purpleGem', x, y);//spawn a purple gem
        storage1.addTreasure(treasure);
      } else if (treasureType < 0.27){ //15% chance
        var treasure = createTreasure('emerald', x, y); //spawn an emerald
        storage1.addTreasure(treasure);
      } else if (treasureType < 0.52){ //25% chance
        var treasure = createTreasure('goldCoin', x, y);//spawn a gold coin
        storage1.addTreasure(treasure);
      } else { //nearly half the time
        var treasure = createTreasure('silverCoin', x, y);//spawn a silver coin
        storage1.addTreasure(treasure);
      }
    }
    game.physics.arcade.overlap(player1.sprite, treasure, collectTreasure);
    //console.log(tempTreasures);
  }

  function createTreasure(type, x, y){
    var treasure = this.game.add.sprite(x, y, type);
    treasure.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(treasure, Phaser.Physics.ARCADE);
    treasure.enableBody = true;
    treasure.body.collideWorldBounds = false;
    treasure.lifespan = 5000;//TODO: balance treasure lifespan
    treasure.value = this.treasureMinVal[type];
    return treasure;
  }

  function collectTreasure(player, treasure){
    switch(treasure.type){
      case 'silverCoin': player1.addScore(10); break;
      case 'goldCoin': player1.addScore(80); break;
      case 'emerald':
        var score = 100 + Math.round((0.1 * (Math.abs(player1.sprite.body.velocity.x) + Math.abs(player1.sprite.body.velocity.y))));
        player1.addScore(score);
        break;
      case 'purpleGem':
        var score = 100 + Math.round((0.2 * (Math.abs(player1.sprite.body.velocity.x) + Math.abs(player1.sprite.body.velocity.y))));
        player1.addScore(score);
        break;
      default://diamond
        var score = Math.round(Math.abs(player1.sprite.body.velocity.x) + Math.abs(player1.sprite.body.velocity.y));
        player1.addScore(score);
    }
    treasure.kill();
    console.log("Score: " + player1.getScore());
  }

  function initializeEnemy(type, wind) {
    //TODO: refactor random direction code into separate function
    //  var debugEdge = 'Q';
    var x = 0;
    var y = 0;
    var xVelocity = 0;
    var yVelocity = 0;
    var angle = 0;
    var randDirection = Math.random();
    switch(wind){
      case 'N': //should come from E, W, or N
        if (randDirection < 0.33){ // come from the east edge
          y = Math.random() * this.height;
          x = this.width;
          angle = 180;
          xVelocity = 0 - this.enemyCrossWindSpeed[type];
        //  debugEdge = 'E';
        } else if (randDirection < 0.66){ //come from the west edge
          y = Math.random() * this.height;
          xVelocity = this.enemyCrossWindSpeed[type];
        //  debugEdge = 'W';
        } else { //come from the north edge
        x = Math.random() * this.width;
        angle = 90;
        yVelocity = this.enemyDownWindSpeed[type];
      //  debugEdge = 'N';
      }
      break;
      case 'S': //should come come from E, W, or S
        if (randDirection < 0.33){// come from the east edge
          y = Math.random() * this.height;
          x = this.width;
          angle = 180;
          xVelocity = 0 - this.enemyCrossWindSpeed[type];
      //    debugEdge = 'E';
        } else if (randDirection < 0.66){ //come from the west edge
          y = Math.random() * this.height;
          xVelocity = this.enemyCrossWindSpeed[type];
        //  debugEdge = 'W';
        } else {   //come from the south edge
          x = Math.random() * this.width;
          y = this.height;
          angle = -90;
          yVelocity = 0 - this.enemyDownWindSpeed[type];
        //  debugEdge = 'S';
        }
      break;
      case 'W'://should come from N, S, or W
        if (randDirection < 0.33){ //come from the north edge
          x = Math.random() * this.width;
          angle = 90;
          yVelocity = this.enemyCrossWindSpeed[type];
        //  debugEdge = 'N';
        } else if (randDirection < 0.66){ //come from the south edge
          x = Math.random() * this.width;
          y = this.height;
          angle = -90;
          yVelocity = 0 - this.enemyCrossWindSpeed[type];
        //  debugEdge = 'S';
        } else { //come from the west edge
        y = Math.random() * this.height;
        xVelocity = this.enemyDownWindSpeed[type];
      //  debugEdge = 'W';
      }
      break;
      default://east, should come from N,S, or E
        if (randDirection < 0.33){ //come from the north edge
          x = Math.random() * this.width;
          angle = 90;
          yVelocity = this.enemyCrossWindSpeed[type];
        //  debugEdge = 'N';
        } else if (randDirection < 0.66){ //come from the south edge
          x = Math.random() * this.width;
          y = this.height;
          angle = -90;
          yVelocity = 0 - this.enemyCrossWindSpeed[type];
        //  debugEdge = 'S';
        } else {//come from the east edge
          y = Math.random() * this.height;
          x = this.width;
          angle = 180;
          xVelocity = 0 - this.enemyDownWindSpeed[type];
          //debugEdge = 'E';
        }
    }
    //console.log("wind is " + wind + " edge is " + debugEdge);
    var enemy = this.game.add.sprite(x, y, type);
    //TODO: add weapons to enemies depending on their type
    enemy.frame = 0;
    enemy.anchor.setTo(0.5, 0.5);
    enemy.TURN_RATE = this.enemyTurnRate[type];
    enemy.angle = angle;
    this.game.physics.enable(enemy, Phaser.Physics.ARCADE);// What are these "this" refering to???
    enemy.enableBody = true;
    enemy.body.collideWorldBounds = false;
    enemy.body.velocity.x = xVelocity;
    enemy.body.velocity.y = yVelocity;
  //  enemy.body.bounce.set(0.25);
    enemy.health = this.enemyHealth[type];
    addWeapons(enemy);
    return enemy;
  }

  function addWeapons(enemy){
    switch(enemy.type){
      case 'gunboat': //TODO: balance this
        var LWeapon = this.game.add.weapon(100, 'cannonball');
        LWeapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        LWeapon.bulletLifespan = 250;
        LWeapon.bulletSpeed = 600;
        LWeapon.fireRate = 300;
        LWeapon.bulletAngleVariance = 10;
        LWeapon.bulletCollideWorldBounds = false;
        LWeapon.bulletWorldWrap = true;
        LWeapon.trackSprite(enemy, 0, 0, false);//TODO: shift over to actual position of gun, near the back
        //second weapon, fires right relative to the ship
        var RWeapon = this.game.add.weapon(100, 'cannonball');
        RWeapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        RWeapon.bulletLifespan = 250;
        RWeapon.bulletSpeed = 600;
        RWeapon.fireRate = 300;
        RWeapon.bulletAngleVariance = 10;
        RWeapon.bulletCollideWorldBounds = false;
        RWeapon.bulletWorldWrap = true;
        RWeapon.trackSprite(enemy, 0, 0, false);//TODO: shift over to actual position of gun, near the back
      break;
      case 'normal':
        var RWeapon = this.game.add.weapon(100, 'cannonball');
        RWeapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        RWeapon.bulletLifespan = 450;
        RWeapon.bulletSpeed = 600;
        RWeapon.fireRate = 10;
        RWeapon.bulletAngleVariance = 10;
        RWeapon.bulletCollideWorldBounds = false;
        RWeapon.bulletWorldWrap = true;
        RWeapon.trackSprite(enemy, 0, 0, false);//TODO: shift over to actual position of gun
        //second weapon, fires left relative to the ship
        var LWeapon = this.game.add.weapon(100, 'cannonball');
        LWeapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        LWeapon.bulletLifespan = 450;
        LWeapon.bulletSpeed = 600;
        LWeapon.fireRate = 10;
        LWeapon.bulletAngleVariance = 10;
        LWeapon.bulletCollideWorldBounds = false;
        LWeapon.bulletWorldWrap = true;
        LWeapon.trackSprite(enemy, 0, 0, false);//TODO: shift over to actual position of gun
      break;
      case 'manOwar': //four guns?
        var LWeapon1 = this.game.add.weapon(100, 'cannonball');
        LWeapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        LWeapon.bulletLifespan = 650;
        LWeapon.bulletSpeed = 600;
        LWeapon.fireRate = 10;
        LWeapon.bulletAngleVariance = 10;
        LWeapon.bulletCollideWorldBounds = false;
        LWeapon.bulletWorldWrap = true;
        LWeapon.trackSprite(enemy, 0, 0, false);//TODO: shift over to actual position of gun, mnore forward
        //second weapon, fires right relative to the ship
        var RWeapon1 = this.game.add.weapon(100, 'cannonball');
        RWeapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        RWeapon.bulletLifespan = 650;
        RWeapon.bulletSpeed = 600;
        RWeapon.fireRate = 10;
        RWeapon.bulletAngleVariance = 10;
        RWeapon.bulletCollideWorldBounds = false;
        RWeapon.bulletWorldWrap = true;
        RWeapon.trackSprite(enemy, 0, 0, false);//TODO: shift over to actual position of gun, more forward
        //third weapon, fires left relative to the ship
        var LWeapon2 = this.game.add.weapon(100, 'cannonball');
        LWeapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        LWeapon.bulletLifespan = 650;
        LWeapon.bulletSpeed = 600;
        LWeapon.fireRate = 10;
        LWeapon.bulletAngleVariance = 10;
        LWeapon.bulletCollideWorldBounds = false;
        LWeapon.bulletWorldWrap = true;
        LWeapon.trackSprite(enemy, 0, 0, false);//TODO: shift over to actual position of gun, more aft
        //fourth weapon, fires right relative to the ship
        var RWeapon2 = this.game.add.weapon(100, 'cannonball');
        RWeapon2.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        RWeapon2.bulletLifespan = 650;
        RWeapon2.bulletSpeed = 600;
        RWeapon2.fireRate = 10;
        RWeapon2.bulletAngleVariance = 10;
        RWeapon2.bulletCollideWorldBounds = false;
        RWeapon2.bulletWorldWrap = true;
        RWeapon2.trackSprite(enemy, 0, 0, false);//TODO: shift over to actual position of gun, more aft
      break;
      default://dhow
        var FWeapon = this.game.add.weapon(100, 'cannonball');
        FWeapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        FWeapon.bulletLifespan = 650;
        FWeapon.bulletSpeed = 250; //TODO: figure out the appropriate speed with the ship's speed
        FWeapon.bulletInheritSpriteSpeed = true;
        FWeapon.fireRate = 10;
        FWeapon.bulletAngleVariance = 3;
        FWeapon.bulletCollideWorldBounds = false;
        FWeapon.bulletWorldWrap = true;
        FWeapon.trackSprite(enemy, 0, 0, false);//TODO: shift over to actual position of gun, near the bow
        //TODO: give the weapon tothe dhow
    }
  }

  function randTreasure(numRandTreasure, wind){
    var chance = Math.random() * Math.random(); //something between 0 and 1, but likely very small
    var x, y, xVelocity, yVelocity = 0;
    //console.log(chance);
    if (chance > 0.98){//TODO: balance this time. 0.98 normal, 0.2 for testing
      //time to spawn treasure
      switch(wind){ //the treasure always comes from the wind direction
        case 'N':
          x = Math.random() * this.width;
          yVelocity = 45;
        break;
        case 'S':
          x = Math.random() * this.width;
          y = this.height;
          yVelocity = -45;
        break;
        case 'W':
          y = Math.random() * this.width;
          xVelocity = 45;
        break;
        default://east
        x = this.width;
        y = Math.random() * this.width;
        xVelocity = -45;
      }
      var treasureType = Math.random();
      var treasure;
      if (treasureType < 0.04){ //4% chance
        treasure = createTreasure('diamond', x, y);//spawn a diamond
      } else if (treasureType < 0.12){ //8% chance
        treasure = createTreasure('purpleGem', x, y);//spawn a purple gem
      } else if (treasureType < 0.27){ //15% chance
        treasure = createTreasure('emerald', x, y); //spawn an emerald
      } else if (treasureType < 0.52){ //25% chance
        treasure = createTreasure('goldCoin', x, y);//spawn a gold coin
      } else { //nearly half the time
        treasure = createTreasure('silverCoin', x, y);//spawn a silver coin
    }
      treasure.lifetime = 9001;
      treasure.body.velocity.x = xVelocity;
      treasure.body.velocity.y = yVelocity;
    }
    return treasure;
  }

  function squareSailCheckWind(angle, wind){
    var startWake = 0;
    if (angle >= 45 && angle <135){ //ship pointing south
        var direction = checkWind('S', wind);
        switch(direction){
          case 'D': startWake = 0;
          break;
          case 'P': startWake = 6; break;
          case 'S': startWake = 3; break;
          default:  startWake = 9;
      }
    } else if ((angle >= 135 && angle <225) || (angle >= -225 && angle < -135)){//ship pointing west
        var direction = checkWind('W', wind);
        switch(direction){
          case 'D': startWake = 0; break;
          case 'P': startWake = 6; break;
          case 'S': startWake = 3; break;
          default:
            startWake = 9;
      }
    } else if ((angle < -45 && angle >= -135)|| (angle < 315 && angle >= 225)){//ship pointing north
        var direction = checkWind('N', wind);
        switch(direction){
          case 'D': startWake = 0; break;
          case 'P': startWake = 6; break;
          case 'S': startWake = 3; break;
          default:
            startWake = 9;
      }
    } else {//east
        var direction = checkWind('E', wind);
        switch(direction){
          case 'D': startWake = 0; break;
          case 'P': startWake = 6; break;
          case 'S': startWake = 3; break;
          default:
            startWake = 9;
      }
    }
      return startWake;
  }

  //TODO: fix this for the special scenarios of the dhow spritesheet
  //TODO: fix dhow spritesheet
  function dhowCheckWind(angle, wind){
    var startWake = 0;
    var direction = 'D';
    if (angle >= 45 && angle <135){ //ship pointing south
        direction = checkWind('S', wind);
        switch(direction){
          case 'D':
          //if (angle is sw){
          //startWake = 0;//starboard downwind
          //} else {
          //startWake = 3;//port downwind
          //}
          break;
          case 'P': startWake = 6; break;
          case 'S': startWake = 9; break;
          default:
            //if (angle is sw){
            //startWake = 6;
            //} else {
            //startWake = 9;
            //}
      }
    } else if ((angle >= 135 && angle <225) || (angle >= -225 && angle < -135)){//ship pointing west
        direction = checkWind('W', wind);
        switch(direction){
          case 'D':
          //if (angle is nw){
          //startWake = 0;//starboard downwind
          //} else {
          //startWake = 3;//port downwind
          //}
          break;
          case 'P': startWake = 6; break;
          case 'S': startWake = 3; break;
          default:
          //if (angle is nw){
          //startWake = 6;//port upwind
          //} else {
          //startWake = 9;//starboard upwind
          //}
      }
    } else if ((angle < -45 && angle >= -135)|| (angle < 315 && angle >= 225)){//ship pointing north
        direction = checkWind('N', wind);
        switch(direction){
          case 'D':
          //if (angle is sw){
          //startWake = 0;//starboard downwind
          //} else {
          //startWake = 3;//port downwind
          //}
          break;
          case 'P': startWake = 6; break;
          case 'S': startWake = 3; break;
          default:
          //if (angle is ne){
          //startWake = 6;//port upwind
          //} else {
          //startWake = 9;//starboard upwind
          //}
      }
    } else {//east
        direction = checkWind('E', wind);
        switch(direction){
          case 'D':
          //if (angle is se){
          //startWake = 0;//starboard downwind
          //} else {//angle is ne
          //startWake = 3;//port downwind
          //}
          break;
          case 'P': startWake = 6; break;
          case 'S': startWake = 3; break;
          default:
          //if (angle is se){
          //startWake = 6;//port upwind
          //} else {
          //startWake = 9;//starboard upwind
          //}
      }
    }
      return startWake;
  }


  function enemyMaxSpeed(wake, maxSpeed, type){
    if (wake <=2){ //D
        if (maxSpeed > this.enemyUpWindSpeed[type]){
          maxSpeed = maxSpeed - 10;
        } else {
          maxSpeed = this.enemyUpWindSpeed[type];
        }
    } else if (wake <= 8){ //P or S
      if (maxSpeed < this.enemyDownWindSpeed[type]){
        maxSpeed += 20;
      } else {
        maxSpeed = this.enemyDownWindSpeed[type];
      }
    } else { //U
      if (maxSpeed < this.enemyCrossWindSpeed[type]){
        maxSpeed += 10;
      } else if (maxSpeed > this.enemyCrossWindSpeed[type]){
        maxSpeed -= 10;
      } else {
        maxSpeed = this.enemyCrossWindSpeed[type];
      }
    }
    return maxSpeed;
  }

  function enemyActualSpeed(maxSpeed, xVelocity, yVelocity){
        if (Math.abs(xVelocity) > maxSpeed){
          if (xVelocity > 0){
            xVelocity -= 10;
          } else {
            xVelocity += 10;
          }
        }
        if (Math.abs(yVelocity) > maxSpeed){
          if (yVelocity > 0){
            yVelocity -= 10;
          } else {
            yVelocity += 10;
          }
        }
        var speedArray = new Array();
        speedArray.push(xVelocity);
        speedArray.push(yVelocity);
        return speedArray;
  }

  //TODO: fill out this stub
  //makes the gunboat perform very simple behaviors- take the shortest route to chase the player, and turn to shoot when in range
  function gunBoatAI(gunboat, wind){
    //console.log(gunboat + " in the Gunboat AI function");
    var straightDistance = game.physics.arcade.distanceBetween(player1.sprite, gunboat);//find the direct distance to the player
    //find the round the world distance to the player
    var roundDistance = ((this.width - player1.sprite.x) + (gunboat.x) + (this.height - player1.sprite.y) + (gunboat.y));
    //find the angle if the ship were to go directly
    var targetAngle = this.game.math.angleBetween(
        gunboat.x, gunboat.y,
        player1.sprite.x, player1.sprite.y
    );
    console.log("Direct: " + straightDistance + " Da Gama: " + roundDistance);
    var routeDirection = 'Q';
    //if one of those distances is within firing range, call a turnAndShoot() function
    if (straightDistance <= 250){
      turnAndShoot(gunboat, targetAngle);
    } else if (roundDistance <= 250){
      turnAndShoot(gunboat, targetAngle);
    }
    //if one of those distances is less than half the other, go that way
    if ((straightDistance * 2) < roundDistance){
      //go directly
    } else if ((roundDistance * 2) < straightDistance){
      //go around the world

    //if directly sends you upwind, go around the world, otherwise go directly
    } else if (targetAngle >= 45 && targetAngle <135){ //south
      if (wind === 'S'){ //upwind
        navigate(gunboat, 0 - targetAngle);//go around the world
      } else {
        navigate(gunboat, targetAngle);//go directly
      }
    } else if ((targetAngle >= 135 && targetAngle <225) || (targetAngle >= -225 && targetAngle < -135)){//west
      if (wind === 'W'){ //upwind
        navigate(gunboat, 0 - targetAngle); //go around the world
      } else {
        navigate(gunboat, targetAngle);//go directly
      }
    } else if ((targetAngle < -45 && targetAngle >= -135)|| (targetAngle < 315 && targetAngle >= 225)){//north
      if (wind === 'N'){//upwind
        navigate(gunboat, 0 - targetAngle);//go around the world
      } else {
        navigate(gunboat, targetAngle);//go directly
      }
    } else {//east
      if (wind === 'E'){//upwind
        navigate(gunboat, 0 - targetAngle);//go around the world
      } else {
        navigate(gunboat, targetAngle);//go directly
      }
    }
  }

  function turnAndShoot(enemy, targetAngle){
    console.log("Turn rate in turn and shoot: " + enemy.TURN_RATE);
    // Gradually (this.TURN_RATE) aim the missile towards the target angle
    if (this.rotation !== targetAngle) {
      // Calculate difference between the current angle and targetAngle
      var delta = targetAngle - enemy.rotation;

      // Keep it in range from -180 to 180 to make the most efficient turns.
      if (delta > Math.PI) delta -= Math.PI * 2;
      if (delta < -Math.PI) delta += Math.PI * 2;

      if (delta > 0) {
        // Turn clockwise
        enemy.angle += enemy.TURN_RATE;
      } else {
          // Turn counter-clockwise
          enemy.angle -= enemy.TURN_RATE;
      }

      //TODO: Change this to make the ship not quite hit the player, but keep a short distance
      // Just set angle to target angle if they are close
      if (Math.abs(delta) < this.game.math.degToRad(enemy.TURN_RATE)) {
        enemy.rotation = targetAngle;
      }
  }

  // Calculate velocity vector based on this.rotation and this.SPEED
  enemy.body.velocity.x = Math.cos(enemy.rotation) * enemy.maxSpeed;
  enemy.body.velocity.y = Math.sin(enemy.rotation) * enemy.maxSpeed;
    //if (player is in range, off to the side or off to the side and off the bow){
    //shoot the guns
    //}
  }

  function navigate(enemy, targetAngle){
    console.log("Turn rate in navigate: " + enemy.TURN_RATE);
    if (enemy.angle != targetAngle){
      var delta = targetAngle - enemy.rotation;
      if (delta > 0){
        //turn clockwise
        enemy.angle += enemy.TURN_RATE;
      } else {
          // Turn counter-clockwise
          enemy.angle -= enemy.TURN_RATE;
      }
    }
  }


  //TODO: fill out this stub
  function avoidIslands(enemy, islands){
    //go through all the islands to see if one is in the way
    //if the island is off to the ship's right, turn left
    //otherwise, turn right
  }

  //calls the appropriate functions for each boss depending on what string is passed in
  //TODO: add otehr bosses
  function bossWave(type){
    console.log(type);
    var boss;
    switch(type){
      case 'ghost': // boss = ghostShip(); break;
      default://kraken
      boss = releaseKraken();
    }
    return boss;
  }

  //initializes the kraken boss
  function releaseKraken(){
    console.log("RELEASE THE KRAKEN");
    //var placeArray = findGoodPlace(Math.Random() * this.width, Math.random() * this.height, this.islands);
    var x = Math.random() * this.width;
    var y = Math.random() * this.height;
    console.log(x +  ", " + y);
    var kraken = this.game.add.sprite(x, y, 'kraken');
    this.game.physics.enable(kraken, Phaser.Physics.ARCADE);
    kraken.enableBody = true;
    kraken.anchor.setTo(0.5, 0.5);
    kraken.body.immovable = true;
    kraken.health = 6;
    return kraken;
    //TODO: add tentacles
  }

  function moveKraken(kraken){
    console.log("We've moved to " + kraken.x + ", " + kraken.y);
    //var placeArray = findGoodPlace(Math.Random() * this.width, Math.random() * this.height, this.islands);
    kraken.x = Math.random() * this.width;
    kraken.y = Math.random() * this.height;
  }

  function gameOverSequence(score, wave, kills, bossesKilled) {
      //TODO Explosion sprite

      player1.sprite.kill();
      game.paused = true;
      //TODO Change the current screen to a GameOver Screen with
      //score, wave, kills and bossesKilled
      var gameOverScreen = this.game.add.sprite(this.width/2, this.height/2, 'gameOver');
      gameOverScreen.anchor.setTo(0.5, 0.5);
      var gameOverText =  game.add.text(this.width/2 - 90, this.height/4 - 20, 'GAME OVER', { fontSize: '32px', fill: '#000' });
      var scoreText = game.add.text(this.width/2 - 300, this.height/4 + 20, "You collected " + score + " doubloons worth of treasure", { fontSize: '16px', fill: '#000' });
      var waveText = game.add.text(this.width/2 - 300, this.height/4 + 40, "You made it to wave " + wave, { fontSize: '16px', fill: '#000' });
      var factText = game.add.text(40, 16, '', { fontSize: '16px', fill: '#000' });
      var bossText = game.add.text(40, 16, '', { fontSize: '16px', fill: '#000' });
  }


GameState.prototype.render =function() {

}

/*TODO: Long-term goals
-add enemiy ships
-make enemy ships avoid islands, move towards the player, and turn to shoot when in range
-implement power-ups: temporary invincibility(red sea), health, ability to slow down,
 and ability to launch a boarding pirate that one-hits enemy ships
 -implement score: killed enemies drop loot, and loot  washes in from the direction of the wind,
 and must be picked up to score points.
 -implement waves of increasing difficulty
 -boss battles? multiple kinds of enemies?
 -high score?
*/

//-----------------------------------------------------------------------------

//var game = new Phaser.Game(848, 450, Phaser.AUTO, 'game');
var game = new Phaser.Game(960, 650, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);
