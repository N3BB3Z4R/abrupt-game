import { spacecraftShape } from './Spacecraft'
import { constants, variables } from './Config'
import { drawTextOnScreen, drawFinalScore, paintHitInBorder } from './Hud'
import { jumpingPixels } from './Particles'
import { playSfx } from './Audio'

//#############################
//#
//#   SHIP COLLISIONS
//#
//#
//#############################

// Detecta colisiones de la nave con el terreno
export const shipCollisionsWithTerrain = (canvas, surface, context) => {

  const {
    terrainUnitWidth,
    terrainUnitHeight,
    maxLandingSpeed,
    pixelTypes,
  } = constants

  // Verificar colisiones de la nave con el suelo lunar
  const columnX = Math.floor(variables.spacecraftX / terrainUnitWidth)
  const columnY = Math.floor(variables.spacecraftY / terrainUnitHeight)

  // Verificar si la nave está dentro del terreno lunar
  if (columnX >= 0 && columnX < surface.length && columnY >= 0 && columnY < surface[columnX].length) {
    if (surface[columnX][columnY] === pixelTypes.hole) {
      // Comprobar si la velocidad de la nave es demasiado alta para aterrizar
      if (Math.abs(variables.velocityX) > maxLandingSpeed || Math.abs(variables.velocityY) > maxLandingSpeed) {
        // Colisión con el suelo
        variables.isGameOver = true
        variables.crashed = true // Establecer el estado dewa aterrizaje
        // smokeCrashedShip(context, canvas, variables.spacecraftX, variables.spacecraftY)
        variables.engineVerticalPower = 0
        variables.velocityY = 0
        variables.velocityX = 0
        drawTextOnScreen("¡Pero donde vaaaaas!!", context, canvas)
        playSfx("hit3")

        // Llama a jumpingPixels para simular una explosión
        const explosion = jumpingPixels(variables.spacecraftX, variables.spacecraftY, -1.5) // -1.5 para una explosión hacia arriba
        // Agrega los píxeles de la explosión al array engineParticles para que se dibujen
        variables.engineParticles.push(...explosion)
      } else {
        // Aterrizaje en el suelo
        paintHitInBorder()
        variables.isGameOver = true
        variables.landed = variables.crashed // Establecer el estado de aterrizaje
        variables.velocityY = 0
        variables.velocityX = 0

        variables.crashed ?
          drawTextOnScreen("¡Te has estampado!", context, canvas) :
          drawTextOnScreen("¡Aterrizaje exitoso!", context, canvas)

      }
      variables.velocityY = 0
      drawFinalScore(context, canvas, variables.elapsedTime)
    }
  }
}

export const shipCollisionsWithAsteroids = () => {
  const { pixelSizeShip } = constants;

  for (let i = 0; i < variables.asteroids.length; i++) {
    const asteroid = variables.asteroids[i];

    for (let row = 0; row < spacecraftShape.length; row++) {
      for (let col = 0; col < spacecraftShape[0].length; col++) {
        if (spacecraftShape[row][col] === constants.pixelTypes.ship) {
          const spacecraftX = variables.spacecraftX + col * pixelSizeShip;
          const spacecraftY = variables.spacecraftY + row * pixelSizeShip;

          // Ahora, en lugar de simplemente verificar si el píxel de la nave está dentro del asteroide,
          // verifica si el píxel de la nave está dentro del asteroide y si el asteroide tiene un tamaño mayor que 0
          if (isPixelInsideAsteroid(spacecraftX, spacecraftY, asteroid) && asteroid.size > 0) {
            // Ha ocurrido una colisión entre la nave y el asteroide
            variables.crushed = true;
            playSfx("hit2")

            const explosion = jumpingPixels(spacecraftX, spacecraftY, -1.5, pixelSizeShip, constants.explosionNumberPixels);
            variables.engineParticles.push(...explosion);

            // Reduzca el tamaño del asteroide en una cantidad específica (ajuste esto según sus necesidades)
            asteroid.size -= 1;

            if (asteroid.size <= 0) {
              // Si el tamaño del asteroide es menor o igual a 0, elimínalo
              variables.asteroids.splice(i, 1);
              i--;
            }

            return;
          }
        }
      }
    }
  }
};

// Comprueba que la nave haya recogido el objeto de combustible y le suma puntos de combustible
export function checkFuelCollision(surface) {

  const spacecraftBounds = {
    left: variables.spacecraftX,
    right: variables.spacecraftX + constants.pixelSizeShip * spacecraftShape[0].length,
    top: variables.spacecraftY,
    bottom: variables.spacecraftY + constants.pixelSizeShip * spacecraftShape.length,
  }

  for (let i = 0; i < variables.fuelItems.length; i++) {
    const fuelItem = variables.fuelItems[i]
    const fuelItemBounds = {
      left: fuelItem.x,
      right: fuelItem.x + fuelItem.size * fuelItem.shape[0].length,
      top: fuelItem.y,
      bottom: fuelItem.y + fuelItem.size * fuelItem.shape.length,
    }

    // Verifica si hay colisión entre la nave y el objeto de combustible
    if (
      spacecraftBounds.left < fuelItemBounds.right &&
      spacecraftBounds.right > fuelItemBounds.left &&
      spacecraftBounds.top < fuelItemBounds.bottom &&
      spacecraftBounds.bottom > fuelItemBounds.top
    ) {
      if (!fuelItem.collected) {
        playSfx("pickFuel")
        // La nave ha recogido el objeto de combustible
        variables.fuel += constants.incrementFuelItem // Suma 20 puntos de combustible
        fuelItem.collected = true // Marca el objeto de combustible como recogido
      }
    } else {
      // Si el objeto de combustible colisiona con el terreno, elimínalo del array
      const columnX = Math.floor(fuelItem.x / constants.terrainUnitWidth);
      const columnY = Math.floor(fuelItem.y / constants.terrainUnitHeight);

      if (
        columnX >= 0 &&
        columnX < surface.length &&
        columnY >= 0 &&
        columnY < surface[columnX].length &&
        surface[columnX][columnY] === constants.pixelTypes.hole
      ) {
        variables.fuelItems.splice(i, 1); // Elimina el objeto de combustible del array
        i--; // Ajusta el índice para evitar problemas con el ciclo
      }
    }
  }
}

//#############################
//#
//#   ASTEROID COLLISIONS
//#
//#
//#############################

export function isPixelInsideAsteroid(x, y, asteroid) {
  const {
    pixelTypes,
  } = constants

  const asteroidX = Math.floor(asteroid.x)
  const asteroidY = Math.floor(asteroid.y)

  // Verifica si las coordenadas (x, y) están dentro del rectángulo del asteroide
  if (
    x >= asteroidX &&
    x <= asteroidX + asteroid.width &&
    y >= asteroidY &&
    y <= asteroidY + asteroid.height
  ) {
    // Las coordenadas están dentro del rectángulo del asteroide
    paintHitInBorder()
    // Verifica si el píxel está ocupado en la forma del asteroide
    const pixelX = Math.floor((x - asteroidX) / variables.pixelSizeAsteroid)
    const pixelY = Math.floor((y - asteroidY) / variables.pixelSizeAsteroid)

    if (asteroid.shape[pixelY] && asteroid.shape[pixelY][pixelX] === pixelTypes.asteroid) {
      return true // El píxel está dentro del asteroide
    }
  }

  return false // El píxel no está dentro del asteroide
}

export const asteroidsCollisions = (surface) => {
  // Actualiza la posición de los asteroides y verifica las colisiones entre ellos
  for (let i = 0; i < variables.asteroids.length; i++) {
    const asteroidA = variables.asteroids[i];

    for (let j = i + 1; j < variables.asteroids.length; j++) {
      const asteroidB = variables.asteroids[j];

      // Verifica la colisión entre asteroidA y asteroidB
      const dx = asteroidA.x - asteroidB.x;
      const dy = asteroidA.y - asteroidB.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < (asteroidA.size + asteroidB.size) / 2) {
        // Colisión entre asteroidA y asteroidB

        playSfx("hit1")

        // Calcula el ángulo entre los asteroides
        const angle = Math.atan2(dy, dx);

        // Calcula las velocidades en las direcciones X e Y para ambos asteroides
        const speedA = Math.sqrt(asteroidA.vx * asteroidA.vx + asteroidA.vy * asteroidA.vy);
        const speedB = Math.sqrt(asteroidB.vx * asteroidB.vx + asteroidB.vy * asteroidB.vy);

        // Calcula las nuevas velocidades en las direcciones X e Y para ambos asteroides
        const newVXA = (speedA * Math.cos(angle)) / 2; // Divide la velocidad a la mitad
        const newVYA = (speedA * Math.sin(angle)) / 2; // Divide la velocidad a la mitad
        const newVXB = (speedB * Math.cos(angle)) / 2; // Divide la velocidad a la mitad
        const newVYB = (speedB * Math.sin(angle)) / 2; // Divide la velocidad a la mitad

        // Asigna las nuevas velocidades a los asteroides
        asteroidA.vx = newVXA;
        asteroidA.vy = newVYA;
        asteroidB.vx = newVXB;
        asteroidB.vy = newVYB;

        // Llama a jumpingPixels para simular una explosión
        const explosionA = jumpingPixels(asteroidA.x, asteroidA.y, asteroidA.size); // -1.5 para una explosión hacia arriba
        const explosionB = jumpingPixels(asteroidB.x, asteroidB.y, -1.5, asteroidB.size, constants.explosionNumberPixels); // -1.5 para una explosión hacia arriba

        // Agrega los píxeles de la explosión al array engineParticles para que se dibujen
        variables.engineParticles.push(...explosionA, ...explosionB);

        // Elimina los asteroides que colisionaron
        variables.asteroids.splice(i, 1);
        variables.asteroids.splice(j - 1, 1);
        i--; // Ajusta el índice para evitar problemas con el ciclo
        break; // Sale del ciclo interno para evitar colisiones duplicadas
      }
    }

    // Verifica colisión de asteroides con el terreno
    const columnX = Math.floor(asteroidA.x / constants.terrainUnitWidth);
    const columnY = Math.floor(asteroidA.y / constants.terrainUnitHeight);

    if (
      columnX >= 0 &&
      columnX < surface.length &&
      columnY >= 0 &&
      columnY < surface[columnX].length &&
      surface[columnX][columnY] === constants.pixelTypes.hole
    ) {
      // Colisión con el terreno
      playSfx("collision")
      variables.asteroids.splice(i, 1); // Elimina el asteroide de la lista
      i--; // Ajusta el índice para evitar saltarse un asteroide en el siguiente ciclo

      // Llama a jumpingPixels para simular una explosión
      const explosionA = jumpingPixels(asteroidA.x, asteroidA.y, asteroidA.size * 0.7); // -1.5 para una explosión hacia arriba
      // Agrega los píxeles de la explosión al array engineParticles para que se dibujen
      variables.engineParticles.push(...explosionA);

      // Crea un objeto para representar el píxel que salta
      jumpingPixels(asteroidA.x, asteroidA.y, -1.5, asteroidA.size, constants.explosionNumberPixels); // Velocidad inicial hacia arriba (ajusta según tu necesidad)
    } else {
      // Actualiza la posición del asteroide si no ha colisionado con el terreno
      asteroidA.x += asteroidA.vx;
      asteroidA.y += asteroidA.vy;
    }
  }
};
