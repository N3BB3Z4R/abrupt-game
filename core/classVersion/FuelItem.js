class FuelItem {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.fuelSize = 4;
    this.fuelShape = [
      [' ', ' ', 'F', 'F', 'F'],
      ['F', ' ', 'F', ' ', 'F'],
      [' ', 'F', 'F', 'F', 'F'],
      [' ', 'F', 'F', 'F', 'F'],
      [' ', 'F', 'F', 'F', 'F'],
      [' ', 'F', 'F', 'F', 'F'],
    ];

    this.x = Math.random() * this.canvasWidth;
    this.y = 0; // Inicialmente, los objetos de combustible aparecen en la parte superior del lienzo
    this.size = this.fuelSize; // Tamaño fijo para los objetos de combustible
    this.collected = false; // Indica si el objeto de combustible ha sido recogido
  }

  update() {
    this.y += fuelVelocityY;

    // Si el objeto de combustible sale de la pantalla, reposiciónalo en la parte superior
    if (this.y > this.canvasHeight) {
      this.y = 0;
      this.x = Math.random() * this.canvasWidth;
      this.collected = false;
    }
  }

  draw(context) {
    context.fillStyle = fuelColor; // Color rojo para los objetos de combustible
    for (let row = 0; row < this.fuelShape.length; row++) {
      for (let col = 0; col < this.fuelShape[0].length; col++) {
        const pixel = this.fuelShape[row][col];
        if (pixel === 'F' && !this.collected) {
          context.fillRect(
            this.x + col * this.size,
            this.y + row * this.size,
            this.size,
            this.size
          );
        }
      }
    }
  }
}

// Exporta la clase Fuel como módulo
export default FuelItem;

// // Para crear un objeto de combustible y dibujarlo:
// const fuelItem = new FuelItem(canvas.width, canvas.height);
// // Luego, en tu ciclo de juego, puedes llamar a fuelItem.draw(context) y fuelItem.update() para dibujar y actualizar el objeto de combustible.
