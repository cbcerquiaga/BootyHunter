/// <reference path="phaser.min.js"/>
/*the above line is just to help intellisense to detect auto completes. it has no meaning outside of MS visual studios*/

/**
Stores a map that maps an array of Weapon objects to a specific enemy,
so the weapons can be accessed easily in game.js
*/
var enemyWeapons = function(weaponGroup){
  this.weaponMap = weaponGroup;

  this.addWeapon = function(enemy, weaponArray){
    this.weaponMap[enemy] = weaponArray;
  }

  this.getWeapons = function(enemy){
    return this.weaponMap[enemy];
  }


}
