
function NewPowerUp (options)
{
    return {
      imgScale: 0.5,

      sound: null,

      dir: { x: 0, y: 1 },
      position: {x: options.x, y: options.y},
      speed: 100,

      box: {x: options.x, y: options.y},
      boxSize: {x: 50, y: 50},
      boxOffset: {x: -25, y: -25},

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
      this.box.x = this.position.x + this.boxOffset.x;
      this.box.y = this.position.y + this.boxOffset.y;
    },

    Update: function (deltaTime)
    {
      this.UpdatePositionAndBox();
      this.animation.Update(deltaTime);
    },

    Draw: function (ctx)
    {
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.scale(this.imgScale, this.imgScale);
      this.animation.Draw(ctx);
      ctx.restore();
    },

    UpdatePositionAndBox: function ()
    {
      this.position.y += this.dir.y * this.speed * deltaTime;
      this.box.y += this.dir.y * this.speed * deltaTime;
    }
  }
}
