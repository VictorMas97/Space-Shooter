
function NewPowerUp (options)
{
    return {
      imgScale: 0.5,

      sound: null,

      dir: { x: 0, y: 1 },
      position: {x: options.x, y: options.y},
      speed: 100,

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
/*
      physicsInfo: {
          density: 10,
          fixedRotation: true,
          linearDamping: 8,
          type: b2Body.b2_dynamicBody
      },


      body: null,
      */

    Start: function ()
    {
      //this.body = CreateBox(world, this.position.x / scale, this.position.y / scale, this.width, this.height, this.physicsInfo);
    },

    Update: function (deltaTime)
    {
      this.position.y += this.dir.y * this.speed * deltaTime;
      this.animation.Update(deltaTime);
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
    }
  }
}
