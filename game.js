// This example uses the Phaser 2.0.4 framework

//-----------------------------------------------------------------------------
//BOOTYHUNTER: A SWASHBUCKLING ADVENTURE
//Concept by Blake Erquiaga
//Written by Blake Erquiaga, Dan Zweiner, Jason Watts, Liem Gearen, David Queen
//Special thanks to Dr. Thomas Houpt and Dr. Forrest Stonedahl

//global variables
var player1;//represents playable character
var storage1;//stores things like the wave count and the treasures group
var enemyWeapons;
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
var numEnemies; //added 100 to all gunboat speeds
var enemyDownWindSpeed = {'gunboat': 200, 'manowar': 210, 'normal': 220, 'dhow': 250, 'galleon': 300, 'clipper': 350};
var enemyCrossWindSpeed = {'gunboat': 160, 'manowar': 170, 'normal': 180, 'dhow': 350, 'galleon': 200, 'clipper': 295};//the dhow goes faster across the wind than down
var enemyUpWindSpeed = {'gunboat': 135, 'manowar': 100, 'normal': 140, 'dhow': 200, 'galleon': 130, 'clipper': 220};
var enemyHealth = {'gunboat': 1, 'manowar': 70, 'normal': 40, 'dhow': 21};
var enemyDifficulty = {'gunboat': 1, 'manowar': 10, 'normal': 5, 'dhow': 10};
var enemyTurnRate = {'gunboat': 20, 'manowar': 15, 'normal': 20, 'dhow': 40, 'galleon': 45};
var enemyTreasureDrop = {'gunboat': 1, 'manowar': 4, 'normal': 2, 'dhow': 4}
var waveDifficulty;

//-----------------------------------------------------------------------------

var GameState = function(game) {
};

// Load images and sounds
GameState.prototype.preload = function() {
  //  this.game.load.spritesheet('ship', 'assets/gfx/ship.png', 32, 32);
    this.game.load.spritesheet('ship', 'assets/boatLoRes.png', 38, 32);
    this.game.load.image('cannonball', 'assets/cannonball.png');
    this.game.load.image('treasureChest', 'assets/treasureChest2.png');
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
    this.game.load.spritesheet('megaladon', 'assets/megaladon.png', 73, 27);
    this.game.load.spritesheet('junk', 'assets/junkShip.png', 40, 24);
    this.game.load.spritesheet('moab', 'assets/moab.png', 84, 40);
    this.game.load.spritesheet('mobyDick', 'assets/mobyDick.png', 51, 23);
    this.game.load.spritesheet('galleon', 'assets/galleon.png', 34, 21);
    this.game.load.spritesheet('trireme', 'assets/trireme.png', 39, 32);
    this.game.load.spritesheet('longboat', 'assets/vikingLongboat.png', 45, 31);
    this.game.load.spritesheet('clipper', 'assets/clipper.png', 56, 32);
    this.game.load.image('bomb', 'assets/galleonBomb.png');
    this.game.load.spritesheet('piranha', 'assets/piranha.png', 23, 10);
    this.game.load.image('waterball', 'assets/waterBall.png');
    this.game.load.image('rocket', 'assets/rocket.png');
    this.game.load.image('seagull', 'assets/seagull.png');
    this.game.load.image('pelican', 'assets/pelican.png');
    this.game.load.image('albatross', 'assets/albatross.png');
    this.game.load.image('parrot', 'assets/parrot.png');
    this.game.load.image('pirate', 'assets/boardingPirate.png');
    this.game.load.image('gameOver', 'assets/gameOver2.png');
    game.load.text('pirateFacts', 'PirateFacts.txt');
    this.game.load.spritesheet('sandParticles', 'assets/islandParticles.png', 1, 1);
    this.game.load.spritesheet('explosionParticles', 'assets/explosionParticles.png', 1,1);
    this.game.load.spritesheet('bigExplosionParticles', 'assets/bigExplosionParticles.png', 4, 4);
    this.game.load.image('startScreen', 'assets/introScreen.png');
    this.game.load.image('jollyRoger', 'assets/jollyRoger.png');
    this.game.load.audio('your-sound', 'assets/your-sound.mp3');
    //console.log("Hello world");
};

// Setup the example
GameState.prototype.create = function() {
    // Set stage background color
//    this.game.stage.backgroundColor = 0x111111;

  //TODO: remove redundant code

  //player1.kills = 0;
  //console.log("kills: " + playerKills);

  this.fireButtonHeld = 0;

    //adds islands to map
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.islands = this.game.add.group();
    this.islands.enableBody = true;
    generateIslands(width, height, 6, 100, 10, this.islands);//usually 6 islands, originally 20, 0 for testing

    //creates whitecaps group
    this.whitecaps = this.game.add.group();
    this.whitecaps.enableBody = true;

    //creates powerups group
    this.powerups = this.game.add.group();
    this.powerups.enableBody = true;



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


    //instantiates boss data
    var allBosses = ['kraken', 'ghost', 'megaladon', 'junk', 'moab', 'mobyDick', 'piranha', 'galleon', 'clipper', 'longboat', 'trireme'];
    //var allBosses = ['longboat'];

    var treasureGroup = this.game.add.group();
    var enemies = this.game.add.group();
    enemies.enableBody = true;
    var tentacleGroup = this.game.add.group();
    storage1 = new storage(treasureGroup, enemies, tentacleGroup, allBosses);
    //add weapons for the ghost ship boss
    var ghostWeapon = this.game.add.weapon(100, 'cannonball');
    var ghostWeapon2 = this.game.add.weapon(100, 'cannonball');
    enemyWeapons = new enemyWeapons(ghostWeapon, ghostWeapon2);

    //makes sure the ship isn't overlapping with any islands
    //console.log(player1.sprite.overlap(island));
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
    this.boarder = this.game.add.weapon(6, 'pirate');
    this.boarder.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.boarder.bulletLifespan = 650;
    this.boarder.bulletSpeed = 200;
    this.boarder.fireRate = 300;
    this.boarder.onFire.add(function(){
    player1.removePirate();
    });
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
    var scoreIndicator = this.game.add.sprite(13, 19, 'treasureChest');
    this.scoreText = game.add.text(40, 16, '', { fontSize: '16px', fill: '#FFF' });
    var roger = this.game.add.sprite(13, 36, 'jollyRoger');
    this.rogerText = this.game.add.text(40, 33, '', { fontSize: '16px', fill: '#FFF' });

      game.paused = true;
      //console.log("ready to start");
      this.game.stage.backgroundColor = 0x019ab2;
      menu = this.game.add.sprite(game.world.centerX, 325, 'startScreen');
      menu.anchor.setTo(0.5, 0.5);
      game.input.onDown.add(unpause, self);

};

  function unpause(event){
    if (game.paused){
        //console.log("Let's go!");
        menu.destroy();
        game.paused = false;
      }
  }


// The update() method is called every frame
GameState.prototype.update = function () {
    this.weapon.fireAngle = player1.sprite.angle + 90; //make the shots fire sideways
    this.weapon2.fireAngle = player1.sprite.angle - 90;
    this.boarder.fireAngle = player1.sprite.angle;//TODO: point towards nearest enemy
  //collides whitecaps with the world
  game.physics.arcade.overlap(player1.sprite, this.whitecaps, whiteCapHitShip);
  game.physics.arcade.overlap(this.islands, this.whitecaps, whiteCapHitIsland);
  game.physics.arcade.overlap(storage1.getEnemies(), this.whitecaps, whiteCapHitShip);
  game.physics.arcade.overlap(player1.sprite, storage1.getTentacleGroup(), tentacleGrabbedPlayer);

  game.physics.arcade.overlap(this.islands, this.weapon.bullets, islandWasShot);
  game.physics.arcade.overlap(this.islands, this.weapon2.bullets, islandWasShot);
  game.physics.arcade.overlap(this.islands, this.boarder.bullets, islandWasShot);
  game.physics.arcade.overlap(this.islands, enemyWeapons.getGhostWeapon(1).bullets, islandWasShot);
  game.physics.arcade.overlap(this.islands, enemyWeapons.getGhostWeapon(1).bullets, islandWasShot);
  game.physics.arcade.overlap(storage1.getEnemies(), this.weapon.bullets, enemyWasShot);
  game.physics.arcade.overlap(storage1.getEnemies(), this.weapon2.bullets, enemyWasShot);
  game.physics.arcade.overlap(storage1.getEnemies(), this.boarder.bullets, enemyBoarded);

  game.physics.arcade.overlap(player1.sprite, storage1.getTreasures(), collectTreasure);
  game.physics.arcade.collide(storage1.getTreasures(), storage1.getEnemies());
  game.physics.arcade.collide(storage1.getTreasures(), this.islands);

  game.physics.arcade.overlap(player1.sprite, enemyWeapons.getGhostWeapon(1).bullets, playerWasShot);
  game.physics.arcade.overlap(player1.sprite, enemyWeapons.getGhostWeapon(2).bullets, playerWasShot);

  game.physics.arcade.overlap(player1.sprite, this.powerups, collectPowerUp);

  //  Collide stuff with the islands
  game.physics.arcade.collide(player1.sprite, this.islands, playerHitIsland);
  game.physics.arcade.collide(storage1.getEnemies(), this.islands, enemyHitIsland);
  game.physics.arcade.collide(storage1.getTentacleGroup(), this.islands);

  game.physics.arcade.collide(player1.sprite, storage1.getEnemies(), playerHitShip);//TODO: add function to check if the player is invincible
  game.physics.arcade.collide(storage1.getEnemies(), storage1.getEnemies(), shipsCollided);


  //console.log(player1.sprite.body.velocity.x + " " + player1.sprite.body.velocity.y);
  //if there are no enemies, then the game moves to the next wave
  //console.log(storage1.getEnemies().countLiving());
  console.log("Killed bosses: " + player1.getAllKilledBosses());

  //score
  var scoreString = player1.getScore().toString();
  this.scoreText.text = scoreString;
  var numPirates = player1.getPirates().toString();
  this.rogerText.text = numPirates;


  if (storage1.getEnemies().countLiving() <= 0){ //all enemies are dead, the wave is over
    //console.log("All the enemies are dead. There are " + storage1.getEnemies().countLiving() + " enemies.");
    storage1.nextWave();
    //sets up the initial wave: randomizes the wind and generates 2 gunboats
    if (storage1.getWave() === 1){
      console.log("first wave. " + storage1.getWave());
      generateEnemies(storage1.getWave(), this.wind, storage1.getEnemies(), true);
    } else if (isBossWave()){ //boss wave
      console.log("boss wave. " + storage1.getWave());
      if (storage1.getAllBosses().length - 1 <= storage1.getKilledBosses().length){
        storage1.resetKilledBosses();
      }
      var allBosses = storage1.getAllBosses();
      var killedBosses = storage1.getKilledBosses();

      //randomly chooses one of the available bosses
      while(1){
        var guess = Math.floor(Math.random() * storage1.getAllBosses().length);
        var bossType = allBosses[guess];
        if (allBosses[guess], killedBosses.indexOf(bossType) === -1){
          var boss = bossWave(bossType);
          storage1.addEnemy(boss);
          //console.log("Number of living children after adding boss: " + storage1.getEnemies().countLiving());
          break;
        }
      }
    } else {
      //console.log("regular wave. " + storage1.getWave());
      killAllTentacles();
      //this.numEnemies += Math.round(1.5 * storage1.getWave());
      console.log("Wave: " + storage1.getWave());
      generateEnemies(storage1.getWave(), this.wind, storage1.getEnemies(), false);
    }

      //randomizes wind once every three waves
      if (storage1.getWave() % 3 === 0){
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
  //console.log("Tentacles: " + storage1.getTentacleGroup().children);
  //console.log("Enemies: " + storage1.getEnemies().children);
  for (var i = 0; i < storage1.getTentacleGroup().children.length; i++){
    //console.log("looping through tentacles");
    var tentacle = storage1.getTentacleGroup().children[i];
    chaseAI(tentacle);
    //repel other tentacles to form a proper flock
    var repulsion = repelTentacles(tentacle, 8, 35);
    tentacle.body.velocity.add(repulsion.x, repulsion.y);
  }

  for (var i = 0; i < storage1.getEnemies().length; i++){
    var enemy = storage1.getEnemies().children[i];
    if(enemy.alive){
    //console.log(enemy + " looping through living enemies.");
    var oldXSpeed = enemy.body.velocity.x;
    var oldYSpeed = enemy.body.velocity.y;
    //console.log(enemy.key); //TODO: figure out why this always logs "gunboat"
    if (enemy.alive){
      //console.log(enemy + " in loop");
      if (enemy.key === 'gunboat'){
        //console.log("it's a gunboat");
        enemy.frame = squareSailCheckWind(enemy.angle, this.wind); //figure out the ship's orientation
        if (enemy.frame >= 0 && enemy.frame < 3){enemy.isGoingUpWind = true;} else {enemy.isGoingUpWind = false;}
        enemy.maxSpeed = enemyMaxSpeed(enemy.frame, enemy.maxSpeed, 'gunboat'); //adjust the sprite accordingly
        var speedArray = enemyActualSpeed(enemy.maxSpeed, enemy.body.velocity.x, enemy.body.velocity.y);
        enemy.body.velocity.x = speedArray[0];
        enemy.body.velocity.y = speedArray[1];
        enemy.weapons[0].fireAngle = enemy.angle + 90;
        enemy.weapons[1].fireAngle = enemy.angle - 90;
        game.physics.arcade.overlap(this.islands, enemy.weapons[0].bullets, islandWasShot);
        game.physics.arcade.overlap(player1.sprite, enemy.weapons[0].bullets, playerWasShot);
        game.physics.arcade.overlap(this.islands, enemy.weapons[1].bullets, islandWasShot);
        game.physics.arcade.overlap(player1.sprite, enemy.weapons[1].bullets, playerWasShot);
        //console.log("enemy angle: " + enemy.angle + " weapon angles: " + enemy.weapons[0].angle + ", "  + enemy.weapons[1].angle);
        gunBoatAI(enemy, this.wind, true); //the ship chases the player or runs away, turns to shoot
        avoidIslands(enemy, this.islands); //the ship tries to avoid islands
        addWake(enemy, oldXSpeed, oldYSpeed);
      } else if (enemy.key === 'normal'){
        enemy.frame = squareSailCheckWind(enemy.angle, this.wind);
        if (enemy.frame >= 0 && enemy.frame < 3){enemy.isGoingUpWind = true;} else {enemy.isGoingUpWind = false;}
        enemy.maxSpeed = enemyMaxSpeed(enemy.frame, enemy.maxSpeed, 'normal');
        var speedArray = enemyActualSpeed(enemy.maxSpeed, enemy.body.velocity.x, enemy.body.velocity.y);
        enemy.body.velocity.x = speedArray[0];
        enemy.body.velocity.y = speedArray[1];
        enemy.weapons[0].fireAngle = enemy.angle + 90;
        enemy.weapons[1].fireAngle = enemy.angle - 90;
        game.physics.arcade.overlap(this.islands, enemy.weapons[0].bullets, islandWasShot);
        game.physics.arcade.overlap(player1.sprite, enemy.weapons[0].bullets, playerWasShot);
        game.physics.arcade.overlap(this.islands, enemy.weapons[1].bullets, islandWasShot);
        game.physics.arcade.overlap(player1.sprite, enemy.weapons[1].bullets, playerWasShot);
        normalAI(enemy, this.wind);
        avoidIslands(enemy, this.islands);
        addWake(enemy, oldXSpeed, oldYSpeed);
      } else if (enemy.key === 'manowar'){
        enemy.frame = squareSailCheckWind(enemy.angle, this.wind);
        if (enemy.frame >= 0 && enemy.frame < 3){enemy.isGoingUpWind = true;} else {enemy.isGoingUpWind = false;}
        enemy.maxSpeed = enemyMaxSpeed(enemy.frame, enemy.maxSpeed, 'manowar');
        var speedArray = enemyActualSpeed(enemy.maxSpeed, enemy.body.velocity.x, enemy.body.velocity.y);
        enemy.body.velocity.x = speedArray[0];
        enemy.body.velocity.y = speedArray[1];
        enemy.weapons[0].fireAngle = enemy.angle + 90;
        enemy.weapons[1].fireAngle = enemy.angle - 90;
        enemy.weapons[2].fireAngle = enemy.angle + 90;
        enemy.weapons[3].fireAngle = enemy.angle - 90;
        game.physics.arcade.overlap(this.islands, enemy.weapons[0].bullets, islandWasShot);
        game.physics.arcade.overlap(player1.sprite, enemy.weapons[0].bullets, playerWasShot);
        game.physics.arcade.overlap(this.islands, enemy.weapons[1].bullets, islandWasShot);
        game.physics.arcade.overlap(player1.sprite, enemy.weapons[1].bullets, playerWasShot);
        game.physics.arcade.overlap(this.islands, enemy.weapons[2].bullets, islandWasShot);
        game.physics.arcade.overlap(player1.sprite, enemy.weapons[2].bullets, playerWasShot);
        game.physics.arcade.overlap(this.islands, enemy.weapons[3].bullets, islandWasShot);
        game.physics.arcade.overlap(player1.sprite, enemy.weapons[3].bullets, playerWasShot);
        manOwarAI(enemy, this.wind);
        avoidIslands(enemy, this.islands);
        addWake(enemy, oldXSpeed, oldYSpeed);
      } else if (enemy.key === 'dhow'){
        var dhowArray = dhowCheckWind(enemy.angle, this.wind);
        enemy.frame = dhowArray[0];
        enemy.isGoingUpWind = dhowArray[1];
        enemy.maxSpeed = enemyMaxSpeed(enemy.frame, enemy.maxSpeed, 'normal');
        var speedArray = enemyActualSpeed(enemy.maxSpeed, enemy.body.velocity.x, enemy.body.velocity.y);
        enemy.body.velocity.x = speedArray[0];
        enemy.body.velocity.y = speedArray[1];
        game.physics.arcade.overlap(this.islands, enemy.weapons[0].bullets, islandWasShot);
        game.physics.arcade.overlap(player1.sprite, enemy.weapons[0].bullets, playerWasShot);
        dhowAI(enemy, this.wind);
        avoidIslands(enemy, this.islands);
        addWake(enemy, oldXSpeed, oldYSpeed);
      } else {//boss
        if (enemy.key === 'ship'){//ghost ship, but it uses the same sprite as the player
          //console.log("It's the ghost ship");
          ghostShipAI(enemy);
        } else if (enemy.key === 'megaladon'){
          //console.log("You're supposed to be extinct!");
          sharkAI(enemy, this.islands);
          enemy.animations.play('swim', 12, true);
        } else if (enemy.key === 'junk'){
          //console.log("What a hunk of junk!");
          game.physics.arcade.overlap(player1.sprite, enemy.weapon.bullets, playerWasShot);
          enemy.frame = junkFrame(enemy.angle, this.wind);
          junkAI(enemy, this.islands, this.wind);
          addWake(enemy, oldXSpeed, oldYSpeed);
        } else if (enemy.key === 'moab'){
          enemy.frame = squareSailCheckWind(enemy.angle, this.wind);
          trackMoabWeapons(enemy, this.islands);
          avoidIslands(enemy, this.islands);
          moabAI(enemy);
          addWake(enemy, oldXSpeed, oldYSpeed);
        } else if (enemy.key === 'mobyDick'){
          game.physics.arcade.overlap(player1.sprite, enemy.weapons[0].bullets, playerWasShot);
          game.physics.arcade.overlap(player1.sprite, enemy.weapons[1].bullets, playerWasShot);
          game.physics.arcade.overlap(this.islands, enemy.weapons[0].bullets, islandWasShot);
          game.physics.arcade.overlap(this.islands, enemy.weapons[1].bullets, islandWasShot);
          enemy.weapons[0].fireAngle = enemy.angle - 90;
          enemy.weapons[1].fireAngle = enemy.angle + 90;
          avoidIslands(enemy,this.islands);
          patternAI(enemy);
          whaleFiringPattern(enemy);
          enemy.animations.play('swim', 4, true);
        } else if (enemy.key === 'piranha'){
          chaseAI(enemy);
          var repulsion = repelpiranhas(enemy, 12, 35);
          enemy.body.velocity.add(repulsion.x, repulsion.y);
          enemy.animations.play('swim', 15, true);
        } else if (enemy.key === 'galleon'){
          game.physics.arcade.overlap(player1.sprite, enemy.weapon.bullets, kaboom);
          enemy.weapon.fireAngle = enemy.angle + 180;
          enemy.frame = squareSailCheckWind(enemy.angle, this.wind);
          enemy.maxSpeed = enemyMaxSpeed(enemy.frame, enemy.maxSpeed, 'galleon');
          //console.log("galleon max speed: " + enemy.maxSpeed);
          var speedArray = enemyActualSpeed(enemy.maxSpeed, enemy.body.velocity.x, enemy.body.velocity.y);
          enemy.body.velocity.x = speedArray[0];
          //console.log(enemy.body.velocity.x);
          enemy.body.velocity.y = speedArray[1];
          galleonAI(enemy);
          avoidIslands(enemy, this.islands);
        } else if (enemy.key === 'clipper'){
          game.physics.arcade.overlap(player1.sprite, enemy.weapons[0].bullets, playerWasShot);
          game.physics.arcade.overlap(player1.sprite, enemy.weapons[1].bullets, playerWasShot);
          game.physics.arcade.overlap(this.islands, enemy.weapons[0].bullets, islandWasShot);
          game.physics.arcade.overlap(this.islands, enemy.weapons[1].bullets, islandWasShot);
          enemy.frame = squareSailCheckWind(enemy.angle, this.wind);
          enemy.maxSpeed = enemyMaxSpeed(enemy.frame, enemy.maxSpeed, 'clipper');
          var speedArray = enemyActualSpeed(enemy.maxSpeed, enemy.body.velocity.x, enemy.body.velocity.y);
          enemy.body.velocity.x = speedArray[0];
          enemy.body.velocity.y = speedArray[1];
          avoidIslands(enemy, this.islands);
          patternAI(enemy)
          clipperFiringPattern(enemy);
        } else if (enemy.key === 'longboat' || enemy.key === 'trireme'){
          game.physics.arcade.overlap(player1.sprite, enemy.weapons[0].bullets, playerWasShot);
          game.physics.arcade.overlap(player1.sprite, enemy.weapons[1].bullets, playerWasShot);
          game.physics.arcade.overlap(player1.sprite, enemy.weapons[2].bullets, playerWasShot);
          game.physics.arcade.overlap(player1.sprite, enemy.weapons[3].bullets, playerWasShot);
          game.physics.arcade.overlap(this.islands, enemy.weapons[0].bullets, islandWasShot);
          game.physics.arcade.overlap(this.islands, enemy.weapons[1].bullets, islandWasShot);
          game.physics.arcade.overlap(this.islands, enemy.weapons[2].bullets, islandWasShot);
          game.physics.arcade.overlap(this.islands, enemy.weapons[3].bullets, islandWasShot);
          enemy.animations.play('row', 16, true);
          avoidIslands(enemy, this.islands);
          patternAI(enemy);
          longBoatFiringPattern(enemy);
        }
      }
    }
  }
  }

  //for sailing enemies, their frame needs to relect their speed as well as the wind
  function addWake(enemy, oldXspeed, oldYSpeed){
    if (Math.abs(enemy.body.velocity.x) > oldXSpeed || Math.abs(enemy.body.velocity.y) > oldYSpeed){
      enemy.frame += 2;
    }
  }

  //console.log("I am invincible in the update function! " + player1.getIsInvincible());
  if (player1.getIsInvincible()){
    //console.log("I cannot hurt again until " + player1.getInvincibilityTime());
    if (player1.getInvincibilityTime() > 0){
      player1.lessTime();
    } else {
      player1.toggleInvincible();
    }
  }

  if (player1.getHealth() === "invincible"){
    //console.log("Polly wants a cracker!");
    if (player1.getRestoreOldHealthTime() > 0){
      //console.log(player1.getRestoreOldHealthTime() + " more updates ")
      player1.lessRestoreOldHealthTime();
    } else {
      console.log("Polly got her cracker " + player1.getOldHealth());
      player1.restoreOldHealth();
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
    for (var i = 0; i < storage1.getEnemies().children.length; i++){
      var enemy = storage1.getEnemies().children[i];
      if (enemy.centerX > this.game.width) enemy.centerX = 0;
      if (enemy.centerX < 0) enemy.centerX = this.game.width;
      if (enemy.centerY > this.game.height) enemy.centerY = 0;
      if (enemy.centerY < 0) enemy.centerY = this.game.height;
    }

    //keep kraken tentacles on the screen
    for (var i = 0; i < storage1.getTentacleGroup().children.length; i++){
      var tentacle = storage1.getTentacleGroup().children[i];
      if (tentacle.centerX > this.game.width) tentacle.centerX = 0;
      if (tentacle.centerX < 0) tentacle.centerX = this.game.width;
      if (tentacle.centerY > this.game.height) tentacle.centerY = 0;
      if (tentacle.centerY < 0) tentacle.centerY = this.game.height;
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
          if (player1.getPirates() > 0){
            //console.log("prepare the boarding party!");
            this.boarder.fire();
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
    if (isGhostWave()){
      //console.log("anything you can do I can do better!");
      enemyWeapons.fireGhostWeapons();
      //console.log(enemyWeapons.getGhostWeaponAngles());
    }
  } else { //reduce the fireButtonHeld value
      if (this.fireButtonHeld > 0)
        this.fireButtonHeld -= 1; //TODO: balance cooldown time vs spam time. Should it be longer? Should it be shorter?
      if (this.fireButtonHeld < 0)
        this.fireButtonHeld = 0;
  }

  if (player1.getKills() >= 45){
    this.weapon.bulletLifespan = 650;
    this.weapon2.bulletLifespan = 650;
  } else {
    this.weapon.bulletLifespan = 200 + 10 * (player1.getKills());
    this.weapon2.bulletLifespan = 200 + 10 * (player1.getKills());
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
  if(player1.getHealth() < 0) {
    player1.getHealth() = 0;
  }
  switch(player1.getHealth()){
    case 0:
      //console.log("You'd be dead if this game was finished");//run game over sequence...show score, kills ,wave,
      gameOverSequence(player1.getScore(), storage1.getWave(), player1.getKills(), this.bossesKilled);
      //maybe a fun historically accurate pirate fact too
      break;
    case 1:
      if (this.game.stage.backgroundColor != 0x638e93) {
          this.game.stage.backgroundColor = 0x638e93; //very grey sea, formerly very dark sea 0x0d2344
      }
      break;
    case 2:
      if (this.game.stage.backgroundColor != 0x4f878e) {
        this.game.stage.backgroundColor = 0x4f878e //tealish grey sea, formerly dark sea, #0b2c5e
      }
      break;
    case 3:
      if (this.game.stage.backgroundColor != 0x35717a) {
        this.game.stage.backgroundColor = 0x35717a;//greyish teal sea, formerly 0x124375 moderately dark sea
      }
      break;
    case 4:
      if (this.game.stage.backgroundColor != 0x136875){
        this.game.stage.backgroundColor = 0x136875;//dark blue-green sea
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
  //console.log(wind + " wind in generateEnemies");
  var enemy;
  //TODO: figure out if this is redundant or efficient
  if (isFirstWave){
    enemy = initializeEnemy('gunboat', wind, enemies);
    storage1.addEnemy(enemy);
    enemy = initializeEnemy('gunboat', wind, enemies);
    storage1.addEnemy(enemy);
    //console.log("live enemies after production: " + storage1.getEnemies().countLiving());
  } else if (wave <= 4){
    //console.log("not the first wave");
    for (var i = 0; i <= wave * 3; i++){
    //console.log("in the loop: " + storage1.getEnemies());
    //TODO: find a way to weight the selection to favor a certain type of enemy if one of that type has already been added to the wave
      var shipChosen = false;
      if ((wave) >= 4 && !shipChosen){ //difficulty value of the man o' war and dhow
        var useThisSprite = Math.random()>0.5?true:false; //TODO: balance frequency of selecting hardest available enemy
        if (useThisSprite){
          shipChosen = true;
          var useDhow =  Math.random()>0.5?true:false; //determines whether to use dhow or man o' war
          if (useDhow){//create a dhow
            enemy = initializeEnemy('dhow', wind);
            storage1.addEnemy(enemy);
            i += 10;
          } else {// create a man o war
            enemy = initializeEnemy('manowar', wind);
            storage1.addEnemy(enemy);
            i +=10;
          }
        }
    }
    if ((wave) >= 2 && !shipChosen){
      var useThisSprite = Math.random()>0.5?true:false;//TODO: balance freequency of selecting hardest available enemy
      if (useThisSprite){
        shipChosen = true;
        enemy = initializeEnemy('normal', wind);
        storage1.addEnemy(enemy);
        i += 2;
      }
    }
    if (!shipChosen){//no other ship was chosen and/or the remaining difficulty value is too low
      shipChosen = true;
      enemy = initializeEnemy('gunboat', wind);
      storage1.addEnemy(enemy);
      i++;
    }
  }
} else { //once the waves get high enough, we cap the total
  for (var i = 0; i < 16; i++){
    var spriteChoice = Math.random();
    if (spriteChoice < 0.4){
      enemy = initializeEnemy('normal', wind);
      storage1.addEnemy(enemy);
      i += 3;
    } else {
      spriteChoice = Math.random();
      if (spriteChoice < 0.5){
        enemy = initializeEnemy('dhow', wind);
        storage1.addEnemy(enemy);
        i += 4;
      }
    }
  }
  }
}

  //kills bullets when they hit islands
  function islandWasShot(island, bullet){
    particleExplosion(bullet.x, bullet.y, 3, 'sandParticles', 8, 40);
    bullet.kill();
    //TODO: add sound
    //play explosion sound
    /*
    var explosion = explosions.getFirstExists(false);

    explosion.reset( bullet.body.x ,bullet.body.y);
    explosion.play('explosion', 10, false, true);
    explosion_sound.play("",0,.5,false,true);
    */
  }

  //damages an enemy when an enemy is shot
  function enemyWasShot(enemy, bullet){
    bullet.kill();
    particleExplosion(enemy.x, enemy.y, 3, 'explosionParticles', 8, 40);
    enemy.health--;
    //console.log("bang! " + enemy.health);
    //TODO: add explosion
    //play explosion sound
    if (enemy.key === 'kraken'){
      killAllTentacles();
      //console.log("You shot the kraken!");
      if (enemy.health > 0){
        moveKraken(enemy);
        return 0;
      } else {
        //console.log("you killed the kraken!");
        spawnTreasure(enemy.x, enemy.y, 10);
        enemy.kill();
        storage1.addKilledBoss(enemy.key);
        player1.saveKilledBoss(enemy.key);
        player1.addKill();
      }
    } else {

      if (enemy.health <= 0){
      spawnTreasure(enemy.x, enemy.y, 4);//spawn treasure
      enemy.kill();
      player1.addKill();
      particleExplosion(enemy.x, enemy.y, 10, 'bigExplosionParticles', 8, 70);
      if (storage1.getAllBosses().indexOf(enemy.key) >= 0){
        storage1.addKilledBoss(enemy.key);
        player1.saveKilledBoss(enemy.key);
      }
      //play explosion and sound
      }
    }
  }

  //kills an enemy and collects their treasure when they are hit by a boarding pirate
  function enemyBoarded(enemy, pirate){
    var retVal = 0;
    pirate.kill();
    if (enemy.type === 'kraken'){retVal = 1; killAllTentacles();}
    enemy.kill();
    player1.addKill();
    var bootyLength = Math.random() * 6;
    var booty;
    for (var i = 0; i < bootyLength; i++){
      booty = spawnTreasure(enemy.x, enemy.y, 1);
      collectTreasure(player1, booty);
    }
    if (storage1.getAllBosses().indexOf(enemy.key) >= 0){
      storage1.addKilledBoss(enemy.key);
      player1.saveKilledBoss(enemy.key);
    }
    return retVal;
  }

  //gives a player a bonus for whatever powerup bird they collected and removes
  //the bird from the screen
  function collectPowerUp(player, powerup){
    var type = powerup.key;
    switch(type){
      case 'seagull': player1.addHealth(1); break;
      case 'pelican': player1.addHealth(6); break;
      case 'parrot':
      player1.setHealth("invincible");
      player1.setRestoreOldHealthTime(500); //TODO: balance this
       break;
      default://albatross
        player1.addPirate();
      //console.log("The player has a pirate? " + player1.getPirate());
    }
    powerup.kill();
  }

  //when a tentacle grabs the player, it's supposed to
  function tentacleGrabbedPlayer(player, tentacle){
    if (player1.getIsInvincible() === false) { //We only damage the player if not invincible
      player1.damage();
      player1.resetKills();
      player1.toggleInvincible();
      //console.log("I am invincible! " + player1.getIsInvincible());
      //and then we add a timer to restore the player to a vulnerable state. The normal game timer didn't work, so I came up with this which uses update frames
      player1.setInvincibilityTime(100); //TODO: balance this time
      tentacle.grabbedPlayer = true; //now in the update() function we need to check for tentacles with this value and make them latch onto the player sprite
      //TODO: add sound for when the player is hit
      //TODO: add "explosion" of wood and/or water
  }
  }

//randomly generates randomly sized and placed islands which may or may not have green "trees"
function generateIslands(width, height, maxIslands, maxSize, minSize, islands) {
  var numIslands = Math.random() * maxIslands;

for (var i = 0; i < numIslands; i++){
  var radius1 = 0;
  var radius2 = 0;
    while (radius1 < minSize){
      radius1 = Math.random() * maxSize;
    }
    while (radius2 < minSize){
      radius2 = Math.random() * maxSize;
    }
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

//actually creates an island
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
    island.x = x;
    island.y = y;
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
            var angle = 180;
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
        if (randVal > 0.96){// 0.96 normal, .2 for testing
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
    if (player1.getIsInvincible() === false && player1.getHealth() != "invincible") { //We only damage the player if not invincible
      player1.damage();
      player1.resetKills();
      player1.toggleInvincible();
      console.log("I am invincible! " + player1.getIsInvincible() + " Health: " + player1.getHealth());
      //and then we add a timer to restore the player to a vulnerable state. The normal game timer didn't work, so I came up with this which uses update frames
      player1.setInvincibilityTime(100); //TODO: balance this time
      //explosion, needs to be improved somewhat but usually it looks good
      particleExplosion(player1.sprite.body.x, player1.sprite.body.y, 20, 'sandParticles', 5, 100);
      //console.log("We've been hit, Captain! " + player1.getHealth());
  }
}

  function enemyHitIsland(enemy, island){
    if (enemy.key === 'mobyDick' || enemy.key === 'clipper' || enemy.key === 'moab' || enemy.key === 'longboat'){//pattern bosses don't take damage from hitting islands
      getOutOfThere(enemy, island);
    } else if (enemy.key !== 'ship'){//the ghost ship doesn't react to islands at all
      enemy.health -= 1;//previously 5
      getOutOfThere(enemy, island);
    if (enemy.health <= 0){
      spawnTreasure(enemy.x, enemy.y, 4);//spawn treasure
      enemy.kill();
      player1.addKill();
      particleExplosion(enemy.x, enemy.y, 10, 'bigExplosionParticles', 8, 70);
      //TODO: add sound
      if (storage1.getAllBosses().indexOf(enemy.key) >= 0){
        storage1.addKilledBoss(enemy.key);
        player1.saveKilledBoss(enemy.key);
      }
    }
  }
  }

  //makes enemies turn away from an island they have hit
  function getOutOfThere(enemy, island){
    console.log("Get the hell out of there!");
    var outOfThereAngle = 180 + this.game.math.angleBetween(
      enemy.x, enemy.y,
      island.x, island.y
    );
    outOfThereAngle += ((Math.random()>0.5?-1:1) * 45);
    navigate(enemy, outOfThereAngle);
  }

  //damages the player if they've been shot and aren't invincible
  function playerWasShot(player, bullet){
    bullet.kill();
    if (player1.getIsInvincible() === false && player1.getHealth() != "invincible") { //We only damage the player if not invincible
      player1.damage();
      player1.resetKills();
      player1.toggleInvincible();
      console.log("I am invincible! " + player1.getIsInvincible() + " Health: " + player1.getHealth());
      //and then we add a timer to restore the player to a vulnerable state. The normal timer didn't work, so I came up with this which uses update frames
      player1.setInvincibilityTime(50); //TODO: balance this time
      //TODO: add sound for when the player is hit
      //explosion
      particleExplosion(player1.sprite.body.x, player1.sprite.body.y, 3, 'explosionParticles', 8, 40);
      //console.log("We've been hit, Captain! " + player1.getHealth());
  }
  }

  //damages the player if they run into an explosive barrel
  function kaboom(player, bomb){
    particleExplosion(bomb.x, bomb.y, 6, 'bigExplosionParticles', 8, 95);
    playerWasShot(player, bomb);
  }

  //collides the player and enemies
  function playerHitShip(player, ship){
    if (player1.getHealth() === "invincible"){
      ship.health-= 10;
    } else {
      if (!player1.getIsInvincible()){ //TODO: add check for if the enemy is invincible
      //TODO: add key to check so different bosses have different abilities
      if ((Math.abs(player1.sprite.body.velocity.x) + Math.abs(player1.sprite.body.velocity.y) + Math.abs(ship.body.velocity.x) + Math.abs(ship.body.velocity.y) ) >= 300){
        player1.damage();
        player1.toggleInvincible();
        player1.setInvincibilityTime(100);
        ship.health--;
        if (ship.health <= 0){
          spawnTreasure(ship.x, ship.y, 4);//TODO: use mapped enemytreasureDrop values
          ship.kill();
          player1.addKill();
        }
      }
    }
    }
  }

  //collides two enemies
  function shipsCollided(ship1, ship2){
    if ((Math.abs(ship1.body.velocity.x) + Math.abs(ship1.body.velocity.y) + Math.abs(ship2.body.velocity.x) + Math.abs(ship2.body.velocity.y) ) >= 300){
      ship1.health--;
      ship2.health--;
    }
    if (ship1.health <= 0){
      spawnTreasure(ship1.x, ship1.y, 4);//TODO: use mapped enemytreasureDrop values
      ship1.kill();
      player1.addKill();
    }
    if (ship2.health <= 0){
      spawnTreasure(ship2.x, ship2.y, 4);//TODO: use mapped enemytreasureDrop values
      ship2.kill();
      player1.addKill();
    }
  }

  //creates a particle explosion with a given spritesheet
  function particleExplosion(x, y, numParticles, spriteSheet, spriteSheetLength, maxSpeed){
    var particleGroup = this.game.add.group();
    for (var i = 0; i < numParticles; i++){
      var particle = this.game.add.sprite(x, y, spriteSheet);
        this.game.physics.enable(particle, Phaser.Physics.ARCADE);
        particle.enableBody = true;
        //console.log("Particle " + i + " " + particle + " particle body = " + particle.enableBody);
        particle.anchor.setTo(0.5, 0.5);
        particle.body.velocity.x = Math.random() * maxSpeed;
        particle.body.velocity.y = Math.random() * maxSpeed;
        particle.lifespan = 1000;
        particle.angle = Math.random() * 90;
        particle.frame = Math.floor(Math.random() * spriteSheetLength);
        particleGroup.add(particle);
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

    //only for the boarding pirate
    return treasure;
  }

  function createTreasure(type, x, y){
    var treasure = this.game.add.sprite(x, y, type);
    treasure.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(treasure, Phaser.Physics.ARCADE);
    treasure.enableBody = true;
    treasure.body.collideWorldBounds = false;
    treasure.lifespan = 8000;//TODO: balance treasure lifespan
    treasure.value = this.treasureMinVal[type];
    return treasure;
  }

  //adds score for the player when they collect treasures
  function collectTreasure(player, treasure){
    switch(treasure.key){
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
    //console.log("Score: " + player1.getScore());
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
    enemy.frame = 0;
    enemy.anchor.setTo(0.5, 0.5);
    enemy.TURN_RATE = this.enemyTurnRate[type];
    enemy.angle = angle;
    this.game.physics.enable(enemy, Phaser.Physics.ARCADE);// What are these "this" refering to???
    enemy.enableBody = true;
    enemy.body.collideWorldBounds = false;
    enemy.body.velocity.x = xVelocity;
    enemy.body.velocity.y = yVelocity;
    enemy.body.bounce.set(0.25);
    enemy.health = this.enemyHealth[type];
    enemy.courage = 0;
    enemy.id = storage1.getEnemies().children.length;
    enemy.isLeader = false;
    enemy.isFollowing = false;
    enemy.followingShip;
    enemy.isGoingUpWind = false;
    addWeapons(enemy);
    return enemy;
  }

  //gives enemies weapons with different properties based on their type
  function addWeapons(enemy){
    var weaponArray = new Array();
    switch(enemy.key){
      case 'gunboat': //TODO: balance this
        var LWeapon = this.game.add.weapon(100, 'cannonball');
        LWeapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        LWeapon.bulletLifespan = 250;
        LWeapon.bulletSpeed = 600;
        LWeapon.fireRate = 30;
        LWeapon.bulletAngleVariance = 10;
        LWeapon.bulletCollideWorldBounds = false;
        LWeapon.bulletWorldWrap = true;
        LWeapon.trackSprite(enemy, 0, 0, false);//TODO: shift over to actual position of gun, near the back
        //second weapon, fires right relative to the ship
        var RWeapon = this.game.add.weapon(100, 'cannonball');
        RWeapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        RWeapon.bulletLifespan = 250;
        RWeapon.bulletSpeed = 600;
        RWeapon.fireRate = 30;
        RWeapon.bulletAngleVariance = 10;
        RWeapon.bulletCollideWorldBounds = false;
        RWeapon.bulletWorldWrap = true;
        RWeapon.trackSprite(enemy, 0, 0, false);//TODO: shift over to actual position of gun, near the back

        weaponArray.push(RWeapon);
        weaponArray.push(LWeapon);
        enemy.weapons = weaponArray;
      break;
      case 'normal':
        var RWeapon = this.game.add.weapon(100, 'cannonball');
        RWeapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        RWeapon.bulletLifespan = 400;
        RWeapon.bulletSpeed = 600;
        RWeapon.fireRate = 10;
        RWeapon.bulletAngleVariance = 10;
        RWeapon.bulletCollideWorldBounds = false;
        RWeapon.bulletWorldWrap = true;
        RWeapon.trackSprite(enemy, 0, 0, false);//TODO: shift over to actual position of gun
        //second weapon, fires left relative to the ship
        var LWeapon = this.game.add.weapon(100, 'cannonball');
        LWeapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        LWeapon.bulletLifespan = 400;
        LWeapon.bulletSpeed = 600;
        LWeapon.fireRate = 10;
        LWeapon.bulletAngleVariance = 10;
        LWeapon.bulletCollideWorldBounds = false;
        LWeapon.bulletWorldWrap = true;
        LWeapon.trackSprite(enemy, 0, 0, false);//TODO: shift over to actual position of gun

        weaponArray.push(RWeapon);
        weaponArray.push(LWeapon);
        enemy.weapons = weaponArray;
      break;
      case 'manowar': //four guns?
        var LWeapon1 = this.game.add.weapon(100, 'cannonball');
        LWeapon1.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        LWeapon1.bulletLifespan = 650;
        LWeapon1.bulletSpeed = 500;
        LWeapon1.fireRate = 10;
        LWeapon1.bulletAngleVariance = 10;
        LWeapon1.bulletCollideWorldBounds = false;
        LWeapon1.bulletWorldWrap = true;
        LWeapon1.trackSprite(enemy, 0, 0, false);//TODO: shift over to actual position of gun, mnore forward
        //second weapon, fires right relative to the ship
        var RWeapon1 = this.game.add.weapon(100, 'cannonball');
        RWeapon1.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        RWeapon1.bulletLifespan = 650;
        RWeapon1.bulletSpeed = 500;
        RWeapon1.fireRate = 10;
        RWeapon1.bulletAngleVariance = 10;
        RWeapon1.bulletCollideWorldBounds = false;
        RWeapon1.bulletWorldWrap = true;
        RWeapon1.trackSprite(enemy, 0, 0, false);//TODO: shift over to actual position of gun, more forward
        //third weapon, fires left relative to the ship
        var LWeapon2 = this.game.add.weapon(100, 'cannonball');
        LWeapon2.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        LWeapon2.bulletLifespan = 650;
        LWeapon2.bulletSpeed = 500;
        LWeapon2.fireRate = 10;
        LWeapon2.bulletAngleVariance = 10;
        LWeapon2.bulletCollideWorldBounds = false;
        LWeapon2.bulletWorldWrap = true;
        LWeapon2.trackSprite(enemy, 0, 0, false);//TODO: shift over to actual position of gun, more aft
        //fourth weapon, fires right relative to the ship
        var RWeapon2 = this.game.add.weapon(100, 'cannonball');
        RWeapon2.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        RWeapon2.bulletLifespan = 650;
        RWeapon2.bulletSpeed = 500;
        RWeapon2.fireRate = 10;
        RWeapon2.bulletAngleVariance = 10;
        RWeapon2.bulletCollideWorldBounds = false;
        RWeapon2.bulletWorldWrap = true;
        RWeapon2.trackSprite(enemy, 0, 0, false);//TODO: shift over to actual position of gun, more aft

        weaponArray.push(RWeapon1);
        weaponArray.push(LWeapon1);
        weaponArray.push(RWeapon2);
        weaponArray.push(LWeapon2);
        enemy.weapons = weaponArray;
      break;
      default://dhow
        var FWeapon = this.game.add.weapon(100, 'cannonball');
        FWeapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        FWeapon.bulletLifespan = 650;
        FWeapon.bulletSpeed = 350; //TODO: figure out the appropriate speed with the ship's speed
        FWeapon.bulletInheritSpriteSpeed = true;
        FWeapon.fireRate = 10;
        FWeapon.bulletAngleVariance = 3;
        FWeapon.bulletCollideWorldBounds = false;
        FWeapon.bulletWorldWrap = true;
        FWeapon.trackSprite(enemy, 0, 0, true);//TODO: shift over to actual position of gun, near the bow
        weaponArray.push(FWeapon);
        enemy.weapons = weaponArray;
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
    var retArray = new Array();
    var startWake = 0;
    var upWind = false;
    var direction = 'D';
    if (angle >= 45 && angle <135){ //ship pointing south
        direction = checkWind('S', wind);
        switch(direction){
          case 'D':
            if (angle > 90){//if angle is sw
              startWake = 0;//starboard downwind
            } else {
              startWake = 3;//port downwind
            }
          break;
          case 'P': startWake = 6; break;
          case 'S': startWake = 9; break;
          default:
            upWind = true;
            if (angle > 90){//if angle is sw
              startWake = 9;
              } else {
              startWake = 6;
            }
      }
    } else if ((angle >= 135 && angle <225) || (angle >= -225 && angle < -135)){//ship pointing west
        direction = checkWind('W', wind);
        switch(direction){
          case 'D':
            if ((angle < 180 && angle > 0) || (angle > -180 && angle < 0)){//if angle is nw
              startWake = 0;//starboard downwind
            } else {
              startWake = 3;//port downwind
            }
          break;
          case 'P': startWake = 6; break;
          case 'S': startWake = 3; break;
          default:
            upWind = true;
            if ((angle < 180 && angle > 0) || (angle > -180 && angle < 0)){//if angle is nw
              startWake = 9;//port upwind
            } else {
              startWake = 6;//starboard upwind
          }
      }
    } else if ((angle < -45 && angle >= -135)|| (angle < 315 && angle >= 225)){//ship pointing north
        direction = checkWind('N', wind);
        switch(direction){
          case 'D':
            if ((angle > -90 && angle < 0) || (angle > 270 && angle > 0)){//if angle is ne
              startWake = 0;//starboard downwind
            } else {
              startWake = 3;//port downwind
            }
          break;
          case 'P': startWake = 6; break;
          case 'S': startWake = 3; break;
          default:
            upWind = true;
            if ((angle > -90 && angle < 0) || (angle > 270 && angle > 0)){//if angle is ne
              startWake = 9;//port upwind
            } else {
              startWake = 6;//starboard upwind
            }
      }
    } else {//east
        direction = checkWind('E', wind);
        switch(direction){
          case 'D':
            if ((angle > 0 && angle < 90) || (angle < -270 && angle > -359)){//if angle is se
              startWake = 0;//starboard downwind
            } else {//angle is ne
              startWake = 3;//port downwind
            }
          break;
          case 'P': startWake = 6; break;
          case 'S': startWake = 3; break;
          default:
            upWind = true;
            if ((angle > 0 && angle < 90) || (angle < -270 && angle > -359)){//if angle is se
              startWake = 9;//port upwind
            } else {
              startWake = 6;//starboard upwind
          }
      }
    }
      retArray[0] = startWake;
      retArray[1] = upWind;
      return retArray;
  }

  //figures out an enemy's maximum speed based on its type and its angle relative
  //to the current wind direction
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

  //figures out how fast an enemy ship can actually go based on its current speed
  //and its max speed. If the ship is going too fast, it gets slowed down.
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

  //makes an enemy perform very simple behaviors- take the shortest route to chase the player
  // and shoot when the player is to its side
  function gunBoatAI(gunboat, wind, shootsFromSides){
    //console.log(gunboat + " in the Gunboat AI function");
    var straightDistance = game.physics.arcade.distanceBetween(player1.sprite, gunboat);//find the direct distance to the player
    //find the round the world distance to the player
    var roundDistance = getDaGamaDistance(gunboat);
    var leadX = player1.sprite.x + (player1.sprite.body.velocity.x * .75);
    var leadY = player1.sprite.y + (player1.sprite.body.velocity.y * .75);
    //find the angle if the ship were to go directly
    var targetAngle = this.game.math.angleBetween(
        gunboat.x, gunboat.y,
        leadX, leadY
    );
    //console.log("Direct: " + straightDistance + " Da Gama: " + roundDistance);
    //if one of those distances is within firing range, call the broadside() function
    if (shootsFromSides){
      if (straightDistance <= 250){
        broadside(gunboat, targetAngle);
      } else if (roundDistance <= 250){
        broadside(gunboat, targetAngle);
      }
    }
    //if one of those distances is less than one third the other, go that way
    if ((straightDistance * 3) < roundDistance){
      //go directly
      navigate(gunboat, targetAngle);
    } else if ((roundDistance * 3) < straightDistance){
      //go around the world
      navigate(gunboat, 0 - targetAngle);
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

  /*once the enemy ship is close enough, move in, turn until the player is at an
  angle where they might get hit, and fire the weapons
  */

  function broadside(enemy, targetAngle){
    var weapon;
    var relFiringAngle = Math.abs(this.game.math.wrapAngle(enemy.angle - targetAngle));
    //console.log("relFiringAngle: "+ relFiringAngle);
  //if the player is in or near the firing angle
    if (relFiringAngle >=70 && relFiringAngle <= 110){
      //console.log("time to shoot");
          //if it is, fire the weapons
        for (var i = 0; i < enemy.weapons.length; i++){
        weapon = enemy.weapons[i];
        weapon.fire();
        }
      }
    }

  function navigate(enemy, targetAngle){
    //console.log("navigating");
    //console.log("Turn rate in turn and shoot: " + enemy.TURN_RATE);
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
  }

  function getDaGamaDistance(enemy){
    if (player1.sprite.x < enemy.x){ //player is to the left of the enemy
      if (player1.sprite.y < enemy.y){ //player is above enemy
        //console.log("player is to the left and above the enemy");
        return (((this.height - enemy.y) + (player1.sprite.y)) + ((this.width - enemy.x) + (player1.sprite.x)));
      } else { //player is below or equal to enemy
        //console.log("player is to the left and above the enemy");
        return (((this.height - player1.sprite.y) + (enemy.y)) + ((this.width - enemy.x) + (player1.sprite.x)));
      }
    } else { //player is to the right or equal to enemy
      if (player1.sprite.y < enemy.y){ // player is above the enemy
        //console.log("player is to the right and above the enemy");
        return (((this.height - enemy.y) + (player1.sprite.y)) + ((this.width - player1.sprite.x) + (enemy.x)));
      } else { //player is below or equal to the enemy
        //console.log("player is to the right and below the enemy");
        return (((this.height - player1.sprite.y) + (enemy.y)) + ((this.width - player1.sprite.x) + (enemy.x)));
      }
    }
  }

  //TODO: add another ray that goes directly forwards from the enemy infinitely
  //uses raycasting to avoid running into islands when chasing the player
  function avoidIslands(enemy, islands){
    //project a ray between the enemy and the player
    var ray = new Phaser.Line(enemy.x, enemy.y, player1.sprite.x, player1.sprite.y);
    //check if the ray is interrupted by any islands
    var intersect = getIslandIntersection(ray, islands);
    var rayAngle = ray.angle * 180/Math.PI;//convert ray angle into degrees from radians
    //if it is, turn away from the island
    if (intersect){
      if (enemy.angle - rayAngle >= 0){
        navigate(enemy, enemy.angle + enemy.TURN_RATE);
      } else {
        navigate(enemy, enemy.angle - enemy.TURN_RATE);
      }
    }
  }

  function getIslandIntersection(ray, islands){
    var distanceToisland = Number.POSITIVE_INFINITY;
    var closestIntersection = null;

// For each of the islands...
  islands.forEach(function(island) {
    // Create an array of lines that represent the four edges of each island
    var lines = [
        new Phaser.Line(island.x, island.y, island.x + island.width, island.y),
        new Phaser.Line(island.x, island.y, island.x, island.y + island.height),
        new Phaser.Line(island.x + island.width, island.y,
            island.x + island.width, island.y + island.height),
        new Phaser.Line(island.x, island.y + island.height,
            island.x + island.width, island.y + island.height)
    ];

    // Test each of the edges in this island against the ray.
    // If the ray intersects any of the edges then the island must be in the way.
    for(var i = 0; i < lines.length; i++) {
        var intersect = Phaser.Line.intersects(ray, lines[i]);
        if (intersect) {
            // Find the closest intersection
            distance =
                this.game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
            if (distance < distanceToisland) {
                distanceToisland = distance;
                closestIntersection = intersect;
            }
        }
    }
}, this);

return closestIntersection;
};
/*

  function avoidIslands(enemy, islands){
    var island;
    for (var i = 0; i < islands.length; i++){
      island = islands[i];
      console.log("Island: " + island);
    if ((Math.abs(enemy.x - island.x) < 200) && (Math.abs(enemy.y - island.y) < 200)){
      console.log("avoid that island!");
      var targetAngle = this.game.math.angleBetween(
        ship.x, ship.y,
        island.x, island.y
      );
      var wrapAngle = Math.abs(this.game.math.wrapAngle(enemy.angle - targetAngle));
      if (wrapAngle >= 0 && wrapAngle <=120){//need to turn left
        navigate(enemy, enemy.angle - enemy.TURN_RATE);
      } else if (wrapAngle < 0 && wrapAngle >= -120){//need to turn right
        navigate(enemy, enemy.angle + enemy.TURN_RATE);
      }
    }
  }
}
*/
  //AI for the standard, "normal" enemy. It uses a blend of simple chasing,
  //flocking, and running away to keep the player on their toes
  function normalAI(ship, wind){
    //look for man o'wars to flock with
    // if there is another normal enemy in front of/behind this ship, flock with it
    // if health is high (over 50%?), or the player's health is low and not invincible, attack the player like a gunboat
    if ((ship.health > enemyHealth['normal']/2) || (player1.health <= 2 && !player1.getIsInvincible())){
      gunBoatAI(ship,wind,true);
    } else {
      // otherwise, run away from the player
      runAway(ship, wind);
    }
  }

  //AI for the heavy "man O' war" enemy. It wants to flock with other ships (especially otehr man o wars)
  //into either a line formation or into a circled-wagon formation in order to maximize firepower
  function manOwarAI(ship, wind){
    var manOwarArray = countManOwars();
    //check if the ship has a ship in front of it
    //check if the ship has a ship behind it
    //ship is in front of the line or ship is at 30% health
    if ((ship.isLeader && !ship.isFollowing) || ship.health < enemyHealth[ship.key] * 0.3){
      gunBoatAI(ship,wind, true);
    } else if (ship.isFollowing){ //ship is in the middle of the line
      if (!ship.followingShip.alive){
        ship.isFollwing = false;
      }
      //keep following the ship in front
      var targetAngle = this.game.math.angleBetween(
        ship.x, ship.y,
        ship.followingShip.x, ship.followingShip.y
      );
      var followAngle = Math.abs(this.game.math.wrapAngle(ship.angle - targetAngle));
      if (followAngle > 0 && followAngle <= 180){ //need to turn left
        navigate(ship, ship.angle - ship.TURN_RATE);
      } else if (followAngle < 0 && followAngle > -180){ //need to turn right
        navigate(ship, ship.angle + ship.TURN_RATE);
      }
      var leadX = player1.sprite.x - (player1.sprite.body.velocity.x * .75);
      var leadY = player1.sprite.y - (player1.sprite.body.velocity.y * .75);
      //find the angle if the ship were to go directly
      var targetAngle = this.game.math.angleBetween(
          ship.x, ship.y,
          leadX, leadY
        );
      //repel nearby man o wars to form a proper flock
      var repulsion = repelShips(ship, manOwarArray, 70);
      ship.body.velocity.add(repulsion.x, repulsion.y);
      broadside(ship, targetAngle);
      //if the player is in the firing cone, shoot
    } else { //ship is loose
      //if the player is close, attack, otherwise flock
      if (game.physics.arcade.distanceBetween(player1.sprite, ship) < 400){
        gunBoatAI(ship, wind, true);
      } else if (manOwarArray.length > 0){ //there are ships to flock with
        var friend = findNearestShip(ship, manOwarArray);
        ship.followingShip = friend;
        ship.isFollowing;
        var leadX = friend.x - (friend.body.velocity.x * .75);
        var leadY = friend.y - (friend.body.velocity.y * .75);
        //find the angle if the ship were to go directly
        var targetAngle = this.game.math.angleBetween(
            ship.x, ship.y,
            leadX, leadY
          );
        broadside(ship, targetAngle);
      } else {
        var centroid = Phaser.Point.centroid(manOwarArray);

      }
    }
  }

  function countManOwars(){
    var enemy;
    var array = new Array();
    for (var i = 0; i < storage1.getEnemies().length; i++){
      enemy = storage1.getEnemies().children[i];
      if(enemy.alive && enemy.key === 'manowar'){
        array.push(enemy);
      }
    }
    return array;
  }

  function findNearestShip(ship, array){
    var friend;
    var tempFriend;
    var shortestDistance = this.width + this.height;
    for (var i = 0; i < array.length; i++){
      tempFriend = array[i];
      if (game.physics.arcade.distanceBetween(tempFriend, ship) < shortestDistance){
        friend = tempFriend;
      }
    }
    return friend;
  }

  //AI for the light "dhow" enemy. It wants to avoid getting hit as much as possible, so it runs
  //away most of the time and only attacks when the player would be most vulnerable
  function dhowAI(ship, wind){
    //check the ship's current "courage" value
    if (ship.courage < 150){
      ship.courage++;
      runAway(ship, wind);
    } else {
      //if it's at or above the threshhold, look to attack.
      dhowAttack(ship);
    }
  }

  //runs away from the player, and avoids going upwind
  function runAway(ship, wind){
    //check the location of the player- if it's close, then change course
    if (game.physics.arcade.distanceBetween(player1.sprite,ship) < 600){
      var targetAngle = this.game.math.angleBetween(
        ship.x, ship.y,
        player1.sprite.x, player1.sprite.y
      );
      var wrapAngle = Math.abs(this.game.math.wrapAngle(ship.angle - targetAngle));
      if (wrapAngle >= 0 && wrapAngle <=120){//need to turn left
        navigate(ship, ship.angle - ship.TURN_RATE);
      } else if (wrapAngle < 0 && wrapAngle >= -120){//need to turn right
        navigate(ship, ship.angle + ship.TURN_RATE);
      }
    } else if (ship.isGoingUpWind){
      switch(wind){
        case 'N':
          if (ship.angle < 0 && ship.angle > -90){//turn right
            navigate(ship, ship.angle + ship.TURN_RATE);
          } else {
            navigate(ship, ship.angle - ship.TURN_RATE);
          } break;
        case 'W':
          if (ship.angle < 180 && ship.angle > 0){//turn left
            navigate(ship, ship.angle - ship.TURN_RATE);
          } else {
            navigate(ship, ship.angle + ship.TURN_RATE);
          } break;
        case 'S':
          if (ship.angle > 0 && ship.angle < 90){//turn left
            navigate(ship, ship.angle - ship.TURN_RATE);
          } else {
            navigate(ship, ship.angle + ship.TURN_RATE);
          } break;
        default://east
          if (ship.angle > 0 && ship.angle < 90){//turn left
            navigate(ship, ship.angle - ship.TURN_RATE);
          } else {
            navigate(ship, ship.angle + ship.TURN_RATE);
      }
    }
  }
}

  //when it's time, the dhow turns to the player and shoots for a shor time
  function dhowAttack(ship, wind){
    //console.log("I am not afraid!");
    var targetAngle = this.game.math.angleBetween(
      ship.x, ship.y,
      player1.sprite.x, player1.sprite.y
    );
    navigate(ship, targetAngle);
    if (game.physics.arcade.distanceBetween(player1.sprite,ship) < 400){
      ship.weapons[0].fire();
      game.time.events.add(800, function () {ship.courage = 0;});
    }
    //if shots land, reset the courage value so the dhow will run away
  }

  //AI for melee enemies that just chase the player
  function chaseAI(chaser){
    //console.log("The tetnacle has a mind");
    if (!chaser.grabbedPlayer){
      var straightDistance = game.physics.arcade.distanceBetween(player1.sprite, chaser);//find the direct distance to the player
      //find the round the world distance to the player
      var roundDistance = getDaGamaDistance(chaser);
      //find the angle if the ship were to go directly
      var targetAngle = this.game.math.angleBetween(
        chaser.x, chaser.y,
        player1.sprite.x, player1.sprite.y
      );
      if (straightDistance <= roundDistance){
        navigate(chaser, targetAngle);
      } else {
        navigate (chaser, 0 - targetAngle);
      }
    } else { //the chaser has grabbed the player
      chaser.x = player1.x;
      chaser.y = player1.y;
    }
  }

  //makes tentacles repel each other so they don't clump together
  function repelTentacles(tentacle, length, repulsionDistance){
    // keep tentacles away from closed tentacles
    var repulsion = new Phaser.Point(0, 0);
    for (var i=0; i < length; i++) {
      if (i !== tentacle.id && tentacle.position.distance(storage1.getTentacleGroup().children[i].position) < repulsionDistance) {
      var sub = Phaser.Point.subtract(storage1.getTentacleGroup().children[i].position, tentacle.position);
      repulsion.subtract(sub.x, sub.y);
      }
    }
    //console.log(repulsion);
    return repulsion;
  }

  //makes piranhas repel each other so they don't clump together
  function repelpiranhas(piranha, length, repulsionDistace){
    var repulsion = new Phaser.Point(0, 0);
    for (var i=0; i < length; i++) {
      if (i !== piranha.id && piranha.position.distance(storage1.getEnemies().children[i].position) < repulsionDistace) {
      var sub = Phaser.Point.subtract(storage1.getEnemies().children[i].position, piranha.position);
      repulsion.subtract(sub.x, sub.y);
      }
    }
    //console.log(repulsion);
    return repulsion;
  }

  //makes flocking ships repel each other so they don't clump together
  function repelShips(ship, array, repulsionDistance){
    var repulsion = new Phaser.Point(0, 0);
    for (var i=0; i < array.length; i++) {
      if (i !== ship.id && ship.position.distance(array[i].position) < repulsionDistance) {
      var sub = Phaser.Point.subtract(array[i].position, ship.position);
      repulsion.subtract(sub.x, sub.y);
      }
    }
    //console.log(repulsion);
    return repulsion;
  }

  function sharkAI(shark, islands){
    chaseAI(shark);
    avoidIslands(shark, islands);
  }

  //the ghost ship mirrors whatever the player does
  function ghostShipAI(ghostShip){
    //console.log("You're being haunted");
      if (ghostShip.x > (this.width - player1.sprite.x)){
        //console.log("Need to go left");
        ghostShip.x -= 2;
      } else if(ghostShip.x < (this.width - player1.sprite.x)){
        //console.log("Need to go right");
        ghostShip.x += 2;
      }
      if (ghostShip.y > (this.height - player1.sprite.y)){
        //console.log("Need to go up");
        ghostShip.y -= 2;
      } else if(ghostShip.y < (this.height - player1.sprite.y)){
        //console.log("Need to go down");
        ghostShip.y += 2;
      }
      ghostShip.angle = 180 + player1.sprite.angle;
      ghostShip.frame = getGhostShipFrame();
      var angle = ghostShip.angle;
      enemyWeapons.setGhostWeaponAngles(angle);
      enemyWeapons.getGhostWeaponAngles();
    }

    //makes the ghost ship use the opposite wake sprite as the player
    function getGhostShipFrame(){
      if (player1.sprite.frame >= 0 && player1.sprite.frame < 3){
        return 9;
      } else if (player1.sprite.frame >= 3 && player1.sprite.frame < 6){
        return 6;
      } else if (player1.sprite.frame >= 6 && player1.sprite.frame < 9){
        return 3;
      } else {
        return 0;
      }
    }

    //finds the frame for the junk ship, which has a unique spritesheet
    function junkFrame(angle, wind){
      var retVal;
      switch(wind){
        case 'N':
        if ((angle < -90 && angle > -270) || (angle < 270 && angle > 90)){
          retVal = 0;
        } else {
          retVal = 3;
        }
        break;
        case 'W':
          if ((angle < 0 && angle > -180)|| (angle > 0 && angle < 180)){
            retVal = 0;
          } else {
            retVal = 3;
          }
        break;
        case 'S':
          if ((angle < -90 && angle > -270) || (angle < 270 && angle > 90)){
          retVal = 3;
          } else {
          retVal = 0;
          }
        break;
        default://east
          if ((angle < 0 && angle > -180)|| (angle > 0 && angle < 180)){
            retVal = 3;
          } else {
            retVal = 0;
          }
      }
      return retVal;
    }

    //the junk avoids the player and islands, launching rockets every few frames
    function junkAI(junk, islands, wind){
      //console.log("Sun Tsu says..." + junk.timeToFire + " " + junk.weapon.fireAngle);
      if (game.physics.arcade.distanceBetween(player1.sprite, junk) < 400){
        runAway(junk, wind);
      }
        junk.weapon.fire();
        junk.weapon.fireAngle += 15;
        avoidIslands(junk, islands);//shouldn't work all the time because of how the function works
    }

    function moabAI(moab){
      //console.log("Just, you know, doing MOAB stuff");
      if (moab.patternTime <= 0){
        //randomly chooses one of the 3 possible patterns if the patternTime has run out
        moab.pattern = Math.floor(Math.random() * 4);
        moab.patternTime = 600;
      } else {
        moab.patternTime--;
        if (moab.pattern === 0){
          moabFiringPattern0(moab);
        } else if (moab.pattern === 1){
          moabFiringPattern1(moab);
        } else if (moab.pattern === 2){
          moabFiringPattern2(moab);
        } else {
          moabFiringPattern3(moab);
        }
      }
      var navigationAngle;
      console.log("Going to point 1? " + moab.goingToPoint1);
      if (moab.goingToPoint1){
        navigationAngle = this.game.math.angleBetween(
            moab.x, moab.y,
            moab.point1.x, moab.point1.y
        );

      } else {
        navigationAngle = this.game.math.angleBetween(
            moab.x, moab.y,
            moab.point2.x, moab.point2.y
        );
      }
        navigate(moab, navigationAngle);
        if (moab.goingToPoint1 && (game.physics.arcade.distanceBetween(moab, moab.point1) < 10)){
          console.log("passed point1");
          moab.goingToPoint1 = false;
        } else if (!moab.goingToPoint1 && (game.physics.arcade.distanceBetween(moab, moab.point2) < 10)){
          console.log("passed point2");
          moab.goingToPoint1 = true;
        }
    }

    function  moabFiringPattern0(moab){
      console.log("Firing pattern 0");
      for (i = 0; i < moab.weapons.length; i++){//alternates between shooting for 120 frames and for 40 frames
        //long and short bursts with 60 frames inbetween them
        if ((moab.patternTime < 600 && moab.patternTime >= 480) || (moab.patternTime < 420 && moab.patternTime >= 380) ||
        (moab.patternTime < 320 && moab.patternTime >= 200) || (moab.patternTime < 140 && moab.patternTime >= 20)){
        moab.weapons[0][i].fire();
        moab.weapons[1][i].fire();
        }
      }
    }

    //This firing pattern is good for now. It leaves nice ship-sized gaps in it.
    function  moabFiringPattern1(moab){
      console.log("Firing Pattern 1");
      for (i = 0; i < moab.weapons.length; i++){
        if (Math.floor(moab.patternTime/10) % 2 === 0){
          moab.weapons[0][i].fire();
        } else {
          moab.weapons[1][i].fire();
        }
      }
    }

    //sprays bullets everywhere for a short time at fixed intervals
    function  moabFiringPattern2(moab){
      console.log("Firing Pattern 2");
      for (i = 0; i < moab.weapons.length; i++){
        if ((moab.patternTime < 600 && moab.patternTime >= 650) || (moab.patternTime < 450 && moab.patternTime >= 400)
        || (moab.patternTime < 250 && moab.patternTime >= 200) || (moab.patternTime <50 && moab.patternTime >= 0)){
        moab.weapons[0][i].fire();
        moab.weapons[1][i].fire();
      }
      }
    }

    //fires the left weapon half the time and the right weapon the other half
    function  moabFiringPattern3(moab){
      console.log("Firing Pattern 3");
      for (i = 0; i < moab.weapons.length; i++){
        if ((moab.patternTime < 600 && moab.patternTime >= 500) || (moab.patternTime < 400 && moab.patternTime >= 300)
        || (moab.patternTime < 200 && moab.patternTime >= 100)){
          moab.weapons[0][i].fire();
        } else {
          moab.weapons[1][i].fire();
        }
      }
    }

    //the same as moabFiringPattern3.
    function whaleFiringPattern(whale){
      if (whale.patternTime < 200 && whale.patternTime >= 100){
        whale.weapons[0].fire();
      } else {
        whale.weapons[1].fire();
      }
      if (whale.patternTime <= 0){
        whale.patternTime = 200;
      } else {
        whale.patternTime--;
      }
    }

    //lets bosses that move in fixed NSWE patterns execute the patterns in their directions array
    function patternAI(enemy){
      console.log("Call me Ishmael " + enemy.directions[enemy.currentDirection] + " " + enemy.directionTime);
      if (enemy.directionTime <= 0){
        enemy.directionTime = 60;
        if (enemy.currentDirection > enemy.directions.length){
          enemy.currentDirection = 0;
        } else {
          enemy.currentDirection++;
        }
      } else {
        enemy.directionTime--;
        var targetAngle;
        if (enemy.directions[enemy.currentDirection] === 'N'){
          targetAngle = this.game.math.angleBetween(
              enemy.x, enemy.y,
              enemy.x, 0
          );
        } else if (enemy.directions[enemy.currentDirection] === 'S'){
          targetAngle = this.game.math.angleBetween(
              enemy.x, enemy.y,
              enemy.x, this.height
          );
        } else if (enemy.directions[enemy.currentDirection] === 'W'){
          targetAngle = this.game.math.angleBetween(
              enemy.x, enemy.y,
              0, enemy.y
          );
        } else if (enemy.directions[enemy.currentDirection] === 'E'){
          targetAngle = this.game.math.angleBetween(
              enemy.x, enemy.y,
              this.width, enemy.y
          );
        }
        navigate(enemy, targetAngle);
      }
    }

    function galleonAI(galleon, wind,){
      //console.log("Queremos que navigar " + galleon.position);
      if (galleon.health < galleon.health/3){
        //console.log("Time to run away");
        runAway(galleon, wind);
      } else {
        //console.log("Time to attack");
        gunBoatAI(galleon, wind, false);
      }
      //a modified version of the broadside() function based on the galleon shooting backwards
      var leadX = player1.sprite.x + (player1.sprite.body.velocity.x * 3);
      var leadY = player1.sprite.y + (player1.sprite.body.velocity.y * 3);
      var targetAngle = this.game.math.angleBetween(
              galleon.x, galleon.y,
              leadX, leadY
          );
      var relFiringAngle = Math.abs(this.game.math.wrapAngle(galleon.angle - targetAngle));
      //console.log("relFiringAngle: "+ relFiringAngle);
    //if the player is in or near the firing angle
      if ((relFiringAngle >=160 && relFiringAngle <= 180) || (relFiringAngle <= -160 && relFiringAngle >= -180)){
          galleon.weapon.fire();
        }
    }

    //the weapons fire continuously, rotating in the opposite direction as the ship is moving
    function clipperFiringPattern(clipper){
      var weapon1 = clipper.weapons[0];
      var weapon2 = clipper.weapons[1];
      if (clipper.currentDirection < 8){//going counterclockwise
        weapon1.fire();
        weapon1.fireAngle += 2;
        weapon2.fire();
        weapon2.fireAngle += 2;
      } else {
        weapon1.fire();
        weapon1.fireAngle -= 2;
        weapon2.fire();
        weapon2.fireAngle -= 2;
      }
    }

    //alternates firing weapons 1 & 3 and 2 & 4, fires in all 4 directions at the end
    function longBoatFiringPattern(longboat){
      if (longboat.patternTime <= 0){
        longboat.patternTime = 250;
      } else {
        if (longboat.patternTime < 50){
          longboat.weapons[0].fire();
          longboat.weapons[1].fire();
          longboat.weapons[2].fire();
          longboat.weapons[3].fire();
        } else if ((Math.floor(longboat.patternTime/10) % 2) === 0){
          longboat.weapons[0].fire();
          longboat.weapons[2].fire();
        } else {
          longboat.weapons[1].fire();
          longboat.weapons[3].fire();
        }
        longboat.patternTime--;
      }
    }


  //calls the appropriate functions for each boss depending on what string is passed in
  function bossWave(type){
    console.log(type);
    var boss;
    switch(type){
      case 'ghost':
        boss = ghostShip();
        break;
      case 'megaladon':
        boss = megaladon();
        break;
      case 'junk':
        boss = junkShip();
        break;
      case 'moab':
        boss = motherOfAllBoats(this.wind);
        break;
      case 'mobyDick':
        boss = greatWhiteWhale();
        break;
      case 'piranha':
        boss = generatePiranhas(12);
        break;
      case 'galleon':
        boss = galleon(this.wind);
        break;
      case 'clipper':
        boss = clipperShip();
        break;
      case 'longboat':
        boss = vikingShip();
        break;
      case 'trireme':
        boss = greekShip(this.wind);
        break;
      default://kraken
        boss = releaseKraken();
    }
    return boss;
  }

  //initializes the kraken boss
  function releaseKraken(){
    //console.log("RELEASE THE KRAKEN");
    //var placeArray = findGoodPlace(Math.Random() * this.width, Math.random() * this.height, this.islands);
    var x = Math.random() * this.width;
    var y = Math.random() * this.height;
    //console.log(x +  ", " + y);
    var kraken = this.game.add.sprite(x, y, 'kraken');
    this.game.physics.enable(kraken, Phaser.Physics.ARCADE);
    kraken.enableBody = true;
    kraken.anchor.setTo(0.5, 0.5);
    kraken.body.immovable = true;
    kraken.health = 6;
    generateTentacles(x, y);
    return kraken;
    //TODO: add tentacles
  }

  //moves the kraken to a new place after it has been shot
  function moveKraken(kraken){
    //console.log("We've moved to " + kraken.x + ", " + kraken.y);
    //var placeArray = findGoodPlace(Math.Random() * this.width, Math.random() * this.height, this.islands);
    kraken.x = Math.random() * this.width;
    kraken.y = Math.random() * this.height;
    //killAllTentacles();
    generateTentacles(kraken.x, kraken.y);
  }

  //generates the kraken's tentacles, which are essentially its weapon
  function generateTentacles(x, y){
    for (var i = 0; i < 8; i++){
      var tentacle = this.game.add.sprite(x, y, 'tentacle');
      this.game.physics.enable(tentacle, Phaser.Physics.ARCADE);
      tentacle.enableBody = true;
      tentacle.anchor.setTo(0.5, 0.5);
      tentacle.angle = setTentacleAngle(i);
      tentacle.maxSpeed = 150; //TODO: balance this
      tentacle.collideWorldBounds = false;
      tentacle.body.velocity.x = findTentacleXSpeed(i, tentacle.maxSpeed);
      tentacle.body.velocity.y = findTentacleYSpeed(i, tentacle.maxSpeed);
      tentacle.frame = Math.floor(Math.random() * 3);
      tentacle.grabbedPlayer = false;
      tentacle.TURN_RATE = 12;
      tentacle.id = i;
      storage1.addTentacle(tentacle);
    }
  }

  //sets the initial angle of each tentacle
  function setTentacleAngle(i){
    if (i === 0){
      return -90;
    } else if (i === 2){
      return 0;
    } else if (i === 4){
      return 90;
    } else if (i === 6){
      return 180;
    } else {
      return 45 * i;
    }
  }

  //finds proper x speed based on the tentacle's angle
  function findTentacleXSpeed(i, maxSpeed){
    if (i === 0 || i === 4){
      return 0;
    } else if (i === 1 || i === 3){
      return maxSpeed/2;
    } else if (i === 2){
      return maxSpeed;
    } else if (i === 5 || i === 7){
      return 0 - maxSpeed/2;
    } else {//6
      return 0 - maxSpeed;
    }
  }

  //finds the proper y speed based on the tentacle's angle
  function findTentacleYSpeed(i, maxSpeed){
    if (i === 0){
      return maxSpeed;
    } else if (i === 4){
      return 0 - maxSpeed;
    } else if (i === 2 || i === 6){
      return 0;
    } else if (i === 1 || i === 7){
      return maxSpeed/2;
    } else if (i === 3 || i === 5){
      return 0 - maxSpeed/2;
    }
  }

  //destroys every tentacle after the kraken has moved or died
  function killAllTentacles(){
    //console.log("Kill all the tentacles");
    for (var i = 0; i < storage1.getTentacleGroup().children.length; i++){
      var tentacle = storage1.getTentacleGroup().children[i];
      tentacle.kill();
    }
  }

  //initializes the ghost ship boss
  function ghostShip(){
    var x, y;
    if (player1.sprite.y < this.height/2){
      y = this.height;
    } else {
      y = 0;
    }
    x = this.width - player1.sprite.x;
    var ship = this.game.add.sprite(x, y, 'ship'); //uses the sam sprite as the player...what if the enemies we are battling are really ourselves? So deep.
    ship.tint = 0x2EFE2E; //green tint to the ship
    ship.health = enemyHealth['manowar'] * 2.5;
    ship.collideWorldBounds = false;
    ship.anchor.setTo(0.5, 0.5);
    enemyWeapons.trackGhostSprite(ship);
    return ship;
  }

  //initializes the megaladon boss
  function megaladon(){
    //console.log("We're going to need a bigger boat");
    var x, y, angle;
    if (player1.sprite.x < this.width/2){
      x = 0;
      angle = 0;
    } else {
      x = this.width;
      angle = 180;
    }
    y = Math.random() * this.height;
    var shark = this.game.add.sprite(x, y, 'megaladon');
    shark.enableBody = true;
    this.game.physics.enable(shark, Phaser.Physics.ARCADE);
    shark.anchor.setTo(0.5, 0.5);
    //TODO: balance health, speed, turn rate
    shark.health = enemyHealth['manowar'] * 1.5;
    shark.TURN_RATE = 10;
    shark.maxSpeed = 200;
    shark.grabbedPlayer = false;
    shark.frame = 0;
    shark.animations.add('swim');
    return shark;
  }

  //initializes the junk ship boss
  function junkShip(){
    var x, y, angle, xSpeed, ySpeed;
    var spawnLocation = Math.random();
    if (spawnLocation < 0.25){
      x = 0;
      y = 0;
      angle = 45;
      xSpeed = 45;
      ySpeed = 45;
    } else if (spawnLocation < 0.5){
      x = this.width;
      y = 0;
      angle = 135;
      xSpeed = -45;
      ySpeed = 45;
    } else if (spawnLocation < 0.75){
      x = this.width;
      y = this.height;
      angle = -135;
      xSpeed = -45;
      ySpeed = -45;
    } else {
      x = 0;
      y = this.height;
      angle = -45;
      xSpeed = 45;
      ySpeed = -45;
    }
    var junk = this.game.add.sprite(x, y, 'junk');
    junk.enableBody = true;
    this.game.physics.enable(junk, Phaser.Physics.ARCADE);
    junk.anchor.setTo(0.5, 0.5);
    //TODO: balance health, speed, turn rate
    junk.health = enemyHealth['manowar'] * 1.5;
    junk.TURN_RATE = 10;
    junk.maxSpeed = 65;
    junk.angle = angle;
    junk.body.velocity.x = xSpeed;
    junk.body.velocity.y = ySpeed;
    var weapon = this.game.add.weapon(30, 'rocket');
    weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    weapon.bulletLifespan = 2350;
    weapon.bulletSpeed = 200;
    weapon.fireRate = 50;
    weapon.bulletAngleVariance = 10;
    weapon.bulletCollideWorldBounds = false;
    weapon.bulletWorldWrap = true;
    weapon.trackSprite(junk, 0, 0, false);
    junk.weapon = weapon;
    return junk;
  }

  //initializes the MOAB boss
  function motherOfAllBoats(wind){
    var x, y, angle, xSpeed, ySpeed, point1x, point1y, point2x, point2y;
    //find an open area on the upwind edge
    switch(wind){
      case 'N':
        x = Math.random() * this.width; //TODO: make this find an empty area instead of a random one
        y = 0;
        angle = 90;
        xSpeed = 0;
        ySpeed = 250;
      break;
      case 'S':
        x = Math.random() * this.width; //TODO: make this find an empty area instead of a random one
        y = this.height;
        angle = -90;
        xSpeed = 0;
        ySpeed = -250;
      break;
      case 'W':
        x = 0;
        y = Math.random() * this.height;
        angle = 0;
        xSpeed = 250;
        ySpeed = 0;
      break;
      default://east
        x = this.width;
        y = Math.random() * this.height;
        angle = 180;
        xSpeed = -250;
        ySpeed = 0;
    }
    var moab = this.game.add.sprite(x, y, 'moab');
    moab.angle = angle;
    moab.enableBody = true;
    this.game.physics.enable(moab, Phaser.Physics.ARCADE);
    moab.anchor.setTo(0.5, 0.5);
    console.log("Holy mother of all boats! " + moab.body);
    moab.body.velocity.x = xSpeed;
    moab.body.velocity.y = ySpeed;
    moab.maxSpeed = 180; //TODO: make the speed change depending on the direction of the wind
    moab.TURN_RATE = 16;
    moab.health = enemyHealth['manowar'] * 2;
    moab.weapons = makeMoabWeapons(moab);
    moab.patternTime = 600;
    moab.pattern = 0;
    point1x = Math.random() * this.width; //TODO: make this find an open area instead of just a random one
    point1y = Math.random() * this.height;
    point2x = point1x - 600;
    point2y =  (Math.random()>0.5?1:-1) * (Math.random() * 245) + point1y;
    var point1 = new Phaser.Point(point1x, point1y)
    var point2 = new Phaser.Point(point2x, point2y);
    moab.point1 = point1;
    moab.point2 = point2;
    moab.goingToPoint1 = true;
    return moab;
  }

  //TODO: figure out how to make weapons track a specific part of the boat.
  //just changing the fireFrom(x,y) makes bullets fire from the ocean, because they move
  //a specific distance up or down relative to the sprite's anchor, but not to its angle
  function makeMoabWeapons(moab){
    var LWeapons = new Array();
    for (var i = 0; i < 10; i++){
      var LWeapon = this.game.add.weapon(100, 'cannonball');
      LWeapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
      LWeapon.bulletLifespan = 2250;
      LWeapon.bulletSpeed = 200;
      LWeapon.fireRate = 35;
      LWeapon.bulletAngleVariance = 2;
      LWeapon.bulletCollideWorldBounds = false;
      LWeapon.bulletWorldWrap = true;
      LWeapon.trackSprite(moab, 0, 0, false);
      LWeapons.push(LWeapon);
    }
    var RWeapons = new Array();
    for (var i = 0; i < 10; i++){
      var RWeapon = this.game.add.weapon(100, 'cannonball');
      RWeapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
      RWeapon.bulletLifespan = 2250;
      RWeapon.bulletSpeed = 200;
      RWeapon.fireRate = 35;
      RWeapon.bulletAngleVariance = 2;
      RWeapon.bulletCollideWorldBounds = false;
      RWeapon.bulletWorldWrap = true;
      RWeapon.trackSprite(moab, 0, 0, false);
      RWeapons.push(RWeapon);
    }
    var weapons = new Array();
    weapons.push(LWeapons);
    weapons.push(RWeapons);
    //console.log("MOAB weapons made");
    //console.log("LWeapons: " + LWeapons + " first weapon: " + LWeapons[0]);
    return weapons;
  }

  //sets the gangle for every one of the MOAB's weapons and makes sure arcade physics are
  //working properly on them
  function trackMoabWeapons(moab, islands){
    var LWeapon, RWeapon;
    var LWeapons = moab.weapons[0];
    var RWeapons = moab.weapons[1];
    for (var i = 0; i < 10; i++){
      LWeapon = LWeapons[i];
      RWeapon = RWeapons[i];
      LWeapon.fireAngle = moab.angle - 90;
      RWeapon.fireAngle = moab.angle + 90;
      game.physics.arcade.overlap(islands, LWeapon.bullets, islandWasShot);
      game.physics.arcade.overlap(islands, RWeapon.bullets, islandWasShot);
      game.physics.arcade.overlap(player1.sprite, LWeapon.bullets, playerWasShot);
      game.physics.arcade.overlap(player1.sprite, RWeapon.bullets, playerWasShot);
    }
  }

  //initializes Moby Dick boss
  function greatWhiteWhale(){
    var x, y, angle;
    if (player1.sprite.y < this.height/2){
      y = 0;
      angle = 90;
    } else {
      y = this.height;
      angle = -90;
    }
    x = Math.random() * this.width;
    var whale = this.game.add.sprite(x, y, 'mobyDick');
    whale.enableBody = true;
    this.game.physics.enable(whale, Phaser.Physics.ARCADE);
    whale.anchor.setTo(0.5, 0.5);
    //TODO: balance health, speed, turn rate
    whale.health = enemyHealth['manowar'] * 1.2;
    whale.TURN_RATE = 10;
    whale.maxSpeed = 250;
    whale.directions = ['N', 'S', 'N', 'W', 'E', 'W', 'S', 'N', 'S', 'E', 'W', 'E'];
    whale.currentDirection = 0;
    whale.directionTime = 60;
    whale.frame = 0;
    whale.animations.add('swim');
    var weapons = new Array(); //this is to allow the whale to use moab firing patterns
    var weapon = this.game.add.weapon(100, 'waterball');
    weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    weapon.bulletLifespan = 2250;
    weapon.bulletSpeed = 180;
    weapon.fireRate = 65;
    weapon.bulletAngleVariance = 2;
    weapon.bulletCollideWorldBounds = false;
    weapon.bulletWorldWrap = true;
    weapon.trackSprite(whale, 0, 0, false);
    weapons.push(weapon);
    var weapon2 = this.game.add.weapon(100, 'waterball');
    weapon2.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    weapon2.bulletLifespan = 2250;
    weapon2.bulletSpeed = 180;
    weapon2.fireRate = 65;
    weapon2.bulletAngleVariance = 2;
    weapon2.bulletCollideWorldBounds = false;
    weapon2.bulletWorldWrap = true;
    weapon2.trackSprite(whale, 0, 0, false);
    weapons.push(weapon2);
    whale.weapons = weapons;
    whale.patternTime = 200;
    return whale;
  }

  //initializes the clipper ship boss
  function clipperShip(){
    var x, y, angle;
    if (player1.sprite.y < this.height/2){
      y = 0;
      angle = 90;
    } else {
      y = this.height;
      angle = -90;
    }
    x = Math.random() * this.width;
    var clipper = this.game.add.sprite(x, y, 'clipper');
    clipper.enableBody = true;
    //clipper.body.bounce.set(0.5); //bugs out the game for some reason
    this.game.physics.enable(clipper, Phaser.Physics.ARCADE);
    clipper.anchor.setTo(0.5, 0.5);
    //TODO: balance health, speed, turn rate
    clipper.health = enemyHealth['normal'] * 2;
    clipper.TURN_RATE = 10;
    clipper.directions = ['N', 'N', 'W', 'W', 'S', 'S', 'E', 'E', 'W', 'W', 'N', 'N', 'E', 'E', 'S', 'S']; //goes in a big loop, turns around when it hits the SE corner
    clipper.currentDirection = 0;
    clipper.directionTime = 50;
    clipper.maxSpeed = enemyUpWindSpeed['clipper'];
    var weapons = new Array(); //this is to allow the whale to use moab firing patterns
    var weapon = this.game.add.weapon(100, 'cannonball');
    weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    weapon.bulletLifespan = 450;
    weapon.bulletSpeed = 400;
    weapon.fireRate = 30;
    weapon.bulletAngleVariance = 5;
    weapon.bulletCollideWorldBounds = false;
    weapon.bulletWorldWrap = true;
    weapon.fireAngle = angle + 90;
    weapon.trackSprite(clipper, 0, 0, false);
    weapons.push(weapon);
    var weapon2 = this.game.add.weapon(100, 'cannonball');
    weapon2.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    weapon2.bulletLifespan = 450;
    weapon2.bulletSpeed = 400;
    weapon2.fireRate = 30;
    weapon2.bulletAngleVariance = 5;
    weapon2.bulletCollideWorldBounds = false;
    weapon2.bulletWorldWrap = true;
    weapon2.fireAngle = angle - 90;
    weapon2.trackSprite(clipper, 0, 0, false);
    weapons.push(weapon2);
    clipper.weapons = weapons;
    return clipper;
  }

  //initializes several piranhas as a "boss"
  function generatePiranhas(numPiranhas){
    var piranha, x, y, angle;
    for (var i = 0; i < numPiranhas; i++){
      x = Math.random() * this.width;
      if (i % 2 === 0){
        y = 0;
        angle = -90;
      } else {
        y = this.height;
        angle = 90;
      }
      var piranha = this.game.add.sprite(x, y, 'piranha');
      this.game.physics.enable(piranha, Phaser.Physics.ARCADE);
      piranha.enableBody = true;
      piranha.anchor.setTo(0.5, 0.5);
      piranha.id = i;
      piranha.maxSpeed = 300;
      piranha.health = 15;
      piranha.TURN_RATE = 12;
      piranha.angle = angle;
      piranha.animations.add('swim');
      if (i != numPiranhas - 1){
        storage1.addEnemy(piranha);
      } else {
        return piranha;//this is to make the function still return something
      }
    }
  }

  //initializes the galleon boss
  function galleon(wind){
    //console.log("Is that Ponce de Leon?");
    var galleon, x, y, angle, xSpeed, ySpeed;
    //the galleon always comes from upwind
    switch(wind){
      case 'N':
        x = Math.random() * this.width;
        y = 0;
        angle = 90;
        xSpeed = 0;
        ySpeed = 200;
        break;
      case 'S':
        x = Math.random() * this.width;
        y = this.height;
        angle = -90;
        xSpeed = 0;
        ySpeed = -200;
        break;
      case 'W':
        x = 0;
        y = Math.random() * this.height;
        angle = 0;
        xSpeed = 200;
        ySpeed = 0;
        break;
      default://east
        x = this.width;
        y = Math.random() * this.height;
        angle = 180;
        xSpeed = -200;
        ySpeed = 0;
    }
    galleon = this.game.add.sprite(x, y, 'galleon');
    //console.log("x: " + x + " y: " + y + " angle: "+ angle);
    galleon.frame = 0;
    galleon.anchor.setTo(0.5, 0.5);
    galleon.TURN_RATE = this.enemyTurnRate['galleon'];
    galleon.angle = angle;
    this.game.physics.enable(galleon, Phaser.Physics.ARCADE);// What are these "this" refering to???
    galleon.enableBody = true;
    galleon.body.collideWorldBounds = false;
    galleon.body.velocity.x = xSpeed;
    galleon.body.velocity.y = xSpeed;
    galleon.body.bounce.set(0.25);
    galleon.health = enemyHealth['manowar'];
    var weapon = this.game.add.weapon(25, 'bomb');
    weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    weapon.bulletLifespan = 5350;
    weapon.bulletSpeed = 20;
    weapon.fireRate = 160;
    weapon.bulletCollideWorldBounds = false;
    weapon.bulletWorldWrap = true;
    weapon.trackSprite(galleon, 0, 0, false);
    galleon.weapon = weapon;
    return galleon;
  }

  //initializes the longboat boss
  function vikingShip(){
    var x, y, angle;
    if (player1.sprite.x < this.width/2){
      x = 0;
      angle = 0;
    } else {
      x = this.width;
      angle = 180;
    }
    y = Math.random() * this.height;
    var longboat = this.game.add.sprite(x, y, 'longboat');
    longboat.enableBody = true;
    this.game.physics.enable(longboat, Phaser.Physics.ARCADE);
    longboat.anchor.setTo(0.5, 0.5);
    //TODO: balance health, speed, turn rate
    longboat.health = enemyHealth['manowar'] * 1.5;
    longboat.TURN_RATE = 10;
    longboat.maxSpeed = 200;
    if (angle === 0){
      longboat.directions = ['E', 'N', 'E', 'N', 'E', 'N', 'E', 'N', 'E', 'S', 'E', 'S', 'E', 'S'];
    } else {
      longboat.directions = ['W', 'N', 'W', 'N', 'W', 'N', 'W', 'N', 'W', 'S', 'W', 'S', 'W', 'S'];
    }
    longboat.currentDirection = 0;
    longboat.directionTime = 60;
    longboat.frame = 0;
    longboat.animations.add('row');
    var weapons = new Array();
    var weapon = this.game.add.weapon(100, 'cannonball');
    weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    weapon.bulletLifespan = 2250;
    weapon.bulletSpeed = 200;
    weapon.fireRate = 60;
    weapon.bulletAngleVariance = 2;
    weapon.bulletCollideWorldBounds = false;
    weapon.bulletWorldWrap = true;
    weapon.trackSprite(longboat, 0, 0, false);
    weapon.fireAngle = 180;
    weapon.bulletInheritSpriteSpeed = true;
    weapons.push(weapon);
    var weapon2 = this.game.add.weapon(100, 'cannonball');
    weapon2.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    weapon2.bulletLifespan = 2250;
    weapon2.bulletSpeed = 200;
    weapon2.fireRate = 60;
    weapon2.bulletAngleVariance = 2;
    weapon2.bulletCollideWorldBounds = false;
    weapon2.bulletWorldWrap = true;
    weapon2.trackSprite(longboat, 0, 0, false);
    weapon2.fireAngle = -90;
    weapon2.bulletInheritSpriteSpeed = true;
    weapons.push(weapon2);
    var weapon3 = this.game.add.weapon(100, 'cannonball');
    weapon3.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    weapon3.bulletLifespan = 2250;
    weapon3.bulletSpeed = 200;
    weapon3.fireRate = 60;
    weapon3.bulletAngleVariance = 2;
    weapon3.bulletCollideWorldBounds = false;
    weapon3.bulletWorldWrap = true;
    weapon3.trackSprite(longboat, 0, 0, false);
    weapon3.fireAngle = 0;
    weapon3.bulletInheritSpriteSpeed = true;
    weapons.push(weapon3);
    var weapon4 = this.game.add.weapon(100, 'cannonball');
    weapon4.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    weapon4.bulletLifespan = 2250;
    weapon4.bulletSpeed = 200;
    weapon4.fireRate = 60;
    weapon4.bulletAngleVariance = 2;
    weapon4.bulletCollideWorldBounds = false;
    weapon4.bulletWorldWrap = true;
    weapon4.trackSprite(longboat, 0, 0, false);
    weapon4.fireAngle = 90;
    weapon4.bulletInheritSpriteSpeed = true;
    weapons.push(weapon4);
    longboat.weapons = weapons;
    longboat.patternTime = 250;
    return longboat;
  }

  //initializes the trireme boss
  function greekShip(wind){
    var x, y, angle;
    switch(wind){
      case 'N':
        x = Math.random() * this.width;
        y = 0;
        angle = 90;
        break;
      case 'S':
        x = Math.random() * this.width;
        y = this.height;
        angle = -90;
        break;
      case 'W':
        x = 0;
        y = Math.random() * this.height;
        angle = 0;
        break;
      default://east
        x = this.width;
        y = Math.random() * this.height;
        angle = 180;
    }
    var trireme = this.game.add.sprite(x, y, 'trireme');
    trireme.enableBody = true;
    this.game.physics.enable(trireme, Phaser.Physics.ARCADE);
    trireme.anchor.setTo(0.5, 0.5);
    //TODO: balance health, speed, turn rate
    trireme.health = enemyHealth['manowar'] * 1.5;
    trireme.TURN_RATE = 10;
    trireme.maxSpeed = 200;
    if (angle === 0){ //makes the classic greek square zig-zag
      trireme.directions = ['E', 'N', 'E', 'S'];
    } else  if (angle === 180){
      trireme.directions = ['W', 'N', 'W', 'S'];
    } else if (angle === 90){
      trireme.directions = ['S', 'E', 'S', 'W'];
    } else {//angle === -90
      trireme.directions = ['N', 'W', 'N', 'E'];
    }
    trireme.currentDirection = 0;
    trireme.directionTime = 60;
    trireme.frame = 0;
    trireme.animations.add('row');
    var weapons = new Array();
    var weapon = this.game.add.weapon(100, 'cannonball');
    weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    weapon.bulletLifespan = 1250;
    weapon.bulletSpeed = 100;
    weapon.fireRate = 60;
    weapon.bulletAngleVariance = 2;
    weapon.bulletCollideWorldBounds = false;
    weapon.bulletWorldWrap = true;
    weapon.trackSprite(trireme, 0, 0, false);
    weapon.fireAngle = -135;
    weapon.bulletInheritSpriteSpeed = true;
    weapons.push(weapon);
    var weapon2 = this.game.add.weapon(100, 'cannonball');
    weapon2.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    weapon2.bulletLifespan = 1250;
    weapon2.bulletSpeed = 100;
    weapon2.fireRate = 60;
    weapon2.bulletAngleVariance = 2;
    weapon2.bulletCollideWorldBounds = false;
    weapon2.bulletWorldWrap = true;
    weapon2.trackSprite(trireme, 0, 0, false);
    weapon2.fireAngle = -45;
    weapon2.bulletInheritSpriteSpeed = true;
    weapons.push(weapon2);
    var weapon3 = this.game.add.weapon(100, 'cannonball');
    weapon3.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    weapon3.bulletLifespan = 1250;
    weapon3.bulletSpeed = 100;
    weapon3.fireRate = 60;
    weapon3.bulletAngleVariance = 2;
    weapon3.bulletCollideWorldBounds = false;
    weapon3.bulletWorldWrap = true;
    weapon3.trackSprite(trireme, 0, 0, false);
    weapon3.fireAngle = 135;
    weapon3.bulletInheritSpriteSpeed = true;
    weapons.push(weapon3);
    var weapon4 = this.game.add.weapon(100, 'cannonball');
    weapon4.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    weapon4.bulletLifespan = 1250;
    weapon4.bulletSpeed = 100;
    weapon4.fireRate = 60;
    weapon4.bulletAngleVariance = 2;
    weapon4.bulletCollideWorldBounds = false;
    weapon4.bulletWorldWrap = true;
    weapon4.trackSprite(trireme, 0, 0, false);
    weapon4.fireAngle = 45;
    weapon4.bulletInheritSpriteSpeed = true;
    weapons.push(weapon4);
    trireme.weapons = weapons;
    trireme.patternTime = 250;
    return trireme;
  }

  //checks to see if the current wave is a boss wave
  function isBossWave(){
    return (storage1.getWave() % 5 === 0  || storage1.getWave() >= 25);
  }

  //checks to see if the ghost ship is alive so the game knows whether pressing
  //the spacebar makes just the player shoot or the player and the ghost ship
  function isGhostWave(){
    var children = storage1.getEnemies().children;
    var enemy;
    for (var i = 0; i < children.length; i++){
      enemy = children[i];
      if (enemy.alive && enemy.key === 'ship'){ //there is a live ghost ship in the game
        return true;
      }
    }
    return false;
  }

  //gets text for the gameover screen for each boss the player has killed
  function killedBossText(key){
    switch(key){
      case 'kraken':
        return "the kraken";
        break;
      case 'ghost':
        return "the ghost ship";
        break;
      case 'moab':
        return "the M.O.A.B.";
        break;
      case 'junk':
        return "a Chinese junk ship";
        break;
      case 'megaladon':
        return "a megaladon";
        break;
      case 'piranha':
        return "a swarm of piranhas";
        break;
      case 'galleon':
        return "a Spanish galleon";
      case 'clipper':
        return "a clipper from the future";
        break;
      case 'trireme':
        return "a Greek trireme";
      case 'longboat':
        return "a viking longboat";
        break;
      default:
        return "the white whale";
    }
  }

  //ends the game and shows the player what they accomplished in this game
  function gameOverSequence(score, wave, kills, bossesKilled) {
      player1.sprite.kill();
      game.paused = true;
      //TODO Change the current screen to a GameOver Screen with
      //score, wave, kills and bossesKilled
      var gameOverScreen = this.game.add.sprite(this.width/2, this.height/2, 'gameOver');
      gameOverScreen.anchor.setTo(0.5, 0.5);
      //var gameOverText =  game.add.text(this.width/2 - 90, this.height/4 - 20, 'GAME OVER', { fontSize: '32px', fill: '#000' });
      var scoreText = game.add.text(this.width/2 - 260, this.height/4 + 50, "You collected " + score + " doubloons worth of treasure", { fontSize: '16px', fill: '#000' });
      var waveText = game.add.text(this.width/2 - 260, this.height/4 + 80, "You made it to wave " + wave, { fontSize: '16px', fill: '#000' });
      if (player1.getTotalKills() === 1){
        var killsText = game.add.text(this.width/2 - 260, this.height/4 + 110, "You killed a single enemy", { fontSize: '16px', fill: '#000' });
      } else {
        var killsText = game.add.text(this.width/2 - 260, this.height/4 + 110, "You killed a total of " + player1.getTotalKills() + " enemies", { fontSize: '16px', fill: '#000' });
      }
      var text = game.cache.getText('pirateFacts');
      var factArray = text.split('\n');
      var pirateFact =  factArray[Math.floor(Math.random() * factArray.length)];
      var factText = game.add.text(this.width/2 - 260, this.height/4 + 170, pirateFact, { fontSize: '16px', fill: '#000' });
      var killText = game.add.text(40, 16, '', { fontSize: '16px', fill: '#000' });
      var bossesDefeated;
      var printedKills = new Array();
      var killedBosses = player1.getAllKilledBosses();
      if (killedBosses.length < 1){
        bossesDefeated = "You didn't defeat any bosses this time.";
      } else if (killedBosses.length === storage1.getAllBosses().length){
        bossesDefeated = "You defeated every boss.";
      } else {
        bossesDefeated = "You defeated ";
        var killedBoss;
        for (var i = 0; i < killedBosses.length; i++){
          killedBoss = killedBossText(killedBosses[i]);

          if (printedKills.indexOf(killedBosses[i]) === -1){
          if (i === 0){
            bossesDefeated += "the " + killedBossText(killedBosses[i]);
          } else if (i === killedBosses.length - 1){
          bossesDefeated += "and the " + killedBossText(killedBosses[i]);
          } else {
            bossesDefeated += "the " + killedBossText(killedBosses[i]) + ", ";
          }
          printedKills.push(killedBosses[i]);
          //TODO: implement this line
          //if (bossesDefeated.length > something) bossesDefeated = "You defeated " + killedBosses.length + " bosses";
      }
    }
      }
      var bossText = game.add.text(this.width/2 - 260, this.height/4 + 140, bossesDefeated, { fontSize: '16px', fill: '#000' });
      game.input.onDown.add(newGame, self);
  }

  //refreshes the page
  function newGame(event){
    document.location.reload();
  }


GameState.prototype.render =function() {

}

/*TODO: Long-term goals
 -high score?
*/

//-----------------------------------------------------------------------------

//var game = new Phaser.Game(848, 450, Phaser.AUTO, 'game');
var game = new Phaser.Game(960, 650, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);
