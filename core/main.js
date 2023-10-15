import Controls from './PlayerControl.js';
import TerrainGenerator from './TerrainGenerator.js';
import PixelExplosion from './PixelExplosion.js';
import HUDController from './HUDController.js';
import Spacecraft from './Spacecraft.js';
import Asteroid from './Asteroid.js';
import FuelItem from './FuelItem.js';
import Physics from './Physics.js';
import {
  terrainUnitWidth,
  terrainUnitHeight,
  peakChance,
  holeChance,
  terrainColor,
  flightTime,
  elapsedTime,
  startTime,
  isGameOver,
  pixelTypes,
  engineParticles,
  engineParticleSize,
  engineHorizontalPower,
  propulsionColors,
  engineVerticalPower,
  asteroidProbability,
  asteroidProbabilityIncrement,
  asteroidProbabilityIncrementTime,
  pixelSizeAsteroid,
  initialParticleLifespan,
  lifespan,
  explosionNumberPixels,
  explosionParticleSize,
  maxLandingSpeed,
  landed,
  crashed,
  crushed,
} from './GameVariables.js';

// Crear instancias de las clases
const keyboardControl = new Controls.KeyboardControl();
const mouseControl = new Controls.MouseControl();
const touchControl = new Controls.TouchControl();

const spacecraftPhysics = new Physics.SpacecraftPhysics(
  spacecraft, // Asegúrate de que la variable spacecraft esté definida.
  terrainUnitWidth,
  terrainUnitHeight,
  surface, // Asegúrate de que la variable surface esté definida.
  engineParticles,
  engineHorizontalPower,
  engineVerticalPower,
  fuel, // Asegúrate de que la variable fuel esté definida.
  crushed,
  crashed,
  landed,
  maxLandingSpeed,
  jumpingPixels // Asegúrate de que la función jumpingPixels esté definida.
);
const asteroidPhysics = new Physics.AsteroidPhysics(
  asteroids, // Asegúrate de que la variable asteroids esté definida.
  terrainUnitWidth,
  terrainUnitHeight,
  surface // Asegúrate de que la variable surface esté definida.
);

// Crear una instancia de HUDController
const hudController = new HUDController();

// Función para reiniciar el juego
const restart = keyboardControl.restartGame();

// Crear una instancia de PixelExplosion
const pixelExplosion = new PixelExplosion(explosionNumberPixels, explosionParticleSize);

// CREATE ASTEROID
// Ahora puedes crear instancias de la clase Asteroid en otros archivos
const asteroid = new Asteroid(canvas.width, canvas.height); // Asegúrate de que las variables canvas estén definidas.

// CREATE TERRAIN
// Clase para el generador de terreno
const terrainGenerator = new TerrainGenerator(800, 600);
terrainGenerator.drawTerrain(context, terrainColor, terrainUnitWidth, terrainUnitHeight);

// CREATE FUEL ITEMS
// Para crear un objeto de combustible y dibujarlo:
const fuelItem = new FuelItem(canvas.width, canvas.height); // Asegúrate de que las variables canvas estén definidas.
// Luego, en tu ciclo de juego, puedes llamar a fuelItem.draw(context) y fuelItem.update() para dibujar y actualizar el objeto de combustible.

// CREATE SPACECRAFT
// Para crear una nave espacial y dibujarla:
const spacecraft = new Spacecraft(
  canvas.width, // Asegúrate de que la variable canvas esté definida.
  canvas.height, // Asegúrate de que la variable canvas esté definida.
  pixelSizeShip // Asegúrate de que la variable pixelSizeShip esté definida.
);
// Luego, en tu ciclo de juego, puedes llamar a spacecraft.draw(context, fuel, landed, crushed, crashed) para dibujar la nave y utilizar spacecraft.moveLeft(), spacecraft.moveRight(), spacecraft.moveUp(), y spacecraft.moveDown() para controlar su movimiento.

// Crear una explosión en las coordenadas (x, y) con una velocidad vertical (velocityY)
pixelExplosion.createExplosion(x, y, velocityY); // Asegúrate de que las variables x, y y velocityY estén definidas.

// Agregar eventos de teclado, ratón y táctiles
document.addEventListener("keydown", (event) => keyboardControl.handleKeyDown(event));
document.addEventListener("keyup", (event) => keyboardControl.handleKeyUp(event));
document.addEventListener("mousedown", (event) => mouseControl.handleMouseDown(event));
document.addEventListener("mouseup", (event) => mouseControl.handleMouseUp(event));
document.addEventListener("mousemove", (event) => mouseControl.handleMouseMove(event));
document.addEventListener("touchstart", (event) => touchControl.handleTouchStart(event));

// GAME LOOP
function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (!gamePaused) {
    updateGameLogic(); // Actualiza la lógica del juego
    drawGameObjects(); // Dibuja los objetos del juego
    requestAnimationFrame(gameLoop); // Llama al siguiente cuadro de animación
  } else {
    drawPausedText('PAUSED'); // Dibuja "PAUSED" en el lienzo cuando el juego está pausado
  }
}

function updateGameLogic() {
  // Actualiza el tiempo de vuelo
  if (!landed && !crashed && !crushed) {
    flightTime += 1 / 60; // Asumiendo 60 cuadros por segundo
  }

  // Calcula el tiempo transcurrido
  if (!isGameOver && !landed && !crashed) {
    if (!startTime) {
      startTime = new Date();
    } else {
      const currentTime = new Date();
      elapsedTime = (currentTime - startTime) / 1000; // Convertir a segundos

      // Aumenta la probabilidad de asteroides cada N segundos
      if (elapsedTime > asteroidProbabilityIncrementTime) {
        asteroidProbability += asteroidProbabilityIncrement;
        startTime = currentTime; // Reinicia el tiempo de inicio
      }
    }
  }

  // Otras actualizaciones lógicas del juego aquí

  // Verifica colisiones entre la nave y los objetos de combustible
  for (const fuelItem of fuelItems) {
    collectFuelItem(fuelItem);
  }

  // Mueve y elimina asteroides fuera del lienzo
  for (let i = 0; i < asteroids.length; i++) {
    const asteroid = asteroids[i];
    asteroid.update();

    if (asteroid.y > canvas.height) {
      asteroids.splice(i, 1);
      i--;
    }
  }

  // Otras actualizaciones lógicas del juego aquí

  // Actualizar la explosión en píxeles
  pixelExplosion.updateExplosion();

  // Actualizar las partículas del motor
  pixelExplosion.updateEngineParticles(initialParticleLifespan, propulsionColors);

  // Actualiza y dibuja la nave espacial
  spacecraft.moveLeft();
  spacecraft.moveRight();
  spacecraft.moveUp();
  spacecraft.moveDown();
}

function drawGameObjects() {
  // Dibuja el tiempo en el canvas
  drawTime(context);

  // Dibuja el HUD
  hudController.updateHUD({ fuel, velocityY, spacecraftX, spacecraftY, flightTime, landed, crushed, crashed });

  // Dibuja el terreno lunar
  drawTerrain(context, surface);

  // Dibuja objetos de combustible
  for (const fuelItem of fuelItems) {
    if (!fuelItem.collected) {
      fuelItem.update();
      drawFuelItem(context, fuelItem);
    }
  }

  // Dibuja asteroides en el lienzo
  for (const asteroid of asteroids) {
    drawAsteroid(context, asteroid);
  }

  // Dibuja la explosión en píxeles en el contexto del lienzo
  pixelExplosion.drawExplosion(context);

  // Dibuja y actualiza la nave espacial
  spacecraft.draw(context, fuel, landed, crushed, crashed);

  // Detiene la nave y el game loop si el juego ha terminado
  if (landed || crashed) {
    velocityX = 0;
    velocityY = 0;
  }
}

// Inicia el juego y ejecuta el game loop
const canvas = document.getElementById('gameCanvas'); // Obtén el elemento canvas
const context = canvas.getContext('2d'); // Obtén el contexto de dibujo 2D

// Asigna el terreno lunar generado a la superficie
const surface = generateTerrain(canvas.width / terrainUnitWidth, canvas.height / terrainUnitHeight);

gameLoop(); // Comienza el game loop

// Este código organiza la lógica del juego de una manera más estructurada y fácil de mantener.
// Las funciones `updateGameLogic` y `drawGameObjects` se encargan de actualizar la lógica del juego
// y dibujar los objetos del juego, respectivamente, lo que hace que el código sea más legible y modular.
// Además, se ha movido la inicialización de las variables de juego al método `restartGame` para facilitar
// la reinicialización del juego.

