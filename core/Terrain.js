import {
  terrainUnitWidth,
  terrainUnitHeight,
  maxHoleWidth,
  minHoleWidth,
  peakChance,
  holeChance,
  // terrainColor,
  // spacecraftWidth,
  // spacecraftX,
  // spacecraftY,
  // velocityX,
  // velocityY,
  // incrementVelocityY,
  // fuel,
  // incrementFuelItem,
  // spacecraftHeight,
  // engineParticles,
  // engineHorizontalPower,
  // propulsionColors,
  // engineVerticalPower,
  // asteroidProbability,
  // asteroidProbabilityIncrement,
  // asteroidProbabilityIncrementTime,
  // asteroidAverageSize,
  // minAsteroidSize,
  // maxAsteroidSize,
  // asteroidColor,
  // asteroidVelocityX,
  // asteroidVelocityY,
  // pixelSizeAsteroid,
  // initialParticleLifespan,
  // lifespan,
  // explosionNumberPixels,
  // explosionParticleSize,
  // maxLandingSpeed,
  // landed,
  // crashed,
  // crushed,
  // flightTime,
  // elapsedTime,
  // startTime,
  // isGameOver,
  // gamePaused,
  // leftKeyPressed,
  // rightKeyPressed,
  // upKeyPressed,
  pixelTypes
} from '../main.js'

// GENERATE TERRAIN
export function generateTerrain(width, height) {
  const surface = [];
  const maxHeight = Math.floor(height * 0.7); // Altura máxima de las montañas
  const minHeight = Math.floor(height * 0.3); // Altura mínima de los huecos
  const midHeight = Math.floor((maxHeight + minHeight) / 1.2); // Altura media

  for (let x = 0; x < width; x++) {
    const column = [];
    for (let y = 0; y < height; y++) {
      let terrainType = pixelTypes.space; // Espacio en blanco en el aire por defecto

      // Genera montañas
      if (Math.random() < peakChance) {
        const heightValue = Math.floor(Math.random() * (maxHeight - midHeight)) + midHeight;
        if (y < heightValue) {
          terrainType = pixelTypes.mountain; // Representa una montaña
        }
      }

      // Genera huecos
      if (Math.random() < holeChance) {
        const depthValue = Math.floor(Math.random() * (midHeight - minHeight)) + minHeight;
        const holeWidth = Math.floor(Math.random() * (maxHoleWidth - minHoleWidth + 1)) + minHoleWidth;

        if (y >= midHeight && y < midHeight + depthValue && x >= holeWidth && x < width - holeWidth) {
          terrainType = pixelTypes.hole; // Representa un hueco
        }
      }

      column.push(terrainType);
    }
    surface.push(column);
  }

  return surface;
}

// DRAW TERRAIN
export function drawTerrain(context, surface, terrainColor) {
  // const terrainGenerator = require('./terrain-generator.js')
  // const terrain = terrainGenerator.generateConnectedMountainsTerrain(800,600,20,1)

  for (let x = 0; x < surface.length; x++) {
    for (let y = 0; y < surface[x].length; y++) {
      if (surface[x][y] === '-') {
        context.fillStyle = terrainColor; // Color del suelo
        context.fillRect(x * terrainUnitWidth, y * terrainUnitHeight, terrainUnitWidth, terrainUnitHeight);
        // context.fillRect(terrain);
      }
    }
  }
}