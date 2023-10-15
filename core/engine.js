
// Variables globales
const terrainUnitWidth = 2; // Ancho del carácter
const terrainUnitHeight = 2; // Altura del carácter
const peakChance = 0.0; // Probabilidad de tener una montaña
const holeChance = 0.6; // Probabilidad de tener un hueco
const spacecraftWidth = 8;
const spacecraftHeight = 8;
const maxLandingSpeed = 1.5; // Velocidad máxima de aterrizaje
let landed = false; // Estado de aterrizaje
let crashed = false; // Estado de colisión
let crushed = false; // Estado de aplastamiento
const engineParticles = []; // Almacena los píxeles del escape del motor
const engineParticleSize = 4; // Tamaño de los píxeles del escape del motor
const engineHorizontalPower = 0.1; // Fuerza de propulsión horizontal
let engineVerticalPower = 0.11; // Fuerza de propulsión vertical
const asteroidProbability = 0.08
const asteroidAverageSize = 10
const minAsteroidSize = 12;
const maxAsteroidSize = 20;
const asteroidColor = '#D55'
const asteroidVelocityX = 0.6
const asteroidVelocityY = 0.6
const propulsionColors = ['#FFA', '#3FF', '#FD3', '#FF4400']
const terrainColor = '#842'
const initialParticleLifespan = 40
const lifespan = 30
const explosionNumberPixels = 15
const explosionParticleSize = 5
let pixelSizeAsteroid = null

let flightTime = 0; // Tiempo de vuelo en segundos
let elapsedTime = 0;
let startTime;
let isGameOver = false;
// const lifespan = Math.random() * 30 + 10

// GENERATE TERRAIN
function generateTerrain(width, height) {
  const surface = [];
  const maxHeight = Math.floor(height * 0.7); // Altura máxima de las montañas
  const minHeight = Math.floor(height * 0.3); // Altura mínima de los huecos
  const midHeight = Math.floor((maxHeight + minHeight) / 1.2); // Altura media

  for (let x = 0; x < width; x++) {
    const column = [];
    for (let y = 0; y < height; y++) {
      let terrainType = ' '; // Espacio en blanco en el aire por defecto

      // Genera montañas
      if (Math.random() < peakChance) {
        const heightValue = Math.floor(Math.random() * (maxHeight - midHeight)) + midHeight;
        if (y < heightValue) {
          terrainType = '+'; // Representa una montaña
        }
      }

      // Genera huecos
      if (Math.random() < holeChance) {
        const depthValue = Math.floor(Math.random() * (midHeight - minHeight)) + minHeight;
        if (y >= midHeight && y < midHeight + depthValue) {
          terrainType = '-'; // Representa un hueco
        }
      }

      column.push(terrainType);
    }
    surface.push(column);
  }

  return surface;
}

// DRAW TERRAIN
function drawTerrain(context, surface) {
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

// CREATE ASTEROIDS
const asteroids = [];

const asteroidShape = [
  [' ', '#', '#', ' '],
  ['#', '#', '#', '#'],
  ['#', '#', '#', '#'],
  [' ', '#', '#', ' '],
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
  if (asteroids.length > 40) {
    asteroids.splice(0, 10);
  }
}

function drawAsteroid(context, asteroid) {
  const thisAsteroidSize = asteroid.size;
  context.fillStyle = asteroidColor; // Color de los asteroides
  for (let row = 0; row < asteroid.shape.length; row++) {
    for (let col = 0; col < asteroid.shape[0].length; col++) {
      const pixel = asteroid.shape[row][col];
      if (pixel === '#') {
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

// DRAW SHIP
// Define la forma de la nave espacial como una matriz de píxeles
const spacecraftShape = [
  [' ', ' ', '#', ' ', ' '],
  [' ', ' ', '#', ' ', ' '],
  [' ', '#', '#', '#', ' '],
  [' ', '#', ' ', '#', ' '],
  [' ', '#', '#', '#', ' '],
  ['#', '#', ' ', '#', '#'],
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
      if (pixel === '#') {
        context.fillRect(x + col * pixelSizeShip, y + row * pixelSizeShip, pixelSizeShip, pixelSizeShip);
      }
    }
  }
}

// PHYSICS AND CONTROLS
let spacecraftX = 100; // Posición horizontal inicial de la nave
let spacecraftY = 50; // Position vertical inicial de la nave 
let velocityX = 0;
let velocityY = 0;
let fuel = 100;

// Variables para rastrear las teclas presionadas por el jugador
let gamePaused = true; // Inicia el juego en pausa
let leftKeyPressed = false; // Tecla A
let rightKeyPressed = false; // Tecla D
let upKeyPressed = false; // Tecla W

// Agregar eventos de teclado para detectar las teclas presionadas
document.addEventListener("keydown", function (event) {
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
      pauseGame()
    }
  } else if (event.key === "r" || event.key === "R") {
    // Tecla R para reiniciar el juego
    restartGame();
  }
});

// Agregar eventos de teclado para detectar las teclas que dejan de ser presionadas
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

// Función jumpingPixels para simular una explosión de 5 píxeles
function jumpingPixels(x, y, velocityY) {
  const numPixels = explosionNumberPixels; // Cantidad de píxeles en la explosión
  let explosionPixels = []; // Píxeles de la explosión

  for (let i = 0; i < numPixels; i++) {
    const pixel = {
      x: x,
      y: y,
      velocityX: (Math.random() - 0.5) * 2, // Velocidad horizontal aleatoria
      velocityY: velocityY + (Math.random() - 0.5) * 2, // Velocidad vertical aleatoria con base en la proporcionada
      color: getRandomColor(), // Color aleatorio
      size: Math.random() * explosionParticleSize + 1, // Tamaño aleatorio
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

    if (asteroid.shape[pixelY] && asteroid.shape[pixelY][pixelX] === '#') {
      return true; // El píxel está dentro del asteroide
    }
  }

  return false; // El píxel no está dentro del asteroide
}

function updateSpacecraft() {
  // Aplicar gravedad lunar
  velocityY += 0.1; // Ajusta este valor según la gravedad lunar deseada
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

  // Verificar colisiones de la nave con el suelo lunar
  const columnX = Math.floor(spacecraftX / terrainUnitWidth);
  const columnY = Math.floor(spacecraftY / terrainUnitHeight);
  // Verificar si la nave está dentro del terreno lunar
  if (columnX >= 0 && columnX < surface.length && columnY >= 0 && columnY < surface[columnX].length) {
    if (surface[columnX][columnY] === '-') {
      // Comprobar si la velocidad de la nave es demasiado alta para aterrizar
      if (Math.abs(velocityX) > maxLandingSpeed || Math.abs(velocityY) > maxLandingSpeed) {
        // Colisión con el suelo
        isGameOver = true;
        crashed = true; // Establecer el estado de aterrizaje
        engineVerticalPower = 0
        velocityY = 0;
        console.log("¡Nave accidentada!"); // Puedes mostrar un mensaje o realizar otras acciones aquí

        // Llama a jumpingPixels para simular una explosión
        const explosion = jumpingPixels(spacecraftX, spacecraftY, -1.5); // -1.5 para una explosión hacia arriba
        // Agrega los píxeles de la explosión al array engineParticles para que se dibujen
        engineParticles.push(...explosion);
      } else {
        // Aterrizaje en el suelo
        landed = crashed ? false : true; // Establecer el estado de aterrizaje
        velocityY = 0;
        console.log("¡Aterrizaje exitoso!"); // Puedes mostrar un mensaje o realizar otras acciones aquí
      }
      velocityY = 0;
    }
  }

  // Verificar colisiones de nave con asteroides
  for (let i = 0; i < asteroids.length; i++) {
    const asteroid = asteroids[i];

    // Verifica si algún píxel de la nave coincide con algún píxel del asteroide
    for (let row = 0; row < spacecraftShape.length; row++) {
      for (let col = 0; col < spacecraftShape[0].length; col++) {
        if (spacecraftShape[row][col] === '#' && isPixelInsideAsteroid(spacecraftX + col * pixelSizeShip, spacecraftY + row * pixelSizeShip, asteroid)) {
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
      surface[columnX][columnY] === '-'
    ) {
      // Colisión con el terreno
      asteroids.splice(i, 1); // Elimina el asteroide de la lista
      i--; // Ajusta el índice para evitar saltarse un asteroide en el siguiente ciclo

      // Crea un objeto para representar el píxel que salta
      jumpingPixels(asteroidA.x, asteroidA.y, -1.5); // Velocidad inicial hacia arriba (ajusta según tu necesidad)
    } else {
      // Actualiza la posición del asteroide si no ha colisionado con el terreno
      asteroidA.x += asteroidA.vx;
      asteroidA.y += asteroidA.vy;
    }
  }

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
  const dataCrushed = `<span class="land-fail">¡Aplastado por un meteorito!</span>`;
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
// DRAW TIME COUNTER ON CANVAS
function drawTime(context) {
  context.font = "30px Arial";
  context.fillStyle = "white";
  context.fillText(`Time: ${elapsedTime.toFixed(2)}s`, 10, 30);
}

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
      }
    }
    // Dibujar el tiempo en el canvas
    drawTime(context);
    // Dibuja el HUD
    drawHUD();

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
      drawPausedText('"SPACEBAR" TO START') :
      // mostrar PAUSED cuando pausamos el juego
      drawPausedText('PAUSED')
    // requestAnimationFrame(gameLoop)
  }
}

// Function to display "PAUSED" on the canvas.
function drawPausedText(text) {
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(text, canvas.width / 2 - 60, canvas.height / 2);
}

// Reiniciar el juego
function restartGame() {
  // Restablece todas las variables y estados del juego al estado inicial
  gamePaused = true;
  leftKeyPressed = false;
  rightKeyPressed = false;
  upKeyPressed = false;
  landed = false;
  crashed = false;
  crushed = false;
  fuel = 100;
  spacecraftX = 100;
  spacecraftY = 50;
  velocityX = 0;
  velocityY = engineVerticalPower;
  asteroids.length = 0;
  engineParticles.length = 0;
  // Regenera el terreno si es necesario
  surface = generateTerrain(canvas.width / terrainUnitWidth, canvas.height / terrainUnitHeight);
  // Limpia el lienzo
  context.clearRect(0, 0, canvas.width, canvas.height);
  // Dibuja el HUD inicial
  drawHUD();
}

// Inicia el juego
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext("2d");
const context = canvas.getContext('2d');
const surface = generateTerrain(canvas.width / terrainUnitWidth, canvas.height / terrainUnitHeight);
const hud = document.getElementById('hud');

gameLoop();

// DONE: Arreglar colision nave con asteroides
// TODO: Que el giro de la nave sea rotatorio en lugar de giro fijo a cada lado
// DONE: Crear asteroides de varios pixeles que se muevan por el mapa a diferente velocidad
// DONE: Centrar el propulsor con la nave
// TODO: Que al aterrizar la nave se quede en el suelo quieta
// TODO: Convertir en PWA
// TODO: Hacer Graficos
// DONE: Refactorizar el jumpingPixel para que genere la explosion al chocar contra el terreno, o la nave con l asteroide o el choque entre asteroides
// DONE: Poner contador de tiempo de nave en el aire, y que se pare cuando toca el suelo
// TODO: Quiza? Hacer que el mapa se desplace en scroll