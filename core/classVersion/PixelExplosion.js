// // Crear una instancia de PixelExplosion
// const pixelExplosion = new PixelExplosion(explosionNumberPixels, explosionParticleSize);

// // Crear una explosión en las coordenadas (x, y) con una velocidad vertical (velocityY)
// pixelExplosion.createExplosion(x, y, velocityY);

// // En tu bucle de juego, actualiza y dibuja la explosión
// function gameLoop() {
//   // Otras actualizaciones de juego

//   // Actualizar la explosión en píxeles
//   pixelExplosion.updateExplosion();

//   // Dibujar la explosión en píxeles en el contexto del lienzo
//   pixelExplosion.drawExplosion(context);

//   // Solicitar el siguiente cuadro de animación
//   requestAnimationFrame(gameLoop);
// }

// // Llamar al bucle de juego
// requestAnimationFrame(gameLoop);

class PixelExplosion {
  constructor(explosionNumberPixels, explosionParticleSize) {
    this.explosionNumberPixels = explosionNumberPixels;
    this.explosionParticleSize = explosionParticleSize;
    this.explosionPixels = [];
  }

  createExplosion(x, y, velocityY) {
    for (let i = 0; i < this.explosionNumberPixels; i++) {
      const pixel = {
        x: x,
        y: y,
        velocityX: (Math.random() - 0.5) * 2, // Velocidad horizontal aleatoria
        velocityY: velocityY + (Math.random() - 0.5) * 2, // Velocidad vertical aleatoria con base en la proporcionada
        color: this.getRandomColor(), // Color aleatorio
        size: Math.random() * this.explosionParticleSize + 1, // Tamaño aleatorio
        lifespan: Math.random() * 30 + 10, // Vida aleatoria
      };
      this.explosionPixels.push(pixel);
    }
  }

  updateExplosion() {
    for (let i = this.explosionPixels.length - 1; i >= 0; i--) {
      const pixel = this.explosionPixels[i];
      pixel.x += pixel.velocityX;
      pixel.y += pixel.velocityY;
      pixel.lifespan--;

      if (pixel.lifespan <= 0) {
        this.explosionPixels.splice(i, 1);
      }
    }
  }

  updateEngineParticles(initialParticleLifespan, propulsionColors) {
    for (const particle of this.explosionPixels) {
      particle.lifespan--; // Reducir la vida de la partícula

      // Calcular el índice de color basado en el tiempo de vida restante
      const colorIndex = Math.floor((particle.lifespan / initialParticleLifespan) * propulsionColors.length);
      // Generar una opción alternativa para que la duración del ciclo de cambio de color se ajuste a la vida de la partícula
      const altColorIndex = Math.floor(((initialParticleLifespan - particle.lifespan) / initialParticleLifespan) * propulsionColors.length);

      // Establecer el color de la partícula basado en el índice de color
      particle.color = propulsionColors[altColorIndex];

      // Actualizar la posición de la partícula
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;

      // Eliminar la partícula si su vida llega a cero
      if (particle.lifespan <= 0) {
        const particleIndex = this.explosionPixels.indexOf(particle);
        if (particleIndex !== -1) {
          this.explosionPixels.splice(particleIndex, 1);
        }
      }
    }
  }

  drawExplosion(context) {
    for (let i = 0; i < this.explosionPixels.length; i++) {
      const pixel = this.explosionPixels[i];
      context.fillStyle = pixel.color;
      context.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
    }
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}


// Exporta la clase PixelExplosion como módulo
export default PixelExplosion;

// // Función jumpingPixels para simular una explosión de 5 píxeles
// function jumpingPixels(x, y, velocityY) {
//   const numPixels = explosionNumberPixels; // Cantidad de píxeles en la explosión
//   let explosionPixels = []; // Píxeles de la explosión

//   for (let i = 0; i < numPixels; i++) {
//     const pixel = {
//       x: x,
//       y: y,
//       velocityX: (Math.random() - 0.5) * 2, // Velocidad horizontal aleatoria
//       velocityY: velocityY + (Math.random() - 0.5) * 2, // Velocidad vertical aleatoria con base en la proporcionada
//       color: getRandomColor(), // Color aleatorio
//       size: Math.random() * explosionParticleSize + 1, // Tamaño aleatorio
//       lifespan: Math.random() * 30 + 10, // Vida aleatoria
//     };
//     explosionPixels.push(pixel);
//   }

//   return explosionPixels;
// }


// // Función auxiliar para obtener un color aleatorio
// function getRandomColor() {
//   const letters = '0123456789ABCDEF';
//   let color = '#';
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }