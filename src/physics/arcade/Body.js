/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Physics Body is linked to a single Sprite. All physics operations should be performed against the body rather than
* the Sprite itself. For example you can set the velocity, acceleration, bounce values etc all on the Body.
*
* @class Phaser.Physics.Arcade.Body
* @classdesc Arcade Physics Body Constructor
* @constructor
* @param {Phaser.Sprite} sprite - The Sprite object this physics body belongs to.
*/
Phaser.Physics.Arcade.Body = function (sprite) {

    /**
    * @property {Phaser.Sprite} sprite - Reference to the parent Sprite.
    */
    this.sprite = sprite;

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = sprite.game;

    /**
    * @property {Phaser.Point} offset - The offset of the Physics Body from the Sprite x/y position.
    */
    this.offset = new Phaser.Point();

    /**
    * @property {number} x - The x position of the physics body.
    * @readonly
    */
    this.x = sprite.x;

    /**
    * @property {number} y - The y position of the physics body.
    * @readonly
    */
    this.y = sprite.y;

    /**
    * @property {number} preX - The previous x position of the physics body.
    * @readonly
    */
    this.preX = sprite.x;

    /**
    * @property {number} preY - The previous y position of the physics body.
    * @readonly
    */
    this.preY = sprite.y;

    /**
    * @property {number} preRotation - The previous rotation of the physics body.
    * @readonly
    */
    this.preRotation = sprite.angle;

    /**
    * @property {number} screenX - The x position of the physics body translated to screen space.
    * @readonly
    */
    this.screenX = sprite.x;

    /**
    * @property {number} screenY - The y position of the physics body translated to screen space.
    * @readonly
    */
    this.screenY = sprite.y;

    /**
    * @property {number} sourceWidth - The un-scaled original size.
    * @readonly
    */
    this.sourceWidth = sprite.currentFrame.sourceSizeW;

    /**
    * @property {number} sourceHeight - The un-scaled original size.
    * @readonly
    */
    this.sourceHeight = sprite.currentFrame.sourceSizeH;

    /**
    * @property {number} width - The calculated width of the physics body.
    */
    this.width = sprite.currentFrame.sourceSizeW;

    /**
    * @property .numInternal ID cache
    */
    this.height = sprite.currentFrame.sourceSizeH;

    /**
    * @property {number} halfWidth - The calculated width / 2 of the physics body.
    */
    this.halfWidth = Math.floor(sprite.currentFrame.sourceSizeW / 2);

    /**
    * @property {number} halfHeight - The calculated height / 2 of the physics body.
    */
    this.halfHeight = Math.floor(sprite.currentFrame.sourceSizeH / 2);

    /**
    * @property {Phaser.Point} center - The center coordinate of the Physics Body.
    */
    this.center = new Phaser.Point(this.x + this.halfWidth, this.y + this.halfHeight);

    /**
    * @property {Phaser.Point} motionVelocity - The data from the updateMotion function.
    */
    this.motionVelocity = new Phaser.Point();

    /**
    * @property {Phaser.Point} velocity - The velocity in pixels per second sq. of the Body.
    */
    this.velocity = new Phaser.Point();

    /**
    * @property {Phaser.Point} prevVelocity - The velocity in pixels per second sq. of the Body.
    */
    this.prevVelocity = new Phaser.Point();

    /**
    * @property {Phaser.Point} acceleration - The velocity in pixels per second sq. of the Body.
    */
    this.acceleration = new Phaser.Point();

    /**
    * @property {number} speed - The speed in pixels per second sq. of the Body.
    */
    this.speed = 0;

    /**
    * @property {number} angle - The angle of the Body in radians.
    */
    this.angle = 0;

    /**
    * @property {number} minBounceVelocity - The minimum bounce velocity (could just be the bounce value?).
    */
    this.minBounceVelocity = 0.5;

    this._debug = 0;

    /**
    * @property {Phaser.Point} gravity - The gravity applied to the motion of the Body.
    */
    this.gravity = new Phaser.Point();

    /**
    * @property {Phaser.Point} bounce - The elasticitiy of the Body when colliding. bounce.x/y = 1 means full rebound, bounce.x/y = 0.5 means 50% rebound velocity.
    */
    this.bounce = new Phaser.Point();

    /**
    * @property {Phaser.Point} maxVelocity - The maximum velocity in pixels per second sq. that the Body can reach.
    * @default
    */
    this.maxVelocity = new Phaser.Point(10000, 10000);

    /**
    * @property {number} angularVelocity - The angular velocity in pixels per second sq. of the Body.
    * @default
    */
    this.angularVelocity = 0;

    /**
    * @property {number} angularAcceleration - The angular acceleration in pixels per second sq. of the Body.
    * @default
    */
    this.angularAcceleration = 0;

    /**
    * @property {number} angularDrag - The angular drag applied to the rotation of the Body.
    * @default
    */
    this.angularDrag = 0;

    /**
    * @property {number} maxAngular - The maximum angular velocity in pixels per second sq. that the Body can reach.
    * @default
    */
    this.maxAngular = 1000;

    /**
    * @property {number} mass - The mass of the Body.
    * @default
    */
    this.mass = 1;

    /**
    * Set the allowCollision properties to control which directions collision is processed for this Body.
    * For example allowCollision.up = false means it won't collide when the collision happened while moving up.
    * @property {object} allowCollision - An object containing allowed collision.
    */
    this.allowCollision = { none: false, any: true, up: true, down: true, left: true, right: true };

    /**
    * This object is populated with boolean values when the Body collides with another.
    * touching.up = true means the collision happened to the top of this Body for example.
    * @property {object} touching - An object containing touching results.
    */
    this.touching = { none: true, up: false, down: false, left: false, right: false };

    /**
    * This object is populated with previous touching values from the bodies previous collision.
    * @property {object} wasTouching - An object containing previous touching results.
    */
    this.wasTouching = { none: true, up: false, down: false, left: false, right: false };

    /**
    * @property {number} facing - A const reference to the direction the Body is traveling or facing.
    * @default
    */
    this.facing = Phaser.NONE;

    /**
    * @property {boolean} immovable - An immovable Body will not receive any impacts or exchanges of velocity from other bodies.
    * @default
    */
    this.immovable = false;

    /**
    * @property {boolean} moves - Set to true to allow the Physics system to move this Body, other false to move it manually.
    * @default
    */
    this.moves = true;

    /**
    * @property {number} rotation - The amount the parent Sprite is rotated. Note: You cannot rotate an AABB.
    * @default
    */
    this.rotation = 0;

    /**
    * @property {boolean} allowRotation - Allow angular rotation? This will cause the Sprite to be rotated via angularVelocity, etc. Note that the AABB remains un-rotated.
    * @default
    */
    this.allowRotation = true;

    /**
    * @property {boolean} allowGravity - Allow this Body to be influenced by the global Gravity value? Note: It will always be influenced by the local gravity value.
    * @default
    */
    this.allowGravity = true;

    /**
    * This flag allows you to disable the custom x separation that takes place by Physics.Arcade.separate.
    * Used in combination with your own collision processHandler you can create whatever type of collision response you need.
    * @property {boolean} customSeparateX - Use a custom separation system or the built-in one?
    * @default
    */
    this.customSeparateX = false;

    /**
    * This flag allows you to disable the custom y separation that takes place by Physics.Arcade.separate.
    * Used in combination with your own collision processHandler you can create whatever type of collision response you need.
    * @property {boolean} customSeparateY - Use a custom separation system or the built-in one?
    * @default
    */
    this.customSeparateY = false;

    /**
    * When this body collides with another, the amount of overlap is stored here.
    * @property {number} overlapX - The amount of horizontal overlap during the collision.
    */
    this.overlapX = 0;

    /**
    * When this body collides with another, the amount of overlap is stored here.
    * @property {number} overlapY - The amount of vertical overlap during the collision.
    */
    this.overlapY = 0;

    /**
    * @property {number} friction - The amount of friction this body experiences during motion.
    * @default
    */
    this.friction = 0;

    /**
    * If a body is overlapping with another body, but neither of them are moving (maybe they spawned on-top of each other?) this is set to true.
    * @property {boolean} embedded - Body embed value.
    */
    this.embedded = false;

    /**
    * A Body can be set to collide against the World bounds automatically and rebound back into the World if this is set to true. Otherwise it will leave the World.
    * @property {boolean} collideWorldBounds - Should the Body collide with the World bounds?
    */
    this.collideWorldBounds = false;

    /**
    * This object is populated with boolean values when the Body collides with the World bounds or a Tile.
    * For example if blocked.up is true then the Body cannot move up.
    * @property {object} blocked - An object containing on which faces this Body is blocked from moving, if any.
    */
    this.blocked = { up: false, down: false, left: false, right: false };

    /**
    * @property {number} _dx - Internal cache var.
    * @private
    */
    this._dx = 0;

    /**
    * @property {number} _dy - Internal cache var.
    * @private
    */
    this._dy = 0;

    /**
    * @property {number} _sx - Internal cache var.
    * @private
    */
    this._sx = sprite.scale.x;

    /**
    * @property {number} _sy - Internal cache var.
    * @private
    */
    this._sy = sprite.scale.y;

};

Phaser.Physics.Arcade.Body.prototype = {

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Arcade#updateBounds
    * @protected
    */
    updateBounds: function (centerX, centerY, scaleX, scaleY) {

        if (scaleX != this._sx || scaleY != this._sy)
        {
            this.width = this.sourceWidth * scaleX;
            this.height = this.sourceHeight * scaleY;
            this.halfWidth = Math.floor(this.width / 2);
            this.halfHeight = Math.floor(this.height / 2);
            this._sx = scaleX;
            this._sy = scaleY;
            this.center.setTo(this.x + this.halfWidth, this.y + this.halfHeight);
        }

    },

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Arcade#preUpdate
    * @protected
    */
    preUpdate: function () {

        //  Store and reset collision flags
        this.wasTouching.none = this.touching.none;
        this.wasTouching.up = this.touching.up;
        this.wasTouching.down = this.touching.down;
        this.wasTouching.left = this.touching.left;
        this.wasTouching.right = this.touching.right;

        this.touching.none = true;
        this.touching.up = false;
        this.touching.down = false;
        this.touching.left = false;
        this.touching.right = false;

        this.embedded = false;

        this.screenX = (this.sprite.worldTransform[2] - (this.sprite.anchor.x * this.width)) + this.offset.x;
        this.screenY = (this.sprite.worldTransform[5] - (this.sprite.anchor.y * this.height)) + this.offset.y;

        this.preX = (this.sprite.world.x - (this.sprite.anchor.x * this.width)) + this.offset.x;
        this.preY = (this.sprite.world.y - (this.sprite.anchor.y * this.height)) + this.offset.y;
        this.preRotation = this.sprite.angle;

        // if (this.canSleep && this.sleeping && (this.velocity.equals(this.prevVelocity) === false || this.acceleration.isZero() === false))
        // {
        //     this.sleeping = false;
        //     this._sleepTimer = 0;
        // }

        this.x = this.preX;
        this.y = this.preY;
        this.rotation = this.preRotation;

        this.speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        this.angle = Math.atan2(this.velocity.y, this.velocity.x);

        this.blocked.up = false;
        this.blocked.down = false;
        this.blocked.left = false;
        this.blocked.right = false;

        this._debug++;

        if (this.moves)
        {
            if (this.collideWorldBounds)
            {
                this.checkWorldBounds();
            }

            //  Apply world gravity, acceleration + rotation
            this.game.physics.updateMotion(this);
            
            this.applyMotion();

            // if (this.canSleep)
            // {
            //     if (!this.sleeping)
            //     {
            //         if (this.velocity.x >= this.sleepMin.x && this.velocity.x <= this.sleepMax.x && this.velocity.y >= this.sleepMin.y && this.velocity.y <= this.sleepMax.y)
            //         {
            //             if (this._sleepTimer >= this.sleepDuration)
            //             {
            //                 this.sleeping = true;
            //             }
            //             else
            //             {
            //                 this._sleepTimer += this.game.time.elapsed;
            //                 this.applyMotion();
            //             }
            //         }
            //         else
            //         {
            //             this.applyMotion();
            //         }
            //     }
            // }
            // else
            // {
            //     this.applyMotion();
            // }
        }

        this.prevVelocity.copyFrom(this.velocity);

    },

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Arcade#applyMotion
    * @protected
    */
    applyMotion: function () {

        if (this.friction > 0 && this.acceleration.isZero())
        {
            if (this.speed > this.friction)
            {
                this.speed -= this.friction;
            }
            else
            {
                this.speed = 0;
            }

            this.velocity.x = Math.cos(this.angle) * this.speed;
            this.velocity.y = Math.sin(this.angle) * this.speed;
        }

        //  overlapX/Y values at this point will be penetration into the bounds and DELTA WILL BE ZERO
        if (this.blocked.left)
        {
            //  Separate
            this.x += this.overlapX;
            this.preX = this.x; // because we don't want any delta from a separation

            //  Reflect?
            if (this.velocity.x > this.minBounceVelocity && this.bounce.x !== 0)
            {
                this.x += this.game.time.physicsElapsed * (this.velocity.x + this.motionVelocity.x / 2);
                this.velocity.x += this.motionVelocity.x;
                this.velocity.x *= -this.bounce.x;
                // console.log(this._debug, 'blocked down + r', oy, 'v', this.velocity.y, 'mv', this.motionVelocity.y, 'd', this.deltaY());
            }
            else
            {
                this.velocity.x = 0;
                this.motionVelocity.x = 0;
            }
        }
        else if (this.blocked.right)
        {
            //  Separate
            this.x -= this.overlapX;
            this.preX = this.x; // because we don't want any delta from a separation

            //  Reflect?
            if (this.velocity.y < -this.minBounceVelocity && this.bounce.y !== 0)
            {
                this.x -= this.game.time.physicsElapsed * (this.velocity.x + this.motionVelocity.x / 2);
                this.velocity.x += this.motionVelocity.x;
                this.velocity.x *= -this.bounce.x;
                // console.log(this._debug, 'blocked up + r', oy, 'v', this.velocity.y, 'mv', this.motionVelocity.y, 'd', this.deltaY());
            }
            else
            {
                this.velocity.x = 0;
                this.motionVelocity.x = 0;
            }
        }
        else
        {
            this.x += this.game.time.physicsElapsed * (this.velocity.x + this.motionVelocity.x / 2);
            this.velocity.x += this.motionVelocity.x;
        }

        //  overlapX/Y values at this point will be penetration into the bounds and DELTA WILL BE ZERO
        if (this.blocked.up)
        {
            //  Separate
            this.y += this.overlapY;

            // console.log(this._debug, 'blocked up', this.overlapY, 'v', this.velocity.y, 'min', this.minBounceVelocity, 'mv', this.motionVelocity.y, 'd', this.deltaY(), 'newy', this.y);

            //  Reflect? It's the velocity AFTER the bounce we need to test! And only if there is a bounce value
            if (this.bounce.y !== 0 && this.velocity.y != 0)
            {
                this.velocity.y *= -this.bounce.y;

                this._dy = this.game.time.physicsElapsed * (this.velocity.y + this.motionVelocity.y / 2);

                if (this._dy > this.minBounceVelocity)
                {
                    this.y += this._dy;
                    this.velocity.y += this.motionVelocity.y;
                    // console.log(this._debug, 'rb', this._dy, 'delta', this.deltaY(), 'newy', this.y);
                }
                else
                {
                    //  Kill it dead :)
                    this.preY = this.y; // because we don't want any delta from a separation
                    this.velocity.y = 0;
                    this.motionVelocity.y = 0;
                    // console.log(this._debug, 'void1', this.velocity.y, 'delta', this.deltaY());
                }
            }
            else
            {
                //  Kill it dead :)
                this.preY = this.y; // because we don't want any delta from a separation
                this.velocity.y = 0;
                this.motionVelocity.y = 0;
                // console.log(this._debug, 'void2', this.velocity.y, 'delta', this.deltaY());
            }
        }
        else if (this.blocked.down)
        {
            //  Separate
            this.y -= this.overlapY;

            // console.log(this._debug, 'blocked down', this.overlapY, 'v', this.velocity.y, 'min', this.minBounceVelocity, 'mv', this.motionVelocity.y, 'd', this.deltaY(), 'newy', this.y);

            //  Reflect? It's the velocity AFTER the bounce we need to test! And only if there is a bounce value
            if (this.bounce.y !== 0 && this.velocity.y != 0)
            {
                this.velocity.y *= -this.bounce.y;

                this._dy = this.game.time.physicsElapsed * (this.velocity.y + this.motionVelocity.y / 2);

                if (this._dy < -this.minBounceVelocity)
                {
                    this.y += this._dy;
                    this.velocity.y += this.motionVelocity.y;
                    // console.log(this._debug, 'rb', this._dy, 'delta', this.deltaY(), 'newy', this.y);
                }
                else
                {
                    //  Kill it dead :)
                    this.preY = this.y; // because we don't want any delta from a separation
                    this.velocity.y = 0;
                    this.motionVelocity.y = 0;
                    // console.log(this._debug, 'void1', this.velocity.y, 'delta', this.deltaY());
                }
            }
            else
            {
                //  Kill it dead :)
                this.preY = this.y; // because we don't want any delta from a separation
                this.velocity.y = 0;
                this.motionVelocity.y = 0;
                // console.log(this._debug, 'void2', this.velocity.y, 'delta', this.deltaY());
            }
        }
        else
        {
            this.y += this.game.time.physicsElapsed * (this.velocity.y + this.motionVelocity.y / 2);
            this.velocity.y += this.motionVelocity.y;
        }

        if (this.velocity.x > this.maxVelocity.x)
        {
            this.velocity.x = this.maxVelocity.x;
        }
        else if (this.velocity.x < -this.maxVelocity.x)
        {
            this.velocity.x = -this.maxVelocity.x;
        }

        if (this.velocity.y > this.maxVelocity.y)
        {
            this.velocity.y = this.maxVelocity.y;
        }
        else if (this.velocity.y < -this.maxVelocity.y)
        {
            this.velocity.y = -this.maxVelocity.y;
        }

    },

    /**
    * Internal method. This is called directly before the sprites are sent to the renderer.
    *
    * @method Phaser.Physics.Arcade#postUpdate
    * @protected
    */
    postUpdate: function () {

        if (this.moves)
        {
            if (this.deltaX() < 0)
            {
                this.facing = Phaser.LEFT;
                this.sprite.x += this.deltaX();
            }
            else if (this.deltaX() > 0)
            {
                this.facing = Phaser.RIGHT;
                this.sprite.x += this.deltaX();
            }

            if (this.deltaY() < 0)
            {
                this.facing = Phaser.UP;
                this.sprite.y += this.deltaY();
                // console.log(this._debug, 'post up', this.deltaY(), this.sprite.y);
            }
            else if (this.deltaY() > 0)
            {
                this.facing = Phaser.DOWN;
                this.sprite.y += this.deltaY();
                // console.log(this._debug, 'post down', this.deltaY(), this.sprite.y);
            }

            this.center.setTo(this.x + this.halfWidth, this.y + this.halfHeight);

            if (this.allowRotation)
            {
                this.sprite.angle += this.deltaZ();
            }
        }

    },

    /**
    * Internal method used to check the Body against the World Bounds.
    *
    * @method Phaser.Physics.Arcade#checkWorldBounds
    * @protected
    */
    checkWorldBounds: function () {

        if (this.x < this.game.world.bounds.x)
        {
            this.overlapX = this.game.world.bounds.x - this.x;
            this.blocked.left = true;
        }
        else if (this.right > this.game.world.bounds.right)
        {
            this.overlapX = this.right - this.game.world.bounds.right;
            this.blocked.right = true;
        }

        if (this.y < this.game.world.bounds.y)
        {
            this.overlapY = this.game.world.bounds.y - this.y;
            this.blocked.up = true;
            // console.log(this._debug, 'cw', this.overlapY, this.y, this.height, this.bottom, this.game.world.bounds.bottom);
        }
        else if (this.bottom > this.game.world.bounds.bottom)
        {
            this.overlapY = this.bottom - this.game.world.bounds.bottom;
            this.blocked.down = true;
            // console.log(this._debug, 'cw', this.overlapY, this.y, this.height, this.bottom, this.game.world.bounds.bottom);
        }

    },

    /**
    * You can modify the size of the physics Body to be any dimension you need.
    * So it could be smaller or larger than the parent Sprite. You can also control the x and y offset, which
    * is the position of the Body relative to the top-left of the Sprite.
    *
    * @method Phaser.Physics.Arcade#setSize
    * @param {number} width - The width of the Body.
    * @param {number} height - The height of the Body.
    * @param {number} offsetX - The X offset of the Body from the Sprite position.
    * @param {number} offsetY - The Y offset of the Body from the Sprite position.
    */
    setSize: function (width, height, offsetX, offsetY) {

        offsetX = offsetX || this.offset.x;
        offsetY = offsetY || this.offset.y;

        this.sourceWidth = width;
        this.sourceHeight = height;
        this.width = this.sourceWidth * this._sx;
        this.height = this.sourceHeight * this._sy;
        this.halfWidth = Math.floor(this.width / 2);
        this.halfHeight = Math.floor(this.height / 2);
        this.offset.setTo(offsetX, offsetY);

        this.center.setTo(this.x + this.halfWidth, this.y + this.halfHeight);

    },

    /**
    * Resets all Body values (velocity, acceleration, rotation, etc)
    *
    * @method Phaser.Physics.Arcade#reset
    */
    reset: function () {

        this.velocity.setTo(0, 0);
        this.acceleration.setTo(0, 0);

        this.angularVelocity = 0;
        this.angularAcceleration = 0;
        this.preX = (this.sprite.world.x - (this.sprite.anchor.x * this.width)) + this.offset.x;
        this.preY = (this.sprite.world.y - (this.sprite.anchor.y * this.height)) + this.offset.y;
        this.preRotation = this.sprite.angle;

        this.x = this.preX;
        this.y = this.preY;
        this.rotation = this.preRotation;
        
        this.center.setTo(this.x + this.halfWidth, this.y + this.halfHeight);

    },

    /**
    * Returns the absolute delta x value.
    *
    * @method Phaser.Physics.Arcade.Body#deltaAbsX
    * @return {number} The absolute delta value.
    */
    deltaAbsX: function () {
        return (this.deltaX() > 0 ? this.deltaX() : -this.deltaX());
    },

    /**
    * Returns the absolute delta y value.
    *
    * @method Phaser.Physics.Arcade.Body#deltaAbsY
    * @return {number} The absolute delta value.
    */
    deltaAbsY: function () {
        return (this.deltaY() > 0 ? this.deltaY() : -this.deltaY());
    },

    /**
    * Returns the delta x value. The difference between Body.x now and in the previous step.
    *
    * @method Phaser.Physics.Arcade.Body#deltaX
    * @return {number} The delta value. Positive if the motion was to the right, negative if to the left.
    */
    deltaX: function () {
        return this.x - this.preX;
    },

    /**
    * Returns the delta y value. The difference between Body.y now and in the previous step.
    *
    * @method Phaser.Physics.Arcade.Body#deltaY
    * @return {number} The delta value. Positive if the motion was downwards, negative if upwards.
    */
    deltaY: function () {
        return this.y - this.preY;
    },

    deltaZ: function () {
        return this.rotation - this.preRotation;
    }

};

Phaser.Physics.Arcade.Body.prototype.constructor = Phaser.Physics.Arcade.Body;

/**
* @name Phaser.Physics.Arcade.Body#bottom
* @property {number} bottom - The bottom value of this Body (same as Body.y + Body.height)
*/
Object.defineProperty(Phaser.Physics.Arcade.Body.prototype, "bottom", {
    
    /**
    * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
    * @method bottom
    * @return {number}
    */
    get: function () {
        // return Math.floor(this.y + this.height);
        return this.y + this.height;
    },

    /**
    * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
    * @method bottom
    * @param {number} value
    */
    set: function (value) {

        if (value <= this.y)
        {
            this.height = 0;
        }
        else
        {
            this.height = (this.y - value);
        }
        
    }

});

/**
* @name Phaser.Physics.Arcade.Body#right
* @property {number} right - The right value of this Body (same as Body.x + Body.width)
*/
Object.defineProperty(Phaser.Physics.Arcade.Body.prototype, "right", {
    
    /**
    * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties.
    * However it does affect the width property.
    * @method right
    * @return {number}
    */
    get: function () {
        // return Math.floor(this.x + this.width);
        return this.x + this.width;
    },

    /**
    * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties.
    * However it does affect the width property.
    * @method right
    * @param {number} value
    */
    set: function (value) {

        if (value <= this.x)
        {
            this.width = 0;
        }
        else
        {
            this.width = this.x + value;
        }

    }

});
