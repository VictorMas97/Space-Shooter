
function NewPowerUp (options)
{
    return {
      imgScale: 0.5,

      sound: null,

      dir: { x: 0, y: 1 },
      position: {x: options.x, y: options.y},
      speed: 100,

      box: {x: options.x, y: options.y},

      score: options.score,

      animation: {
          img: powerUpImg,
          timePerFrame: 1/24,
          currentFrametime: 0,
          frameWidth: 100,
          frameHeight: 100,
          actualX: 0,

          Update: function (deltaTime)
          {
            this.currentFrametime += deltaTime;
            if (this.currentFrametime >= this.timePerFrame)
            {
                // update the animation frame
                this.actualX += this.frameWidth;
                if (this.actualX > 999)
                    this.actualX = 0;
                this.currentFrametime = 0.0;
            }
          },

          Draw: function (ctx)
          {
            ctx.drawImage(this.img, this.actualX, 0,
                          this.frameWidth, this.frameHeight,
                          -this.frameWidth / 2, -this.frameHeight / 2,
                          this.frameWidth, this.frameHeight);
          }
      },

    Start: function ()
    {
      this.box.x = this.position.x - 25;
      this.box.y = this.position.y - 25;
    },

    Update: function (deltaTime)
    {
      this.position.y += this.dir.y * this.speed * deltaTime;
      this.box.y += this.dir.y * this.speed * deltaTime;

      this.animation.Update(deltaTime);

      player.CheckCollision(this.box)
    },

    Draw: function (ctx)
    {
      //var bodyPosition = this.body.GetPosition();
      //var posX = bodyPosition.x * scale;
      //var posY = Math.abs((bodyPosition.y * scale) - ctx.canvas.height);

      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.scale(this.imgScale, this.imgScale);
      this.animation.Draw(ctx);
      ctx.restore();

      // draw the Rectangle
      // ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
      // ctx.fillRect(this.box.x, this.box.y, 50, 50);
      // ctx.restore();
    }
  }
}
