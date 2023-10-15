// Función para generar Perlin Noise
function generatePerlinNoise(width, height, frequency, amplitude) {
  const noise = [];

  for (let x = 0; x < width; x++) {
    const column = [];

    for (let y = 0; y < height; y++) {
      const perlinValue = noise2D(x / frequency, y / frequency) * amplitude;
      column.push(perlinValue);
    }

    noise.push(column);
  }

  return noise;
}

// Función para suavizar el ruido usando interpolación lineal
function smoothNoise(noise, x, y) {
  const x0 = Math.floor(x);
  const x1 = x0 + 1;
  const y0 = Math.floor(y);
  const y1 = y0 + 1;

  const fracX = x - x0;
  const fracY = y - y0;

  const value00 = noise[x0][y0];
  const value01 = noise[x0][y1];
  const value10 = noise[x1][y0];
  const value11 = noise[x1][y1];

  const interpolateX0 = lerp(value00, value10, fracX);
  const interpolateX1 = lerp(value01, value11, fracX);

  return lerp(interpolateX0, interpolateX1, fracY);
}

// Función para generar un terreno con montañas conectadas
function generateConnectedMountainsTerrain(width, height, frequency, amplitude) {
  const noise = generatePerlinNoise(width, height, frequency, amplitude);
  const terrain = [];

  for (let x = 0; x < width; x++) {
    const column = [];

    for (let y = 0; y < height; y++) {
      const perlinValue = smoothNoise(noise, x, y);
      if (perlinValue > 0.5) {
        column.push('-'); // Representa una montaña
      } else {
        column.push(' '); // Espacio en blanco
      }
    }

    terrain.push(column);
  }

  return terrain;
}

// Función para generar un valor de ruido 2D pseudoaleatorio
function noise2D(x, y) {
  const n = x + y * 57;
  return Math.abs(Math.sin(n) * 43758.5453) % 1;
}

// Función para realizar interpolación lineal entre dos valores
function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}

// Uso de la función para generar el terreno
export const terrain = generateConnectedMountainsTerrain(canvas.width / terrainUnitWidth, canvas.height / terrainUnitHeight, 20, 1);

// generar el terreno en un canvas con el id "terrain"
const terrainCanvas = document.getElementById('terrain');
const terrainContext = terrainCanvas.getContext('2d');

// Función para dibujar el terreno en el canvas usando la variable terrain que contiene la ejecucion de la funcion generateConnectedMountainsTerrain
function drawTerrain() {
  for (let x = 0; x < terrain.length; x++) {
    for (let y = 0; y < terrain[x].length; y++) {
      if (terrain[x][y] === '-') {
        terrainContext.fillStyle = 'black';
        terrainContext.fillRect(x * terrainUnitWidth, y * terrainUnitHeight, terrainUnitWidth, terrainUnitHeight);
      }
    }
  }
}
drawTerrain();