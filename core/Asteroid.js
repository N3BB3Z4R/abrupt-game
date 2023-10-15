class Asteroid {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.asteroidShape = [
      [' ', '#', '#', ' '],
      ['#', '#', '#', '#'],
      ['#', '#', '#', '#'],
      [' ', '#', '#', ' '],
    ];

    this.size = Math.random() * (maxAsteroidSize - minAsteroidSize) + minAsteroidSize;
    this.width = this.asteroidShape[0].length * this.size;
    this.height = this.asteroidShape.length * this.size;

    this.x = Math.random() * this.canvasWidth;
    this.y = 0; // Inicialmente, los asteroides aparecen en la parte superior del lienzo
    this.vx = (Math.random() - asteroidVelocityX) * 2; // Velocidad horizontal aleatoria
    this.vy = Math.random() * asteroidVelocityY + 1; // Velocidad vertical aleatoria
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Si el asteroide sale de la pantalla, reposiciona en la parte superior
    if (this.y > this.canvasHeight) {
      this.y = 0;
      this.x = Math.random() * this.canvasWidth;
      this.size = Math.random() * (maxAsteroidSize - minAsteroidSize) + minAsteroidSize;
      this.width = this.asteroidShape[0].length * this.size;
      this.height = this.asteroidShape.length * this.size;
      this.vx = (Math.random() - asteroidVelocityX) * 2;
      this.vy = Math.random() * asteroidVelocityY + 1;
    }
  }

  draw(context) {
    const thisAsteroidSize = this.size;
    context.fillStyle = asteroidColor; // Color de los asteroides
    for (let row = 0; row < this.asteroidShape.length; row++) {
      for (let col = 0; col < this.asteroidShape[0].length; col++) {
        const pixel = this.asteroidShape[row][col];
        if (pixel === '#') {
          context.fillRect(
            this.x + col * thisAsteroidSize,
            this.y + row * thisAsteroidSize,
            thisAsteroidSize,
            thisAsteroidSize
          );
        }
      }
    }
  }
}

// Exporta la clase Asteroid como módulo
export default Asteroid;

// // Para crear un asteroide y dibujarlo:
// const asteroid = new Asteroid(canvas.width, canvas.height);
// // Luego, en tu ciclo de juego, puedes llamar a asteroid.draw(context) y asteroid.update() para dibujar y actualizar el asteroide.
