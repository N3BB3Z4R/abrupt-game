//#############################
//#
//#   ASTEROID
//#
//#
//#############################

// import { gameProps } from "./main"
import { constants, variables } from './Config'

// const asteroids = [];

// // CREATE ASTEROIDS
// const asteroidShape = [
//   [" ", "A", "A", " "],
//   ["A", "A", "A", "A"],
//   ["A", "A", "A", "A"],
//   [" ", "A", "A", " "],
// ]
const asteroidShapes = [
  [
    [" ", "A", "A", " "],
    ["A", "A", "A", "A"],
    ["A", "A", "A", "A"],
    [" ", "A", "A", " "],
  ],
  [
    ["A", "A"],
    ["A", "A"],
  ],
  [
    [" ", "A", "A"],
    ["A", "A", " "],
  ],
  [
    [" ", " ", "A", "A", " "],
    [" ", "A", "A", "A", "A"],
    ["A", "A", "A", "A", "A"],
    [" ", "A", "A", "A", "A"],
    [" ", "A", "A", "A", " "],
  ],
];

export function createAsteroid(asteroids, canvas) {
  const {
    maxAsteroidSize,
    minAsteroidSize,
    asteroidVelocityX,
    asteroidVelocityY
  } = constants;

  // Selecciona una forma de asteroide aleatoriamente
  const randomShape = asteroidShapes[Math.floor(Math.random() * asteroidShapes.length)];
  // Genera una velocidad de rotación aleatoria
  const rotationVelocity = Math.random() * (0.01 - 0.0001) + 0.0001; // Ajusta los valores según sea necesario

  variables.pixelSizeAsteroid = Math.random(maxAsteroidSize + minAsteroidSize / 2) * 8;
  const thisAsteroidSize = variables.pixelSizeAsteroid;
  const asteroid = {
    x: Math.random() * canvas.width,
    y: 0, // Inicialmente, los asteroides aparecen en la parte superior del lienzo
    vx: (Math.random() - asteroidVelocityX) * 2, // Velocidad horizontal aleatoria
    vy: Math.random() * asteroidVelocityY + 1, // Velocidad vertical aleatoria
    size: variables.pixelSizeAsteroid, // Tamaño aleatorio
    shape: randomShape, // Forma de asteroide seleccionada aleatoriamente
    rotationVelocity: rotationVelocity, // Rotation velocity
  };

  // Calcula el ancho y el alto del asteroide basado en su forma
  asteroid.width = randomShape[0].length * thisAsteroidSize;
  asteroid.height = randomShape.length * thisAsteroidSize;

  asteroids.push(asteroid);
}

export function drawAsteroid(context, asteroid) {
  const {
    asteroidColor,
    pixelTypes
  } = constants;

  const thisAsteroidSize = asteroid.size;
  context.fillStyle = asteroidColor; // Color de los asteroides

  // Guarda el estado actual del contexto
  context.save();

  // Calcula el punto central del asteroide para usarlo como centro de rotación
  const centerX = asteroid.x + asteroid.width / 2;
  const centerY = asteroid.y + asteroid.height / 2;

  // Aplica la transformación de rotación al contexto
  context.translate(centerX, centerY); // Mueve el contexto al centro del asteroide

  // Calcula el ángulo de rotación basado en el tiempo y la velocidad angular
  // const rotationAngle = (Date.now() * 0.002) % (2 * Math.PI); // Ajusta la velocidad según sea necesario
  const rotationAngle = (Date.now() * asteroid.rotationVelocity) % (2 * Math.PI); // Ajusta la velocidad según sea necesario

  context.rotate(rotationAngle); // Aplica la rotación

  // Dibuja el asteroide rotado
  for (let row = 0; row < asteroid.shape.length; row++) {
    for (let col = 0; col < asteroid.shape[0].length; col++) {
      const pixel = asteroid.shape[row][col];
      if (pixel === pixelTypes.asteroid) {
        context.fillRect(
          col * thisAsteroidSize - asteroid.width / 2,
          row * thisAsteroidSize - asteroid.height / 2,
          thisAsteroidSize,
          thisAsteroidSize
        );
      }
    }
  }

  // Restaura el estado del contexto
  context.restore();
}

