/// <reference path="phaser.min.js"/>
/*the above line is just to help intellisense to detect auto completes. it has no meaning outside of MS visual studios*/

/**
Utility class for accessing global variables more easily in game.js. It would be
better to make this into several classes, but this is easier.
*/
var storage = function (treasureGroup, enemyGroup, tentacleGroup) {
    this.wave = 0; //5 to test bosses, 0 normally
    this.treasures = treasureGroup;
    this.treasures.enableBody = true;
    this.enemies = enemyGroup;
    this.tentacleGroup = tentacleGroup;

    this.nextWave = function(){
      this.wave = this.wave + 1;
    }

    this.getWave = function(){
      return this.wave;
    }

    this.addTreasure = function(treasure){
      this.treasures.add(treasure);
    }

    this.getTreasures = function(){
      return this.treasures;
    }

    this.getEnemies = function(){
      return this.enemies;
    }

    this.addEnemy = function(enemy){
      this.enemies.add(enemy);
    }

    this.changeEnemyGroup = function(group){
      this.enemies = group;
    }

    this.addTentacle = function(tentacle){
      this.tentacleGroup.add(tentacle);
    }

    this.addTentacleGroup = function(group){
      this.tentacles = group;
    }

    this.getTentacleGroup = function(){
      return this.tentacleGroup;
    }

    this.killAllTentacles = function(){
      for (var i = 0; i < this.tentacleGroup.length; i++){
        var tentacle = tentacleGroup[i];
        tentacle.kill();
      }
    }
}
