  function NewEnemy (options)
  {
    return {
      img: enemyImg,
      imgScale: 0.3,

      dir: { x: 0, y: 1 },
      position: {x: options.x, y: options.y},
      speed: 200,

      box: {x: options.x, y: options.y},
      boxSize: {x: 110, y: 170},
      boxOffset: {x: -110, y: -172},

      movementCadency: 1200, //ms between movement
      lastMovementTime: 0,

      startShot: 100,  //position when can shot
      cadency: 500, //ms between shots
      lastShotTime: 0,
      bullets: [],
      bulletOffset: {x: -57, y: 0},

      score: options.score,

      sound: null,

      rightBoundary: 480,
      leftBoundary: 120,

      isDead: false,

      Start: function ()
      {
        this.box.x = this.position.x + this.boxOffset.x;
        this.box.y = this.position.y + this.boxOffset.y;

        this.sound = document.getElementById('sound_explosion_enemy');
      },

      Update: function (deltaTime)
      {
        this.UpdateXPosition();
        this.UpdateWhenTheEnemyShots();
        this.UpdatePosition();
        this.UpdateColliderPosition();
      },

      Draw: function (ctx)
      {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(Math.PI);
        ctx.scale(this.imgScale, this.imgScale);
        ctx.drawImage(this.img, 0, 0);
        ctx.restore();
      },

      Fire: function ()
      {
        var bullet = NewEnemyBullet({x: this.position.x + this.bulletOffset.x, y: this.position.y + this.bulletOffset.y});
        bullet.Start();
        this.bullets.push(bullet);
      },

      UpdateXPosition: function ()
      {
        if((Date.now() - this.lastMovementTime) > this.movementCadency)
        {
          var randomNumberXMovement = Math.floor((Math.random() * 3) - 1);
          this.dir.x = randomNumberXMovement;
          this.lastMovementTime = Date.now();
        }

        if (this.position.x <= this.rightBoundary)
        {
          this.dir.x += 1;
        }

        if (this.position.x >= this.leftBoundary)
        {
          this.dir.x -= 1;
        }
      },

      UpdateWhenTheEnemyShots: function ()
      {
        if (this.position.y >= this.startShot)
        {
          if((Date.now() - this.lastShotTime) > this.cadency)
          {
            var randomNumberCadency = Math.floor((Math.random() * 1000) + 0);
            if((Date.now() - this.lastShotTime) > randomNumberCadency)
            {
              this.Fire();
            }
            this.lastShotTime = Date.now();
          }
        }
      },

      UpdatePosition: function ()
      {
        this.position.x += this.dir.x * this.speed * deltaTime;
        this.position.y += this.dir.y * this.speed * deltaTime;
      },

      UpdateColliderPosition: function ()
      {
        this.box.x += this.dir.x * this.speed * deltaTime;
        this.box.y += this.dir.y * this.speed * deltaTime;
      },

      CheckCollision: function (playerBulletBox)
      {
        return this.box.x <= playerBulletBox.x &&
               this.box.x + this.boxSize.x >= playerBulletBox.x &&
               this.box.y <= playerBulletBox.y &&
               this.box.y + this.boxSize.y >= playerBulletBox.y
      }
    }
  }
