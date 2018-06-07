  function NewEnemyBullet (options)
  {
    return {
      img: enemyBulletImg,
      imgScale: {x: 0.5, y: 0.6},

      sound: null,

      //box: {x: 0.1, y: 0.2},

      dir: { x: 0, y: 1 },
      position: {x: options.x, y: options.y},
      speed: 800,

      Start: function (enemyPosX, enemyPosY)
      {
        //this.position.x = enemyPosX - 57;
        //this.position.y = enemyPosY;
        this.sound = document.getElementById('sound_weapon_enemy');
        this.sound.play();
      },

      Update: function (deltaTime)
      {
        this.position.y += this.dir.y * this.speed * deltaTime;
      },

      Draw: function (ctx)
      {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.scale(this.imgScale.x, this.imgScale.y);
        ctx.drawImage(enemyBulletImg, 0, 0);
        ctx.restore();

        // draw the Rectangle
        ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
        ctx.fillRect(this.position.x, this.position.y, 5, 22);
        ctx.restore();
      }
    }
  }
