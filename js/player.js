var player =
{
  img: playerImg,
  imgScale: 0.5,

  position: {x: 0, y: 0},
  speed: 200,

  box: {x: 0, y: 0},
  boxSize: {x: 70, y: 110},
  boxOffset: {x: -35, y: -55},

  cadency: 500, //ms between  shots
  lastShotTime: 0,
  bullets: [],
  bulletOffset: {x: -2, y: -60},

  score: 0,

  sound: null,

  moveRight: false,
  moveLeft: false,
  moveUp: false,
  moveDown: false,
  fire: false,

  rightBoundary: 460,
  leftBoundary: 40,
  topBoundary: 70,
  bottomBoundary: 720,

  isDead: false,

  Start: function ()
  {
    this.position.x = canvas.width / 2;
    this.position.y = canvas.height - 80;

    this.box.x = this.position.x + this.boxOffset.x;
    this.box.y = this.position.y + this.boxOffset.y;

    this.sound = document.getElementById('sound_explosion_player');
  },

  Update: function (deltaTime)
  {
    this.UpdateInput();

    if (this.fire)
    {
      this.UpdateFire();
      this.fire = false;
    }
  },

  Draw: function (ctx)
  {
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.scale(this.imgScale, this.imgScale);
      ctx.drawImage(playerImg, -playerImg.width / 2, -playerImg.height / 2);
      ctx.restore();
  },

  UpdateInput: function ()
  {
    var dir = { x: 0, y: 0 };

    if (this.moveRight)
    {
      if (this.position.x <= this.rightBoundary)
      {
        dir.x += 1;
      }

      this.moveRight = false;
    }

    if (this.moveLeft)
    {
      if (this.position.x >= this.leftBoundary)
      {
        dir.x -= 1;
      }

      this.moveLeft = false;
    }

    if (this.moveUp)
    {
      if (this.position.y >= this.topBoundary)
      {
        dir.y -= 1;
      }

      this.moveUp = false;
    }

    if (this.moveDown)
    {
      if (this.position.y <= this.bottomBoundary)
      {
        dir.y += 1;
      }

      this.moveDown = false;
    }

    this.UpdatePosition(dir);
    this.UpdateBoxPosition(dir);
  },

  UpdatePosition: function (direction)
  {
    this.position.x += direction.x * this.speed * deltaTime;
    this.position.y += direction.y * this.speed * deltaTime;
  },

  UpdateBoxPosition: function (direction)
  {
    this.box.x += direction.x * this.speed * deltaTime;
    this.box.y += direction.y * this.speed * deltaTime;
  },

  UpdateFire: function ()
  {
    if((Date.now() - this.lastShotTime) > this.cadency)
    {
      this.Fire();
      this.lastShotTime = Date.now();
    }
  },

  Fire: function ()
  {
    var bullet = NewBullet({x: this.position.x + this.bulletOffset.x, y: this.position.y + this.bulletOffset.y});
    bullet.Start();
    this.bullets.push(bullet);
  },

  CheckCollision: function (enemyBulletBox)
  {
    return this.box.x <= enemyBulletBox.x &&
           this.box.x + this.boxSize.x >= enemyBulletBox.x &&
           this.box.y <= enemyBulletBox.y &&
           this.box.y + this.boxSize.y >= enemyBulletBox.y
  }
}
