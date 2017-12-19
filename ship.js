/// <reference path="phaser.min.js"/>
/*the above line is just to help intellisense to detect auto completes. it has no meaning outside of MS visual studios*/
var ship = function (_sprite) {
    const MAX_SPEED = 850;
    this.health = 6;
    this.sprite = _sprite;
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.angle = -90;
    this.sprite.enablebody = true;
    this.enablePhysics = function () {
        this.sprite.body.maxVelocity.setTo(MAX_SPEED, MAX_SPEED);
        this.sprite.body.collideWorldBounds = false;//lets the ship wrap around the world
        this.sprite.body.bounce.set(0.35);
    }
}
