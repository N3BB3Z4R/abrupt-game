//#############################
//#
//#   ASTEROID
//#
//#
//#############################

// import { gameProps } from "./main"
import { constants, variables } from './Config'

// const asteroids = [];

// CREATE ASTEROIDS
const asteroidShape = [
  [" ", "A", "A", " "],
  ["A", "A", "A", "A"],
  ["A", "A", "A", "A"],
  [" ", "A", "A", " "],
]


export function createAsteroid(asteroids, canvas) {
  const {
    maxAsteroidSize,
    minAsteroidSize,
    asteroidVelocityX,
    asteroidVelocityY
  } = constants

  variables.pixelSizeAsteroid = Math.random(maxAsteroidSize + minAsteroidSize / 2) * 8
  const thisAsteroidSize = variables.pixelSizeAsteroid
  const asteroid = {
    x: Math.random() * canvas.width,
    y: 0, // Inicialmente, los asteroides aparecen en la parte superior del lienzo
    vx: (Math.random() - asteroidVelocityX) * 2, // Velocidad horizontal aleatoria
    vy: Math.random() * asteroidVelocityY + 1, // Velocidad vertical aleatoria
    size: variables.pixelSizeAsteroid, // Tamaño aleatorio
    shape: asteroidShape, // Matriz que representa la forma del asteroide
  }

  // Calcula el ancho y el alto del asteroide basado en su forma
  asteroid.width = asteroidShape[0].length * thisAsteroidSize
  asteroid.height = asteroidShape.length * thisAsteroidSize

  asteroids.push(asteroid)

  // si hay más de 50 asteroides en el array, eliminar los primeros 30
  // if (asteroids.length > 40) {
  //   asteroids.splice(0, 10);
  // }
}

export function drawAsteroid(context, asteroid) {
  const {
    asteroidColor,
    pixelTypes
  } = constants

  const thisAsteroidSize = asteroid.size
  context.fillStyle = asteroidColor // Color de los asteroides
  for (let row = 0; row < asteroid.shape.length; row++) {
    for (let col = 0; col < asteroid.shape[0].length; col++) {
      const pixel = asteroid.shape[row][col]
      if (pixel === pixelTypes.asteroid) {
        context.fillRect(
          asteroid.x + col * thisAsteroidSize,
          asteroid.y + row * thisAsteroidSize,
          thisAsteroidSize,
          thisAsteroidSize
        )
      }
    }
  }
}