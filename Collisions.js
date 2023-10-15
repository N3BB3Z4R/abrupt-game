import { spacecraftShape } from './Spacecraft'
// import { gameProps, drawTextOnScreen, drawFinalScore } from './main'
// import { gameProps } from './main'
import { constants, variables } from './Config'
import { drawTextOnScreen, drawFinalScore } from './Hud'
import { jumpingPixels } from './Particles'

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
        variables.engineVerticalPower = 0
        variables.velocityY = 0
        drawTextOnScreen("¡Pero donde vaaaaas!!", context, canvas)

        // Llama a jumpingPixels para simular una explosión
        const explosion = jumpingPixels(variables.spacecraftX, variables.spacecraftY, -1.5) // -1.5 para una explosión hacia arriba
        // Agrega los píxeles de la explosión al array engineParticles para que se dibujen
        variables.engineParticles.push(...explosion)
      } else {
        // Aterrizaje en el suelo
        variables.landed = variables.crashed // Establecer el estado de aterrizaje
        variables.velocityY = 0

        variables.landed ?
          drawTextOnScreen("¡Aterrizaje exitoso!", context, canvas) :
          drawTextOnScreen("¡Te has estampado!", context, canvas)
      }
      variables.velocityY = 0
      drawFinalScore(context, canvas, variables.elapsedTime)
    }
  }
}

// Detecta colisiones de la nave con los asteroides
export const shipCollisionsWithAsteroids = (surface, context) => {
  const {
    pixelSizeShip,
    pixelTypes
  } = constants

  // Verificar colisiones de nave con asteroides
  for (let i = 0; i < variables.asteroids.length; i++) {
    const asteroid = variables.asteroids[i]

    // Verifica si algún píxel de la nave coincide con algún píxel del asteroide
    for (let row = 0; row < spacecraftShape.length; row++) {
      for (let col = 0; col < spacecraftShape[0].length; col++) {
        if (spacecraftShape[row][col] === pixelTypes.asteroid && isPixelInsideAsteroid(variables.spacecraftX + col * pixelSizeShip, variables.spacecraftY + row * pixelSizeShip, asteroid)) {
          // Ha ocurrido una colisión entre la nave y el asteroide
          variables.crushed = true

          // Llama a jumpingPixels para simular una explosión
          const explosion = jumpingPixels(variables.spacecraftX, variables.spacecraftY, -1.5) // -1.5 para una explosión hacia arriba
          // Agrega los píxeles de la explosión al array engineParticles para que se dibujen
          variables.engineParticles.push(...explosion)

          // Elimina el asteroide
          variables.asteroids.splice(i, 1)
          i-- // Ajusta el índice para evitar problemas con el ciclo
          return // Sale de la función inmediatamente para evitar verificar más colisiones en este fotograma
        }
      }
    }
  }
}

// Comprueba que la nave haya recogido el objeto de combustible y le suma puntos de combustible
export function checkFuelCollision(spacecraftX, spacecraftY) {
  const {
    pixelSizeShip,
    incrementFuelItem
  } = constants

  const {
    fuelItems
  } = variables

  const spacecraftBounds = {
    left: spacecraftX,
    right: spacecraftX + pixelSizeShip * spacecraftShape[0].length,
    top: spacecraftY,
    bottom: spacecraftY + pixelSizeShip * spacecraftShape.length,
  }

  for (let i = 0; i < fuelItems.length; i++) {
    const fuelItem = fuelItems[i]
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
        // La nave ha recogido el objeto de combustible
        variables.fuel += incrementFuelItem // Suma 20 puntos de combustible
        fuelItem.collected = true // Marca el objeto de combustible como recogido
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
  for (let i = 0; i < gameProps.asteroids.length; i++) {
    const asteroidA = gameProps.asteroids[i]

    for (let j = i + 1; j < gameProps.asteroids.length; j++) {
      const asteroidB = gameProps.asteroids[j]

      // Verifica la colisión entre asteroidA y asteroidB
      if (
        asteroidA.x < asteroidB.x + asteroidB.size &&
        asteroidA.x + asteroidA.size > asteroidB.x &&
        asteroidA.y < asteroidB.y + asteroidB.size &&
        asteroidA.y + asteroidA.size > asteroidB.y
      ) {
        // Colisión entre asteroidA y asteroidB

        // Calcula el ángulo entre los asteroides
        const angle = Math.atan2(asteroidB.y - asteroidA.y, asteroidB.x - asteroidA.x)

        // Calcula las velocidades en las direcciones X e Y para ambos asteroides
        const speedA = Math.sqrt(asteroidA.vx * asteroidA.vx + asteroidA.vy * asteroidA.vy)
        const speedB = Math.sqrt(asteroidB.vx * asteroidB.vx + asteroidB.vy * asteroidB.vy)

        // Calcula las nuevas velocidades en las direcciones X e Y para ambos asteroides
        const newVXA = (speedA * Math.cos(angle)) / 2 // Divide la velocidad a la mitad
        const newVYA = (speedA * Math.sin(angle)) / 2 // Divide la velocidad a la mitad
        const newVXB = (speedB * Math.cos(angle)) / 2 // Divide la velocidad a la mitad
        const newVYB = (speedB * Math.sin(angle)) / 2 // Divide la velocidad a la mitad

        // Asigna las nuevas velocidades a los asteroides
        asteroidA.vx = newVXA
        asteroidA.vy = newVYA
        asteroidB.vx = newVXB
        asteroidB.vy = newVYB

        // Llama a jumpingPixels para simular una explosión
        const explosionA = jumpingPixels(asteroidA.x, asteroidA.y, -1.5) // -1.5 para una explosión hacia arriba
        const explosionB = jumpingPixels(asteroidB.x, asteroidB.y, 1.5) // -1.5 para una explosión hacia arriba

        // Agrega los píxeles de la explosión al array engineParticles para que se dibujen
        variables.engineParticles.push(...explosionA, ...explosionB)

        // Elimina los asteroides que colisionaron
        variables.asteroids.splice(i, 1)
        variables.asteroids.splice(j - 1, 1)
        i-- // Ajusta el índice para evitar problemas con el ciclo
        break // Sale del ciclo interno para evitar colisiones duplicadas
      }
    }

    // Verifica colisión de asteroides con el terreno
    const columnX = Math.floor(asteroidA.x / gameProps.terrainUnitWidth)
    const columnY = Math.floor(asteroidA.y / gameProps.terrainUnitHeight)

    if (
      columnX >= 0 &&
      columnX < surface.length &&
      columnY >= 0 &&
      columnY < surface[columnX].length &&
      surface[columnX][columnY] === gameProps.pixelTypes.hole
    ) {
      // Colisión con el terreno
      variables.asteroids.splice(i, 1) // Elimina el asteroide de la lista
      i-- // Ajusta el índice para evitar saltarse un asteroide en el siguiente ciclo

      // Llama a jumpingPixels para simular una explosión
      const explosionA = jumpingPixels(asteroidA.x, asteroidA.y, -1.5) // -1.5 para una explosión hacia arriba
      // Agrega los píxeles de la explosión al array engineParticles para que se dibujen
      variables.engineParticles.push(...explosionA)

      // Crea un objeto para representar el píxel que salta
      jumpingPixels(asteroidA.x, asteroidA.y, -1.5, asteroidA.size) // Velocidad inicial hacia arriba (ajusta según tu necesidad)
    } else {
      // Actualiza la posición del asteroide si no ha colisionado con el terreno
      asteroidA.x += asteroidA.vx
      asteroidA.y += asteroidA.vy
    }
  }
}