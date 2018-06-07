  function NewBullet (options)
  {
    return {
      img: playerBulletImg,
      imgScale: {x: 0.4, y: 0.6},

      sound: null,

      //box: {x: 0.1, y: 0.2},

      dir: { x: 0, y: -1 },
      position: {x: options.x, y: options.y},
      speed: 800,

      Start: function ()
      {
        //this.position.x = playerPosX - 2;
        //this.position.y = playerPosY - 60;
        this.sound = document.getElementById('sound_weapon_player');
        this.sound.play();
      },

      Update: function (deltaTime)
      {
        //delete bullets out of the screen
        // if (this.position.y <= 0)
        // {
        //   player.DeleteBullet();
        // }

        this.position.y += this.dir.y * this.speed * deltaTime;
      },

      Draw: function (ctx)
      {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.scale(this.imgScale.x, this.imgScale.y);
        ctx.drawImage(playerBulletImg, 0, 0);
        ctx.restore();

        // draw the Rectangle
        ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
        ctx.fillRect(this.position.x, this.position.y, 4, 20);
        ctx.restore();
      },

      DeleteBullet: function ()
      {
        player.bullets.remove(0);
        console.log(player.bullets.length);
      }
    }
  }
