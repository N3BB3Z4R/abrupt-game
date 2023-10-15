import { generateTerrain, drawTerrain } from "./Terrain.js";

//#################################
//#
//#   Abrupt game
//#   by Oscar Abad
//#   https://github.com/N3BB3Z4R
//#   october 2023
//#
//#################################

// ### GLOBAL VARIABLES ###
const gameSpeed = 3;
// Terrain Generation
const terrainUnitWidth = 2; // Ancho del carácter
const terrainUnitHeight = 2; // Altura del carácter
const maxHoleWidth = 9
const minHoleWidth = 2
const peakChance = 0.0; // Probabilidad de tener una montaña
const holeChance = 0.6; // Probabilidad de tener un hueco
const terrainColor = '#332' // Color del suelo
// Ship Generation
const spacecraftWidth = 8; // Ancho de la nave
let spacecraftX = 100; // Posición horizontal inicial de la nave
let spacecraftY = 50; // Position vertical inicial de la nave 
let velocityX = 0;
let velocityY = 0;
const incrementVelocityY = 0.1 * gameSpeed;
let fuel = 100;
const incrementFuelItem = 20; // Cantidad de combustible que se agrega al recoger un objeto de fuel
const spacecraftHeight = 8; // Altura de la nave
const engineParticles = []; // Almacena los píxeles del escape del motor
const engineParticleSize = 4; // Tamaño de los píxeles del escape del motor
const engineHorizontalPower = 0.1 * gameSpeed; // Fuerza de propulsión horizontal
const propulsionColors = ['#FFA', '#3FF', '#FD3', '#FF4400']
let engineVerticalPower = 0.11 * gameSpeed; // Fuerza de propulsión vertical
// Asteroids Generation
let asteroidProbability = 0.02; // Mutable Probabilidad de que aparezca un asteroide
const asteroidProbabilityIncrement = 0.0005; // Probabilidad de que aparezca un asteroide
const asteroidProbabilityIncrementTime = 5; // Seconds to increment the probability
const asteroidAverageSize = 10; // Tamaño medio de los asteroides
const minAsteroidSize = 12; // Tamaño mínimo de los asteroides
const maxAsteroidSize = 20; // Tamaño máximo de los asteroides
const asteroidColor = '#346' // Color de los asteroides
const asteroidVelocityX = 0.5 * gameSpeed; // velocidad horizontal de los asteroides
const asteroidVelocityY = 0.5 * gameSpeed;// velocidad vertical de los asteroides
let pixelSizeAsteroid = null; // inicializamos la variable para que no de error
// Particle Generation
const initialParticleLifespan = 40; // Vida inicial de los píxeles del escape del motor
const lifespan = 30 // Vida de los píxeles del escape del motor
const explosionNumberPixels = 15 // Cantidad de píxeles en la explosión
const explosionParticleSize = 5 // Tamaño de los píxeles en la explosión
// Game variables
const maxLandingSpeed = 1.5 * gameSpeed; // Velocidad máxima de aterrizaje
let landed = false; // Estado de aterrizaje
let crashed = false; // Estado de colisión
let crushed = false; // Estado de aplastamiento
let flightTime = 0; // Tiempo de vuelo en segundos
let elapsedTime = 0; // Tiempo transcurrido desde el inciio del juego
let startTime; // Tiempo de inicio del juego
let isGameOver = false; // Estado de juego terminado
// PHYSICS AND CONTROLS
// Variables para rastrear las teclas presionadas por el jugador
let gamePaused = true; // Inicia el juego en pausa
let leftKeyPressed = false; // Tecla A
let rightKeyPressed = false; // Tecla D
let upKeyPressed = false; // Tecla W
// Tipos de pixeles para el canvas
const pixelTypes = {
  space: ' ',
  mountain: '+',
  hole: '-',
  asteroid: 'A',
  ship: 'S',
  fuel: 'F',
}

export const gameProps = {
  terrainUnitWidth,
  terrainUnitHeight,
  maxHoleWidth,
  minHoleWidth,
  peakChance,
  holeChance,
  terrainColor,
  spacecraftWidth,
  spacecraftX,
  spacecraftY,
  velocityX,
  velocityY,
  incrementVelocityY,
  fuel,
  incrementFuelItem,
  spacecraftHeight,
  engineParticles,
  engineHorizontalPower,
  propulsionColors,
  engineVerticalPower,
  asteroidProbability,
  asteroidProbabilityIncrement,
  asteroidProbabilityIncrementTime,
  asteroidAverageSize,
  minAsteroidSize,
  maxAsteroidSize,
  asteroidColor,
  asteroidVelocityX,
  asteroidVelocityY,
  pixelSizeAsteroid,
  initialParticleLifespan,
  lifespan,
  explosionNumberPixels,
  explosionParticleSize,
  maxLandingSpeed,
  landed,
  crashed,
  crushed,
  flightTime,
  elapsedTime,
  startTime,
  isGameOver,
  gamePaused,
  leftKeyPressed,
  rightKeyPressed,
  upKeyPressed,
  pixelTypes
}

//#############################
//#
//#   TERRAIN
//#
//#
//#############################

// // GENERATE TERRAIN
// function generateTerrain(width, height) {
//   const surface = [];
//   const maxHeight = Math.floor(height * 0.7); // Altura máxima de las montañas
//   const minHeight = Math.floor(height * 0.3); // Altura mínima de los huecos
//   const midHeight = Math.floor((maxHeight + minHeight) / 1.2); // Altura media

//   for (let x = 0; x < width; x++) {
//     const column = [];
//     for (let y = 0; y < height; y++) {
//       let terrainType = pixelTypes.space; // Espacio en blanco en el aire por defecto

//       // Genera montañas
//       if (Math.random() < peakChance) {
//         const heightValue = Math.floor(Math.random() * (maxHeight - midHeight)) + midHeight;
//         if (y < heightValue) {
//           terrainType = pixelTypes.mountain; // Representa una montaña
//         }
//       }

//       // Genera huecos
//       if (Math.random() < holeChance) {
//         const depthValue = Math.floor(Math.random() * (midHeight - minHeight)) + minHeight;
//         const holeWidth = Math.floor(Math.random() * (maxHoleWidth - minHoleWidth + 1)) + minHoleWidth;

//         if (y >= midHeight && y < midHeight + depthValue && x >= holeWidth && x < width - holeWidth) {
//           terrainType = pixelTypes.hole; // Representa un hueco
//         }
//       }

//       column.push(terrainType);
//     }
//     surface.push(column);
//   }

//   return surface;
// }

// // DRAW TERRAIN
// function drawTerrain(context, surface) {
//   // const terrainGenerator = require('./terrain-generator.js')
//   // const terrain = terrainGenerator.generateConnectedMountainsTerrain(800,600,20,1)

//   for (let x = 0; x < surface.length; x++) {
//     for (let y = 0; y < surface[x].length; y++) {
//       if (surface[x][y] === '-') {
//         context.fillStyle = terrainColor; // Color del suelo
//         context.fillRect(x * terrainUnitWidth, y * terrainUnitHeight, terrainUnitWidth, terrainUnitHeight);
//         // context.fillRect(terrain);
//       }
//     }
//   }
// }

//#############################
//#
//#   ASTEROID
//#
//#
//#############################

// CREATE ASTEROIDS
const asteroids = [];

const asteroidShape = [
  [' ', 'A', 'A', ' '],
  ['A', 'A', 'A', 'A'],
  ['A', 'A', 'A', 'A'],
  [' ', 'A', 'A', ' '],
];


function createAsteroid() {
  pixelSizeAsteroid = Math.random(maxAsteroidSize + minAsteroidSize / 2) * 8
  const thisAsteroidSize = pixelSizeAsteroid
  const asteroid = {
    x: Math.random() * canvas.width,
    y: 0, // Inicialmente, los asteroides aparecen en la parte superior del lienzo
    vx: (Math.random() - asteroidVelocityX) * 2, // Velocidad horizontal aleatoria
    vy: Math.random() * asteroidVelocityY + 1, // Velocidad vertical aleatoria
    size: pixelSizeAsteroid, // Tamaño aleatorio
    shape: asteroidShape, // Matriz que representa la forma del asteroide
  };

  // Calcula el ancho y el alto del asteroide basado en su forma
  asteroid.width = asteroidShape[0].length * thisAsteroidSize;
  asteroid.height = asteroidShape.length * thisAsteroidSize;

  asteroids.push(asteroid);

  // si hay más de 50 asteroides en el array, eliminar los primeros 30
  // if (asteroids.length > 40) {
  //   asteroids.splice(0, 10);
  // }
}

function drawAsteroid(context, asteroid) {
  const thisAsteroidSize = asteroid.size;
  context.fillStyle = asteroidColor; // Color de los asteroides
  for (let row = 0; row < asteroid.shape.length; row++) {
    for (let col = 0; col < asteroid.shape[0].length; col++) {
      const pixel = asteroid.shape[row][col];
      if (pixel === pixelTypes.asteroid) {
        context.fillRect(
          asteroid.x + col * thisAsteroidSize,
          asteroid.y + row * thisAsteroidSize,
          thisAsteroidSize,
          thisAsteroidSize
        );
      }
    }
  }
}

//#############################
//#
//#   FUEL
//#
//#
//#############################

// CREATE FUEL ITEMS
const fuelItems = [];
const fuelColor = "#FF0000";
const fuelItemsToKeep = [];
let fuelVelocityY = 0.6;
const fuelQuantityToAdd = 20;
const fuelSize = 4;
const fuelShape = [
  [' ', ' ', 'F', 'F', 'F'],
  ['F', ' ', 'F', ' ', 'F'],
  [' ', 'F', 'F', 'F', 'F'],
  [' ', 'F', 'F', 'F', 'F'],
  [' ', 'F', 'F', 'F', 'F'],
  [' ', 'F', 'F', 'F', 'F'],
];

function createFuelItem() {
  const fuelItem = {
    x: Math.random() * canvas.width,
    y: 0, // Inicialmente, los objetos de fuel aparecen en la parte superior del lienzo
    size: fuelSize, // Tamaño fijo para los objetos de fuel
    shape: fuelShape, // Matriz que representa la forma del objeto de fuel
    collected: false, // Indica si el objeto de fuel ha sido recogido
  };

  fuelItems.push(fuelItem);
}

function drawFuelItem(context, fuelItem) {
  context.fillStyle = fuelColor; // Color rojo para los objetos de fuel
  for (let row = 0; row < fuelItem.shape.length; row++) {
    for (let col = 0; col < fuelItem.shape[0].length; col++) {
      const pixel = fuelItem.shape[row][col];
      if (pixel === 'F' && !fuelItem.collected) {
        context.fillRect(
          fuelItem.x + col * fuelItem.size,
          fuelItem.y + row * fuelItem.size,
          fuelItem.size,
          fuelItem.size
        );
      }
    }
  }
}

//#############################
//#
//#   SHIP
//#
//#
//#############################

// DRAW SHIP
// Define la forma de la nave espacial como una matriz de píxeles
const spacecraftShape = [
  [' ', ' ', 'S', ' ', ' '],
  [' ', ' ', 'S', ' ', ' '],
  [' ', 'S', 'S', 'S', ' '],
  [' ', 'S', ' ', 'S', ' '],
  [' ', 'S', 'S', 'S', ' '],
  ['S', 'S', ' ', 'S', 'S'],
];

// Tamaño de cada píxel
const pixelSizeShip = 3; // Ajusta este valor según sea necesario

// Función para dibujar la nave espacial
function drawSpacecraft(context, x, y) {
  // Verificar combustible
  if (fuel <= 0) {
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
  for (let row = 0; row < spacecraftShape.length; row++) {
    for (let col = 0; col < spacecraftShape[0].length; col++) {
      const pixel = spacecraftShape[row][col];
      if (pixel === 'S') {
        context.fillRect(x + col * pixelSizeShip, y + row * pixelSizeShip, pixelSizeShip, pixelSizeShip);
      }
    }
  }
}

//#############################
//#
//#   CONTROLS
//#
//#
//#############################

// CONTROLES TECLADO Agregar eventos de teclado para detectar las teclas presionadas
document.addEventListener("keydown", function (event) {
  // añade aqui la variable de movimiento del raton en eje X
  if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
    leftKeyPressed = true;
  } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
    rightKeyPressed = true;
  } else if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
    upKeyPressed = true;
  } else if (event.key === " ") {
    // Tecla Espacio para pausar/reanudar el juego
    gamePaused = !gamePaused;
    if (!gamePaused) {
      // Si se reanuda el juego, solicita un nuevo cuadro de animación
      requestAnimationFrame(gameLoop);
    } else {
      if (isGameOver) {
        restartGame();
      } else {
        pauseGame()
      }
    }
  } else if (event.key === "r" || event.key === "R") {
    // Tecla R para reiniciar el juego
    restartGame();
  }
});

// CONTROLES TECLADO Agregar eventos de teclado para detectar las teclas que dejan de ser presionadas
document.addEventListener("keyup", function (event) {
  if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
    leftKeyPressed = false;
  } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
    rightKeyPressed = false;
  } else if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
    upKeyPressed = false;
  } else if (event.key === " ") {
    // Tecla Espacio liberada
    // Puedes realizar alguna acción adicional aquí si es necesario
  } else if (event.key === "r" || event.key === "R") {
    // Tecla R liberada
    // Puedes realizar alguna acción adicional aquí si es necesario
  }
});

// CONTROLES RATON Agregar eventos de raton
document.addEventListener("mousedown", function (event) {
  // Verifica si se hizo clic en el botón izquierdo del ratón
  if (event.button === 0) {
    upKeyPressed = true;
  }
})
document.addEventListener("mouseup", function (event) {
  // Verifica si se soltó el botón izquierdo del ratón
  if (event.button === 0) {
    upKeyPressed = false;
  }
});
document.addEventListener("mousemove", function (event) {
  // Obtén la posición actual del ratón en el eje X
  const mouseX = event.clientX;

  // Define un umbral para determinar la mitad de la pantalla
  const screenHalf = window.innerWidth / 2;

  // Comprueba si el ratón está a la izquierda o a la derecha de la mitad de la pantalla
  if (mouseX < screenHalf) {
    // El ratón está a la izquierda de la mitad de la pantalla, puedes hacer algo para mover a la izquierda
    leftKeyPressed = true;
    rightKeyPressed = false; // Asegúrate de que no se esté presionando la tecla de mover a la derecha
  } else {
    // El ratón está a la derecha de la mitad de la pantalla, puedes hacer algo para mover a la derecha
    rightKeyPressed = true;
    leftKeyPressed = false; // Asegúrate de que no se esté presionando la tecla de mover a la izquierda
  }
});

// CONTROLES MOVIL
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", function (event) {
  // Obtén la posición X del primer toque
  touchStartX = event.touches[0].clientX;

  // Realiza alguna acción cuando se inicia el toque (por ejemplo, mover hacia arriba)
  upKeyPressed = true;
});

document.addEventListener("touchend", function (event) {
  // Obtén la posición X del último toque
  touchEndX = event.changedTouches[0].clientX;

  // Calcula la distancia entre el inicio y el final del toque
  const touchDistanceX = touchEndX - touchStartX;

  // Define un umbral para determinar si el deslizamiento fue hacia la izquierda o hacia la derecha
  const swipeThreshold = 50; // Puedes ajustar este valor según tus necesidades

  if (touchDistanceX < -swipeThreshold) {
    // Deslizamiento hacia la izquierda, puedes hacer algo para mover a la izquierda
    leftKeyPressed = true;
    rightKeyPressed = false; // Asegúrate de que no se esté presionando la tecla de mover a la derecha
  } else if (touchDistanceX > swipeThreshold) {
    // Deslizamiento hacia la derecha, puedes hacer algo para mover a la derecha
    rightKeyPressed = true;
    leftKeyPressed = false; // Asegúrate de que no se esté presionando la tecla de mover a la izquierda
  } else {
    // Realiza alguna acción si el deslizamiento no alcanza el umbral (por ejemplo, saltar)
    // Puedes personalizar esta acción según las necesidades de tu juego
  }

  // Realiza alguna acción cuando se finaliza el toque (por ejemplo, dejar de mover hacia arriba)
  upKeyPressed = false;
});

// Evitar el desplazamiento de la página en dispositivos móviles al tocar y deslizar
document.body.addEventListener("touchmove", function (event) {
  event.preventDefault();
});

//#############################
//#
//#   EXPLOSIONS & PARTICLES
//#
//#
//#############################

// Función jumpingPixels para simular una explosión de 5 píxeles
function jumpingPixels(x, y, velocityY, size) {
  let itemSize = typeof size === 'number' ? size : explosionParticleSize; // Tamaño de los píxeles de la explosión
  const numPixels = explosionNumberPixels; // Cantidad de píxeles en la explosión
  let explosionPixels = []; // Píxeles de la explosión

  for (let i = 0; i < numPixels; i++) {
    const pixel = {
      x: x,
      y: y,
      velocityX: (Math.random() - 0.5) * 2, // Velocidad horizontal aleatoria
      velocityY: velocityY + (Math.random() - 0.5) * 2, // Velocidad vertical aleatoria con base en la proporcionada
      color: getRandomColor(), // Color aleatorio
      size: Math.random() * itemSize, // Tamaño aleatorio
      lifespan: Math.random() * 30 + 10, // Vida aleatoria
    };
    explosionPixels.push(pixel);
  }

  return explosionPixels;
}

// Función auxiliar para obtener un color aleatorio
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Funcion de redibujado segun los propulsionColors
function updateEngineParticles() {
  for (const particle of engineParticles) {
    particle.lifespan--; // Reducir la vida de la partícula

    // Calcular el índice de color basado en el tiempo de vida restante
    const colorIndex = Math.floor((particle.lifespan / initialParticleLifespan) * propulsionColors.length);
    // generame una opcion alternativa para que la duracion del ciclo de cambio de color se ajuste a la vida de la particula
    const altColorIndex = Math.floor(((initialParticleLifespan - particle.lifespan) / initialParticleLifespan) * propulsionColors.length);

    // Establecer el color de la partícula basado en el índice de color
    particle.color = propulsionColors[altColorIndex];

    // Actualizar la posición de la partícula
    particle.x += particle.velocityX;
    particle.y += particle.velocityY;

    // Eliminar la partícula si su vida llega a cero
    if (particle.lifespan <= 0) {
      const particleIndex = engineParticles.indexOf(particle);
      if (particleIndex !== -1) {
        engineParticles.splice(particleIndex, 1);
      }
    }
  }
}

//#############################
//#
//#   COLLISIONS
//#
//#
//#############################

function isPixelInsideAsteroid(x, y, asteroid) {
  const asteroidX = Math.floor(asteroid.x);
  const asteroidY = Math.floor(asteroid.y);

  // Verifica si las coordenadas (x, y) están dentro del rectángulo del asteroide
  if (
    x >= asteroidX &&
    x <= asteroidX + asteroid.width &&
    y >= asteroidY &&
    y <= asteroidY + asteroid.height
  ) {
    // Las coordenadas están dentro del rectángulo del asteroide

    // Verifica si el píxel está ocupado en la forma del asteroide
    const pixelX = Math.floor((x - asteroidX) / pixelSizeAsteroid);
    const pixelY = Math.floor((y - asteroidY) / pixelSizeAsteroid);

    if (asteroid.shape[pixelY] && asteroid.shape[pixelY][pixelX] === pixelTypes.asteroid) {
      return true; // El píxel está dentro del asteroide
    }
  }

  return false; // El píxel no está dentro del asteroide
}

// Detecta colisiones de la nave con el terreno
const shipCollisionsWithTerrain = () => {
  // Verificar colisiones de la nave con el suelo lunar
  const columnX = Math.floor(spacecraftX / terrainUnitWidth);
  const columnY = Math.floor(spacecraftY / terrainUnitHeight);
  // Verificar si la nave está dentro del terreno lunar
  if (columnX >= 0 && columnX < surface.length && columnY >= 0 && columnY < surface[columnX].length) {
    if (surface[columnX][columnY] === pixelTypes.hole) {
      // Comprobar si la velocidad de la nave es demasiado alta para aterrizar
      if (Math.abs(velocityX) > maxLandingSpeed || Math.abs(velocityY) > maxLandingSpeed) {
        // Colisión con el suelo
        isGameOver = true;
        crashed = true; // Establecer el estado de aterrizaje
        engineVerticalPower = 0
        velocityY = 0;
        drawTextOnScreen("¡Pero donde vaaaaas!!")

        // Llama a jumpingPixels para simular una explosión
        const explosion = jumpingPixels(spacecraftX, spacecraftY, -1.5); // -1.5 para una explosión hacia arriba
        // Agrega los píxeles de la explosión al array engineParticles para que se dibujen
        engineParticles.push(...explosion);
      } else {
        // Aterrizaje en el suelo
        landed = crashed ? false : true; // Establecer el estado de aterrizaje
        velocityY = 0;

        landed ?
          drawTextOnScreen("¡Aterrizaje exitoso!") :
          drawTextOnScreen("¡Te has estampado!")
      }
      velocityY = 0;
      drawFinalScore();
    }
  }
}

// Detecta colisiones de la nave con los asteroides
const shipCollisionsWithAsteroids = () => {
  // Verificar colisiones de nave con asteroides
  for (let i = 0; i < asteroids.length; i++) {
    const asteroid = asteroids[i];

    // Verifica si algún píxel de la nave coincide con algún píxel del asteroide
    for (let row = 0; row < spacecraftShape.length; row++) {
      for (let col = 0; col < spacecraftShape[0].length; col++) {
        if (spacecraftShape[row][col] === pixelTypes.asteroid && isPixelInsideAsteroid(spacecraftX + col * pixelSizeShip, spacecraftY + row * pixelSizeShip, asteroid)) {
          // Ha ocurrido una colisión entre la nave y el asteroide
          crushed = true;

          // Llama a jumpingPixels para simular una explosión
          const explosion = jumpingPixels(spacecraftX, spacecraftY, -1.5); // -1.5 para una explosión hacia arriba
          // Agrega los píxeles de la explosión al array engineParticles para que se dibujen
          engineParticles.push(...explosion);

          // Elimina el asteroide
          asteroids.splice(i, 1);
          i--; // Ajusta el índice para evitar problemas con el ciclo
          return; // Sale de la función inmediatamente para evitar verificar más colisiones en este fotograma
        }
      }
    }
  }
}

const asteroidsCollisions = () => {
  // Actualiza la posición de los asteroides y verifica las colisiones entre ellos
  for (let i = 0; i < asteroids.length; i++) {
    const asteroidA = asteroids[i];

    for (let j = i + 1; j < asteroids.length; j++) {
      const asteroidB = asteroids[j];

      // Verifica la colisión entre asteroidA y asteroidB
      if (
        asteroidA.x < asteroidB.x + asteroidB.size &&
        asteroidA.x + asteroidA.size > asteroidB.x &&
        asteroidA.y < asteroidB.y + asteroidB.size &&
        asteroidA.y + asteroidA.size > asteroidB.y
      ) {
        // Colisión entre asteroidA y asteroidB

        // Calcula el ángulo entre los asteroides
        const angle = Math.atan2(asteroidB.y - asteroidA.y, asteroidB.x - asteroidA.x);

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
        const explosionA = jumpingPixels(asteroidA.x, asteroidA.y, -1.5); // -1.5 para una explosión hacia arriba
        const explosionB = jumpingPixels(asteroidB.x, asteroidB.y, -1.5); // -1.5 para una explosión hacia arriba

        // Agrega los píxeles de la explosión al array engineParticles para que se dibujen
        engineParticles.push(...explosionA, ...explosionB);

        // Elimina los asteroides que colisionaron
        asteroids.splice(i, 1);
        asteroids.splice(j - 1, 1);
        i--; // Ajusta el índice para evitar problemas con el ciclo
        break; // Sale del ciclo interno para evitar colisiones duplicadas
      }
    }

    // Verifica colisión de asteroides con el terreno
    const columnX = Math.floor(asteroidA.x / terrainUnitWidth);
    const columnY = Math.floor(asteroidA.y / terrainUnitHeight);

    if (
      columnX >= 0 &&
      columnX < surface.length &&
      columnY >= 0 &&
      columnY < surface[columnX].length &&
      surface[columnX][columnY] === pixelTypes.hole
    ) {
      // Colisión con el terreno
      asteroids.splice(i, 1); // Elimina el asteroide de la lista
      i--; // Ajusta el índice para evitar saltarse un asteroide en el siguiente ciclo

      // Llama a jumpingPixels para simular una explosión
      const explosionA = jumpingPixels(asteroidA.x, asteroidA.y, -1.5); // -1.5 para una explosión hacia arriba
      // Agrega los píxeles de la explosión al array engineParticles para que se dibujen
      engineParticles.push(...explosionA);

      // Crea un objeto para representar el píxel que salta
      jumpingPixels(asteroidA.x, asteroidA.y, -1.5, asteroidA.size); // Velocidad inicial hacia arriba (ajusta según tu necesidad)
    } else {
      // Actualiza la posición del asteroide si no ha colisionado con el terreno
      asteroidA.x += asteroidA.vx;
      asteroidA.y += asteroidA.vy;
    }
  }
}

// Comprueba que la nave haya recogido el objeto de combustible y le suma puntos de combustible
function checkFuelCollision(spacecraftX, spacecraftY, fuelItems, fuel) {
  const spacecraftBounds = {
    left: spacecraftX,
    right: spacecraftX + pixelSizeShip * spacecraftShape[0].length,
    top: spacecraftY,
    bottom: spacecraftY + pixelSizeShip * spacecraftShape.length,
  };

  for (let i = 0; i < fuelItems.length; i++) {
    const fuelItem = fuelItems[i];
    const fuelItemBounds = {
      left: fuelItem.x,
      right: fuelItem.x + fuelItem.size * fuelItem.shape[0].length,
      top: fuelItem.y,
      bottom: fuelItem.y + fuelItem.size * fuelItem.shape.length,
    };

    // Verifica si hay colisión entre la nave y el objeto de combustible
    if (
      spacecraftBounds.left < fuelItemBounds.right &&
      spacecraftBounds.right > fuelItemBounds.left &&
      spacecraftBounds.top < fuelItemBounds.bottom &&
      spacecraftBounds.bottom > fuelItemBounds.top
    ) {
      if (!fuelItem.collected) {
        // La nave ha recogido el objeto de combustible
        fuel += incrementFuelItem; // Suma 20 puntos de combustible
        fuelItem.collected = true; // Marca el objeto de combustible como recogido
      }
    }
  }
}

//#############################
//#
//#   SHIP UPDATE AND LOGIC
//#
//#
//#############################

function updateSpacecraft() {
  // Aplicar gravedad lunar
  velocityY += incrementVelocityY; // Ajusta este valor según la gravedad lunar deseada
  rotationSpeed = 0.2; // Ajusta este valor según la velocidad de rotación deseada
  rotationAngle = 0; // Ángulo de rotación inicial

  // Actualizar posición de la nave
  spacecraftX += velocityX;
  spacecraftY += velocityY;

  // Controlar cuando la nave ha salido por el lado izquierdo del lienzo
  let canvasWidth = canvas.width; // Coloca la nave en el lado derecho
  if (spacecraftX < 0) {
    // La nave ha salido por el lado izquierdo del lienzo
    spacecraftX = canvasWidth
  } else if (spacecraftX > canvas.width) {
    // La nave ha salido por el lado derecho del lienzo
    spacecraftX = 0; // Coloca la nave en el lado izquierdo
  }

  // Actualizar la rotación de la nave según las teclas izquierda y derecha
  if (leftKeyPressed) {
    rotationAngle -= rotationSpeed;
  }
  if (rightKeyPressed) {
    rotationAngle += rotationSpeed;
  }

  // Actualiza el valor del elemento progress para FUEL
  const hudFuel = document.getElementById('hud-fuel');
  hudFuel.value = fuel;
  // change the color of the hud-fuel component if fuel is 0
  if (fuel === 0) {
    hudFuel.classList('hud-fuel__empty')
  }

  // Calcular los componentes de la fuerza de propulsión
  const thrustX = Math.sin(rotationAngle) * engineHorizontalPower; // Ajusta la fuerza según la potencia deseada
  const thrustY = -Math.cos(rotationAngle) * engineVerticalPower; // Ajusta la fuerza según la potencia deseada

  // Aplicar la fuerza de propulsión cuando se presiona la flecha arriba
  if (upKeyPressed && fuel > 0 && !crushed && !crashed && !landed) {
    velocityX += thrustX;
    velocityY += thrustY;
    fuel -= crushed ? 0.3 : 0.1; // Ajusta este valor según el consumo de combustible
  }

  shipCollisionsWithTerrain()

  shipCollisionsWithAsteroids()

  asteroidsCollisions()

  checkFuelCollision(spacecraftX, spacecraftY, fuelItems, fuel);

  // Aplicar la fuerza de propulsión cuando se presiona la flecha arriba
  if (upKeyPressed && fuel > 0) {
    velocityX += thrustX;
    velocityY += thrustY;
    fuel -= 0.1; // Ajusta este valor según el consumo de combustible

    // Agregar píxeles del escape del motor
    for (let i = 0; i < 5; i++) { // Agrega 5 píxeles en cada impulso
      const particle = {
        x: spacecraftX + 6,
        y: spacecraftY + 10, // Posición en la parte inferior de la nave
        velocityX: (Math.random() - 0.5) * 0.2, // Velocidad horizontal aleatoria
        velocityY: Math.random() * 0.5 + 0.2, // Velocidad vertical aleatoria hacia abajo
        size: engineParticleSize, // Tamaño fijo de los píxeles del escape del motor
        lifespan: lifespan, // Vida aleatoria
      };
      updateEngineParticles()

      engineParticles.push(particle);
    }
  }

  // Si la nave ha aterrizado, asegúrate de que la velocidad horizontal también sea 0
  if (landed || crashed) {
    velocityX = 0;
  }

  // Verificar si la nave ha salido de la pantalla
  if (spacecraftY > canvas.height) {
    spacecraftY = canvas.height;
    velocityY = 0;
  }

  // Actualizar la posición y orientación de la nave
  context.save();
  context.translate(spacecraftX, spacecraftY);
  context.rotate(rotationAngle);
  drawSpacecraft(context, 0, 0); // Dibuja la nave en la posición (0, 0) relativa a la nave girada
  context.restore();

  // Actualizar y dibujar los píxeles del escape del motor
  for (let i = 0; i < engineParticles.length; i++) {
    const particle = engineParticles[i];

    // Actualizar posición
    particle.x += particle.velocityX;
    particle.y += particle.velocityY;

    // Reducir la vida útil y eliminar los píxeles si su vida llega a cero
    particle.lifespan--;

    if (particle.lifespan <= 0) {
      engineParticles.splice(i, 1);
      i--;
    }

    // Dibujar el píxel del escape del motor
    context.fillStyle = particle.color;
    context.fillRect(particle.x, particle.y, particle.size, particle.size);
  }
}

//#############################
//#
//#   HUD
//#
//#
//#############################

// DRAW HUD
function drawHUD() {
  const hud = document.getElementById('hud');
  const dataPlaying = `<span>Fuel: ${fuel.toFixed(2)}<br />
                      Falling velocity: ${velocityY - 0 ? velocityY.toFixed(2) : 0}<br />
                      Position: ${spacecraftX.toFixed(2)}, ${spacecraftY.toFixed(2)}<br />
                      Flight time: ${flightTime.toFixed(2)} seconds</span>`;
  // const dataPlaying = `<span>Fuel: ${fuel.toFixed(2)}<br />Falling velocity: ${velocityY - 0 ? velocityY.toFixed(2) : 0}<br />Position: ${spacecraftX.toFixed(2)}, ${spacecraftY.toFixed(2)}</span>`;
  const dataLanded = `<span class="land-success">¡Aterrizaje exitoso!</span>`;
  const dataForceLanded = `<span class="land-success">¡Aterrizaje exitoso pero con daños!</span>`;
  const dataCrashed = `<span class="land-fail">¡Demasiado rápido!</span>`;
  const dataCrushed = `<span class="land-fail">¡Derribado por un meteorito!</span>`;
  const dataNoFuel = `<span class="land-fail">¡Sin combustible!</span>`;
  // termina el juego
  if (landed && !crushed) {
    hud.innerHTML = dataLanded;
  } else if (landed && crushed) {
    hud.innerHTML = dataForceLanded
  } else if (crashed) {
    hud.innerHTML = dataCrashed;
  } else if (crushed) {
    hud.innerHTML = dataCrushed;
  } else if (fuel <= 0) {
    hud.innerHTML = dataNoFuel;
  } else {
    hud.innerHTML = dataPlaying;
  }
}

// DRAW SPEED COUNTER ON CANVAS
function drawSpeed(context) {
  context.font = "30px Arial";
  context.fillStyle = "white";

  // Coloca el texto en la esquina superior derecha
  const x = context.canvas.width - 220; // Ajusta el valor para mover el texto hacia la izquierda o derecha
  const y = 30; // Ajusta el valor para mover el texto hacia arriba o abajo

  context.fillText(`Propulsion: ${velocityY < 0 ? Math.abs(velocityY.toFixed(2)) : 0}`, x, y);
  // if the velocityY is greater than 0 turn text into red

}
// DRAW TIME COUNTER ON CANVAS
function drawTime(context) {
  context.font = "30px Arial";
  context.fillStyle = "white";
  context.fillText(`Time: ${elapsedTime.toFixed(2)}s`, 10, 30);
}
// Function to display "PAUSED" on the canvas.
function drawPausedText(text) {
  context.font = "30px Arial";
  context.fillStyle = "white";
  context.fillText(text, canvas.width / 2 - 60, canvas.height / 2);
}

// Function to display text on the canvas.
function drawTextOnScreen(text) {
  context.font = "30px Arial";
  context.fillStyle = "white";

  // Calcula las coordenadas para centrar el texto en el eje x
  const textWidth = context.measureText(text).width;
  const x = (canvas.width - textWidth) / 2;

  // Calcula las coordenadas para colocar el texto un poco arriba del centro
  const y = canvas.height / 2 - 30; // 30 es la mitad de la altura de la fuente (30px en este caso)

  context.fillText(text, x, y);
}

function drawFinalScore() {
  context.font = "30px Arial";
  context.fillStyle = "yellow";
  // context.fillText(`Time: ${elapsedTime.toFixed(2)}s`, 10, 30);
  const finalScore = `${elapsedTime.toFixed(2)}s`
  context.fillText(finalScore, canvas.width / 2 - 30, canvas.height / 2);
}

//#############################
//#
//#   GAMELOOP()
//#
//#
//#############################

// GAME LOOP
function gameLoop() {
  // Limpia el lienzo solo si el juego no está pausado
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (!gamePaused) {
    // Actualiza el tiempo de vuelo solo si el juego no está pausado
    if (!gamePaused && !landed && !crashed && !crushed) {
      flightTime += 1 / 60; // Asumiendo 60 cuadros por segundo
    }

    if (!isGameOver && !landed && !crashed) {
      // Calcular el tiempo transcurrido solo si el juego está en curso
      if (!startTime) {
        startTime = new Date();
      } else {
        const currentTime = new Date();
        elapsedTime = (currentTime - startTime) / 1000; // Convertir a segundos

        // Aumenta asteroidProbability cada N segundos
        if (elapsedTime > asteroidProbabilityIncrementTime) {
          asteroidProbability += asteroidProbabilityIncrement;
          // startTime = currentTime; // Reinicia el tiempo de inicio
        }
      }
    }
    // Dibujar el tiempo en el canvas
    drawTime(context);
    // Dibujar la propulsion en el canvas:
    drawSpeed(context);
    // Dibuja el HUD
    drawHUD();

    // Generar un nuevo objeto de fuel si no hay objetos de fuel en pantalla
    if (!fuelItems.some(fuelItem => !fuelItem.collected)) {
      createFuelItem();
    }
    // Mover y dibujar objetos de fuel
    for (const fuelItem of fuelItems) {
      if (!fuelItem.collected) {
        fuelItem.y += fuelVelocityY; // Puedes ajustar la velocidad como desees
        drawFuelItem(context, fuelItem); // Dibuja el objeto de fuel
        fuelItemsToKeep.push(fuelItem); // Agrega los objetos de combustible que no se deben eliminar
      }
    }
    // fuelItems = [...fuelItemsToKeep]; // Reemplaza el array original
    // Borrar objetos de fuel si colisionan con el terreno
    fuelItems.forEach((fuelItem, index) => {
      if (fuelItem.collected || fuelItem.y >= canvas.height) {
        fuelItems.splice(index, 1); // Elimina el objeto de combustible
        fuel += fuelQuantityToAdd
      }
    });
    // Añade N puntos de fuel al colisionar con el objeto de fuel
    function collectFuelItem(fuelItem) {
      if (!fuelItem.collected && isCollidingWith(fuelItem)) {
        fuelItem.collected = true;
        fuel += 50; // Incrementamos la cantidad de combustible en 50 puntos a nivel global
      }
    }

    // Función para verificar colisiones entre la nave y un objeto de combustible
    function isCollidingWith(fuelItem) {
      // Coordenadas de la nave y el objeto de combustible
      const naveX = nave.x;
      const naveY = nave.y;
      const fuelX = fuelItem.x;
      const fuelY = fuelItem.y;

      // Tamaño de la nave y el objeto de combustible
      const naveWidth = nave.width;
      const naveHeight = nave.height;
      const fuelWidth = fuelItem.width;
      const fuelHeight = fuelItem.height;

      // Definir la distancia mínima para considerar una colisión (puede ajustarse según tus necesidades)
      const minDistanceX = (naveWidth + fuelWidth) / 2;
      const minDistanceY = (naveHeight + fuelHeight) / 2;

      // Calcular la distancia entre el centro de la nave y el centro del objeto de combustible
      const deltaX = Math.abs(naveX - fuelX);
      const deltaY = Math.abs(naveY - fuelY);

      // Si la distancia en ambos ejes es menor que la distancia mínima, hay una colisión
      if (deltaX < minDistanceX && deltaY < minDistanceY) {
        return true; // Colisión detectada
      }

      return false; // No hay colisión
    }

    // Crear asteroides con cierta probabilidad
    if (Math.random() < asteroidProbability) {
      createAsteroid();
    }

    // Mover asteroides y eliminarlos si están fuera del lienzo
    for (let i = 0; i < asteroids.length; i++) {
      const asteroid = asteroids[i];
      asteroid.x += asteroid.vx;
      asteroid.y += asteroid.vy;

      // Verificar si el asteroide está fuera del lienzo
      if (asteroid.y > canvas.height) {
        // Eliminar el asteroide si está fuera del lienzo para evitar que consuma recursos
        asteroids.splice(i, 1);
        i--; // Ajusta el índice para evitar saltarse un asteroide en el siguiente ciclo
      }
    }

    // Dibuja los asteroides en el lienzo
    for (const asteroid of asteroids) {
      drawAsteroid(context, asteroid);
    }

    // Dibuja el terreno lunar
    drawTerrain(context, surface);

    // Actualiza y dibuja la nave espacial
    updateSpacecraft();
    drawSpacecraft(context, spacecraftX, spacecraftY);

    // Llama al siguiente cuadro de animación
    requestAnimationFrame(gameLoop);
    // stop the ship and the gameloop if the game is over
    if (landed || crashed) {
      velocityX = 0;
      velocityY = 0;
      // stop the game loop
      return;
    }

  } else {
    fuel === 100 ?
      // mostrar boton para comenzar
      drawPausedText('SPACEBAR') :
      // mostrar PAUSED cuando pausamos el juego
      drawPausedText('PAUSED')
    // requestAnimationFrame(gameLoop)
  }
}

//#############################
//#
//#   RUN GAME
//#
//#
//#############################

// Inicia el juego
const canvas = document.getElementById('gameCanvas'); // Obtén el elemento canvas
const context = canvas.getContext('2d'); // Obtén el contexto de dibujo 2D
// detectViewportSize()
const surface = generateTerrain(canvas.width / terrainUnitWidth, canvas.height / terrainUnitHeight); // Genera el terreno lunar
const hud = document.getElementById('hud');
// Inicia el gameLoop
gameLoop();

//#############################
//#
//#   UTILS
//#
//#
//#############################

// Reiniciar el juego
function restartGame() {
  // FORCE reload page
  location.reload(true);
}

// DETECT THE HEIGHT AND THE WIDTH OF THE VIEWPORT
const detectViewportSize = (canvas) => {
  const viewportWidth = window.innertHeight
  const viewportHeight = window.innerWidth
  // add the property width and height to the canvas
  canvas.setAttribute("style", `width: ${viewportWidth}px; height: ${viewportHeight}; aspect-ratio: 16/9;`);
}
