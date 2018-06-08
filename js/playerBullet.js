  function NewBullet (options)
  {
    return {
      img: playerBulletImg,
      imgScale: {x: 0.4, y: 0.6},

      sound: null,

      dir: { x: 0, y: -1 },
      position: {x: options.x, y: options.y},
      speed: 800,

      box: {x: options.x, y: options.y},

      isDead: false,

      Start: function ()
      {
        this.sound = document.getElementById('sound_weapon_player');
        this.sound.play();
      },

      Update: function (deltaTime)
      {
        this.position.y += this.dir.y * this.speed * deltaTime;
        this.box.y += this.dir.y * this.speed * deltaTime;
      },

      Draw: function (ctx)
      {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.scale(this.imgScale.x, this.imgScale.y);
        ctx.drawImage(playerBulletImg, 0, 0);
        ctx.restore();
      }
    }
  }
