class Spacecraft {
  constructor(canvasWidth, canvasHeight, pixelSize) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.pixelSize = pixelSize;

    this.spacecraftShape = [
      [' ', ' ', '#', ' ', ' '],
      [' ', ' ', '#', ' ', ' '],
      [' ', '#', '#', '#', ' '],
      [' ', '#', ' ', '#', ' '],
      [' ', '#', '#', '#', ' '],
      ['#', '#', ' ', '#', '#'],
    ];

    this.x = canvasWidth / 2 - (this.spacecraftShape[0].length * this.pixelSize) / 2;
    this.y = 0; // Inicialmente, la nave aparece en la parte superior del lienzo
    this.velocityX = 0;
    this.velocityY = 0;
    this.fuel = 100;
    this.rotationAngle = 0;
    this.rotationSpeed = 0.2;
  }

  update(leftKeyPressed, rightKeyPressed, upKeyPressed, engineParticles) {
    // Aplicar gravedad lunar
    this.velocityY += 0.1; // Ajusta este valor según la gravedad lunar deseada

    // Actualizar posición de la nave
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Controlar cuando la nave ha salido por el lado izquierdo del lienzo
    if (this.x < 0) {
      this.x = this.canvasWidth;
    } else if (this.x > this.canvasWidth) {
      this.x = 0;
    }

    // Actualizar la rotación de la nave según las teclas izquierda y derecha
    if (leftKeyPressed) {
      this.rotationAngle -= this.rotationSpeed;
    }
    if (rightKeyPressed) {
      this.rotationAngle += this.rotationSpeed;
    }

    // Actualiza el valor del elemento progress para FUEL
    const hudFuel = document.getElementById('hud-fuel');
    hudFuel.value = this.fuel;
    // Cambiar el color del componente hud-fuel si el combustible es 0
    if (this.fuel === 0) {
      hudFuel.classList('hud-fuel__empty')
    }

    // Aplicar la fuerza de propulsión cuando se presiona la flecha arriba
    if (upKeyPressed && this.fuel > 0) {
      this.velocityX += thrustX;
      this.velocityY += thrustY;
      this.fuel -= 0.1; // Ajusta este valor según el consumo de combustible

      // Agregar píxeles del escape del motor
      for (let i = 0; i < 5; i++) { // Agrega 5 píxeles en cada impulso
        const particle = {
          x: this.x + 6,
          y: this.y + 10, // Posición en la parte inferior de la nave
          velocityX: (Math.random() - 0.5) * 0.2, // Velocidad horizontal aleatoria
          velocityY: Math.random() * 0.5 + 0.2, // Velocidad vertical aleatoria hacia abajo
          size: engineParticleSize, // Tamaño fijo de los píxeles del escape del motor
          lifespan: lifespan, // Vida aleatoria
        };
        engineParticles.push(particle);
      }
    }

    // Verificar si la nave ha salido de la pantalla
    if (this.y > this.canvasHeight) {
      this.y = this.canvasHeight;
      this.velocityY = 0;
    }
  }

  draw(context, landed, crushed, crashed) {
    // Verificar combustible
    if (this.fuel <= 0) {
      context.fillStyle = '#999';
    }

    if (!landed && !crushed && !crashed) {
      context.fillStyle = '#EEE'; // Color de la nave neutro
    }
    if (landed && !crushed && !crashed) {
      context.fillStyle = '#3F3'; // Nave aterrizada bien y sin colisiones
    }
    if ((crushed && !crashed) || (crushed && !crashed)) {
      context.fillStyle = '#D93'; // Nave en el aire y con colisiones
    }
    if (crashed) {
      context.fillStyle = '#F43'; // Nave aterrizada mal
    }

    // Dibuja la nave espacial pixel por pixel
    for (let row = 0; row < this.spacecraftShape.length; row++) {
      for (let col = 0; col < this.spacecraftShape[0].length; col++) {
        const pixel = this.spacecraftShape[row][col];
        if (pixel === '#') {
          context.fillRect(
            this.x + col * this.pixelSize,
            this.y + row * this.pixelSize,
            this.pixelSize,
            this.pixelSize
          );
        }
      }
    }
  }

  moveLeft() {
    if (this.x > 0) {
      this.x -= this.pixelSize;
    }
  }

  moveRight() {
    if (this.x + this.spacecraftShape[0].length * this.pixelSize < this.canvasWidth) {
      this.x += this.pixelSize;
    }
  }

  moveUp() {
    if (this.y > 0) {
      this.y -= this.pixelSize;
    }
  }

  moveDown() {
    if (this.y + this.spacecraftShape.length * this.pixelSize < this.canvasHeight) {
      this.y += this.pixelSize;
    }
  }
}

export default Spacecraft;


// // Para crear una nave espacial y dibujarla:
// const spacecraft = new Spacecraft(canvas.width, canvas.height, pixelSizeShip);
// // Luego, en tu ciclo de juego, puedes llamar a spacecraft.draw(context, fuel, landed, crushed, crashed) para dibujar la nave y utilizar spacecraft.moveLeft(), spacecraft.moveRight(), spacecraft.moveUp(), y spacecraft.moveDown() para controlar su movimiento.
