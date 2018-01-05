/// <reference path="phaser.min.js"/>
/*the above line is just to help intellisense to detect auto completes. it has no meaning outside of MS visual studios*/

/**
Stores a map that maps an array of Weapon objects to a specific enemy,
so the weapons can be accessed easily in game.js
*/
var enemyWeapons = function(weaponGroup, ghostWeapon1, ghostWeapon2){
  this.weaponMap = weaponGroup;
  this.ghostWeapon = ghostWeapon1;
  this.ghostWeapon2 = ghostWeapon2;

  //add weapons for the ghost ship boss
  //weapons for the ghost ship

  this.ghostWeapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
  this.ghostWeapon.bulletLifespan = 600;
  this.ghostWeapon.bulletSpeed = 600;
  this.ghostWeapon.fireRate = 10;
  this.ghostWeapon.bulletAngleVariance = 10;
  this.ghostWeapon.bulletCollideWorldBounds = false;
  this.ghostWeapon.bulletWorldWrap = true;
  //second weapon, fires left relative to the ship
  this.ghostWeapon2.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
  this.ghostWeapon2.bulletLifespan = 600;
  this.ghostWeapon2.bulletSpeed = 600;
  this.ghostWeapon2.fireRate = 10;
  this.ghostWeapon2.bulletAngleVariance = 10;
  this.ghostWeapon2.bulletCollideWorldBounds = false;
  this.ghostWeapon2.bulletWorldWrap = true;

  this.addWeapon = function(enemy, weaponArray){
    this.weaponMap[enemy] = weaponArray;
  }

  this.getWeapons = function(enemy){
    return this.weaponMap[enemy];
  }


  this.fireGhostWeapons = function(){
    this.ghostWeapon.fire();
    this.ghostWeapon2.fire();
  }

  this.setGhostWeaponAngles = function(angle){
    this.ghostWeapon.angle = angle + 90;
    this.ghostWeapon2.angle = angle - 90;
    console.log(this.ghostWeapon.angle + " : " + this.ghostWeapon2.angle + " from parameter " + angle);
  }

  this.getGhostWeaponAngles = function(){
    return (this.ghostWeapon.angle + " : " + this.ghostWeapon2.angle);
  }

  this.getGhostWeapon = function(value){
    if (value === 2){
      return this.ghostWeapon2;
    } else {
      return this.ghostWeapon;
    }
  }

  this.trackGhostSprite = function(ghostShip){
    this.ghostWeapon.trackSprite(ghostShip, 0, 0, false);
    this.ghostWeapon2.trackSprite(ghostShip, 0, 0, false);//TODO: shift over to actual position of gun
  }

}
