/// <reference path="phaser.min.js"/>
/*the above line is just to help intellisense to detect auto completes. it has no meaning outside of MS visual studios*/
var ship = function (_sprite) {
    const MAX_SPEED = 850;
    this.health = 6;
    this.oldHealth = 6;
    this.kills = 0;
    this.score = 0;
    this.isInvincible = false;
    this.invincibilityTime = 0;
    this.restoreOldHealthTime = 0;
    this.hasPirate = false; //true for testing
    this.sprite = _sprite;
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.angle = -90;
    this.sprite.enablebody = true;
    this.enablePhysics = function () {
        this.sprite.body.maxVelocity.setTo(MAX_SPEED, MAX_SPEED);
        this.sprite.body.collideWorldBounds = false;//lets the ship wrap around the world
        this.sprite.body.bounce.set(0.35);
    }

    this.getKills = function(){
      return this.kills;
    }

    this.addKill = function(){
      this.kills++;
    }

    this.resetKills = function(){
      this.kills = 0;
    }

    this.getScore = function(){
      return this.score;
    }

    this.addScore = function(pickup){
      this.score = this.score + pickup;
    }

    this.addHealth = function(value){
      if (this.health != "invincible"){
      console.log("old health: " + this.health);
      if ((this.health + value) >= 6){
        this.health = 6;
      } else {
      this.health += value;
      }
      console.log("new health: " + this.health);
      }
    }

    this.getHealth = function(){
      return this.health;
    }

    this.damage = function(){
        this.health--;
    }

    this.setHealth = function(value){
      if (value === "invincible"){
        this.oldHealth = this.health;
      }
      this.health = value;
    }

    this.getOldHealth = function(){
      return this.oldHealth;
    }

    this.restoreOldHealth = function(){
      this.health = this.oldHealth;
    }

    this.addPirate = function(){
      this.hasPirate = true;
    }

    this.removePirate = function(){
      this.hasPirate = false;
    }

    this.getPirate = function(){
      return this.hasPirate;
    }

    this.getIsInvincible = function(){
      return this.isInvincible;
    }

    this.toggleInvincible = function() {
      this.isInvincible = !this.isInvincible;
    }

    this.getInvincibilityTime = function(){
      return this.invincibilityTime;
    }

    this.setInvincibilityTime = function(value){
      this.invincibilityTime = value;
    }

    this.lessTime = function(){
      this.invincibilityTime--;
    }

    this.setRestoreOldHealthTime = function(value){
      this.restoreOldHealthTime = value;
    }

    this.getRestoreOldHealthTime = function(){
      return this.restoreOldHealthTime;
    }

    this.lessRestoreOldHealthTime = function(){
      this.restoreOldHealthTime--;
    }
}
