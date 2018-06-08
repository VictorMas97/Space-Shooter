  function NewEnemy (options)
  {
    return {
      img: enemy1Img,
      imgScale: 0.3,

      sound: null,

      dir: { x: 0, y: 1 },
      position: {x: options.x, y: options.y},
      speed: 200,

      box: {x: options.x, y: options.y},
      boxSize: {x: 110, y: 170},

      movementCadency: 1200, //ms between movement
      lastMovementTime: 0,

      cadency: 500, //ms between shots
      lastShotTime: 0,
      bullets: [],

      score: options.score,

      rightBoundary: 480,
      leftBoundary: 120,

      isDead: false,

      Start: function ()
      {
        this.box.x = this.position.x - 110;
        this.box.y = this.position.y - 172;
      },

      Update: function (deltaTime)
      {
        // Update X Position
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

        //Update when the enemy shots
        if (this.position.y >= 100)
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

        this.position.x += this.dir.x * this.speed * deltaTime;
        this.position.y += this.dir.y * this.speed * deltaTime;

        this.box.x += this.dir.x * this.speed * deltaTime;
        this.box.y += this.dir.y * this.speed * deltaTime;
      },

      Draw: function (ctx)
      {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(Math.PI);
        ctx.scale(this.imgScale, this.imgScale);
        ctx.drawImage(enemy1Img, 0, 0);
        ctx.restore();

        // draw the Rectangle
        //ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
        //ctx.fillRect(this.box.x, this.box.y, 110, 170);
        //ctx.restore();
      },

      Fire: function ()
      {
        var bullet = NewEnemyBullet({x: this.position.x - 57, y: this.position.y});
        bullet.Start();
        this.bullets.push(bullet);
        //console.log(this.bullets.length);
      },

      CheckCollision: function (playerBulletBox)
      {
        if (this.box.x <= playerBulletBox.x &&
            this.box.x + this.boxSize.x >= playerBulletBox.x &&
            this.box.y <= playerBulletBox.y &&
            this.box.y + this.boxSize.y >= playerBulletBox.y)
        {
          return true;
        }
      }
    }
  }
