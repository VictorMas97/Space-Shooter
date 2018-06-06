
var background =
{
  img: backgroundImg,
  position: {x: 0, y: 0},
  position2: {x: -20, y: 255},

  sound: null,

  speed: 70,
  imgScale: 3.2,

  Start: function ()
  {
    this.sound = document.getElementById('sound_background');
  },

  Update: function (deltaTime)
  {
    this.sound.play();
    this.position.y += -1 * this.speed * deltaTime;
    this.position2.y += -1 * this.speed * deltaTime;

    if (this.position.y <= -255)
    {
      this.position.y = 255;
    }

    else if (this.position2.y <= -255)
    {
      this.position2.y = 255;
    }
  },

  Draw: function (ctx)
  {
      ctx.save();
      ctx.scale(this.imgScale, this.imgScale);
      ctx.drawImage(backgroundImg, this.position.x, this.position.y);
      ctx.drawImage(backgroundImg, this.position2.x, this.position2.y);
      ctx.restore();
  }
}




























/*
    // fondo cielo
    layer0: {
        position: {x: 0, y: 0},

        Draw: function (ctx) {
            var bgGrd = ctx.createLinearGradient(0, 0, 0, canvas.height);
            bgGrd.addColorStop(0, "black");
            bgGrd.addColorStop(1, "#365B93");
            ctx.fillStyle = bgGrd;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    },

    // estrellas
    layer1: {
        position: {x: 0, y: 0},
        speed: 0.05,
        stars: [],

        Start: function () {
            // creamos un numero determinado de estrellas con posiciones y radio aleatorios
            let numberOfStars = 80;
            while (numberOfStars > 0)
            {
                this.stars.push({
                    position: {
                        x: Math.floor(Math.random() * 900),
                        y: Math.floor(Math.random() * 240)
                    },
                    radius: Math.floor(Math.random() * 2.5) + 0.5
                });
                numberOfStars--;
            }
        },

        Draw: function (ctx) {
            for (let i = 0; i < this.stars.length; i++)
            {
                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.arc(
                    this.stars[i].position.x - (camera.position.x * this.speed),
                    this.stars[i].position.y - (camera.position.y * this.speed),
                    this.stars[i].radius,
                    0,
                    pi_2,
                    false
                );
                ctx.fill();
            }
        }
    },

    // montaña
    layer2: {
        position: {x: 0, y: 0},
        speed: 0.1,
        img: null,

        Start: function () {
            this.img = mountainImg;
        },

        Draw: function (ctx) {
            ctx.drawImage(this.img,
                 - (camera.position.x * this.speed),
                canvas.height - this.img.height - (camera.position.y * this.speed));
        }
    },

    layer3: {
        position: {x: 0, y: 0},
        speed: 0.4,

        Draw: function (ctx) {

        }
    },

    layers : null,

    // inicializamos el array de capas del fondo
    Start: function () {
        this.layers = new Array(this.layer0, this.layer1, this.layer2, this.layer3);
        for (let i = 0; i < this.layers.length; i++)
        {
            if (typeof(this.layers[i].Start) !== 'undefined')
                this.layers[i].Start();
        }
    },

    Draw: function (ctx) {
        for (let i = 0; i < this.layers.length; i++)
            this.layers[i].Draw(ctx);
    }

}; */
