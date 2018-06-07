var player =
{
  img: playerImg,
  imgScale: 0.5,

  //box: {x: 0.32, y: 0.57},

  position: {x: 0, y: 0},
  speed: 200,

  cadency: 500, //ms between  shots
  lastShotTime: 0,
  bullets: [],

  score: 0,

  moveRight: false,
  moveLeft: false,
  moveUp: false,
  moveDown: false,
  fire: false,

  rightBoundary: 460,
  leftBoundary: 40,
  topBoundary: 70,
  bottomBoundary: 720,


  // physicsInfo:
  // {
  //     'density': 1,
  //     'fixedRotation' : true,
  //     'user_data': player,
  //     'type': b2Body.b2_kinematic,
  //     'restitution': 0.0
  // },
  //
  // body: null,

  Start: function ()
  {
    this.position.x = canvas.width / 2;
    this.position.y = canvas.height - 80;

    //this.body = CreateBox(world, 0, 0, this.box.x, this.box.y, this.physicsInfo);
    //this.body.SetUserData(this);
  },

  Update: function (deltaTime)
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

    if (this.fire)
    {
      if((Date.now() - this.lastShotTime) > this.cadency)
      {
        this.Fire();
        this.lastShotTime = Date.now();
      }

      this.fire = false;
    }

    this.position.x += dir.x * this.speed * deltaTime;
    this.position.y += dir.y * this.speed * deltaTime;

    // update the box position
    //this.body.GetPosition().x = this.position.x / scale;
    //this.body.GetPosition().y = (-this.position.y / scale) + 7.99;
  },

  Draw: function (ctx)
  {
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.scale(this.imgScale, this.imgScale);
      ctx.drawImage(playerImg, -playerImg.width / 2, -playerImg.height / 2);
      ctx.restore();

      // draw the Rectangle
      ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
      ctx.fillRect(this.position.x - 35, this.position.y - 55, 70, 110);
      ctx.restore();
  },

  Fire: function ()
  {
    var bullet = NewBullet({x: this.position.x - 2, y: this.position.y - 60});
    bullet.Start();
    this.bullets.push(bullet);
    console.log(this.bullets.length);
  }

/*
  function CheckCollisionRect (point, rectangle)
  {
  return point.x >= (rectangle.coord.x) &&
  point.x <= (rectangle.coord.x + rectangle.width) &&
  point.y >= (rectangle.coord.y) &&
  point.y <= (rectangle.coord.y + rectangle.height);
  }
  */
}
