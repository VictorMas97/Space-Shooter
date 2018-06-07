  function NewEnemyBullet (options)
  {
    return {
      img: enemyBulletImg,
      imgScale: {x: 0.5, y: 0.6},

      sound: null,

      dir: { x: 0, y: 1 },
      position: {x: options.x, y: options.y},
      speed: 800,

      box: {x: options.x, y: options.y},

      Start: function ()
      {
        this.sound = document.getElementById('sound_weapon_enemy');
        this.sound.play();
      },

      Update: function (deltaTime)
      {
        this.position.y += this.dir.y * this.speed * deltaTime;
        this.box.y += this.dir.y * this.speed * deltaTime;

        player.CheckCollision(this.box)
      },

      Draw: function (ctx)
      {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.scale(this.imgScale.x, this.imgScale.y);
        ctx.drawImage(enemyBulletImg, 0, 0);
        ctx.restore();

        // draw the Rectangle
        //ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
        //ctx.fillRect(this.box.x, this.box.y, 5, 22);
        //ctx.restore();
      }
    }
  }
