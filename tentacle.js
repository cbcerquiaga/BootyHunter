/// <reference path="phaser.min.js"/>
/*the above line is just to help intellisense to detect auto completes. it has no meaning outside of MS visual studios*/
var tentacle = function(_sprite){
  const MAX_SPEED = 250;
  const TURN_RATE = 12;
  this.sprite = _sprite;
  this.sprite.enablebody = true;
  this.anchor.setTo(0.5, 0.5);
  this.enablePhysics = function () {
      this.sprite.body.maxVelocity.setTo(MAX_SPEED, MAX_SPEED);
      this.sprite.body.collideWorldBounds = false;//lets the ship wrap around the world
      this.sprite.body.bounce.set(0.35);
  }

}

  this.chase = function(player){
    var targetAngle = this.game.math.angleBetween(
        this.x, this.y,
        player.x, player.y);
        // Gradually (this.TURN_RATE) aim the missile towards the target angle
    if (this.rotation !== targetAngle) {
        // Calculate difference between the current angle and targetAngle
        var delta = targetAngle - this.rotation;

        // Keep it in range from -180 to 180 to make the most efficient turns.
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;

        if (delta > 0) {
            // Turn clockwise
            this.angle += this.TURN_RATE;
        } else {
            // Turn counter-clockwise
            this.angle -= this.TURN_RATE;
        }

        // Just set angle to target angle if they are close
        if (Math.abs(delta) < this.game.math.degToRad(this.TURN_RATE)) {
            this.rotation = targetAngle;
        }
    }

    // Calculate velocity vector based on this.rotation and this.SPEED
    this.body.velocity.x = Math.cos(this.rotation) * this.SPEED;
    this.body.velocity.y = Math.sin(this.rotation) * this.SPEED;
  };
  }
