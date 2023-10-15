//#################################
//#
//#   Abrupt game
//#   by Oscar Abad
//#   https://github.com/N3BB3Z4R
//#   october 2023
//#
//#################################

// ### IMPORTS ###
import { generateTerrain, drawTerrain } from "./Terrain.js"
import { createAsteroid, drawAsteroid } from "./Asteroid.js"
import { drawSpacecraft, spacecraftShape } from "./Spacecraft.js" // updateSpacecraft
import { isPixelInsideAsteroid, shipCollisionsWithTerrain, shipCollisionsWithAsteroids, asteroidsCollisions, checkFuelCollision } from './Collisions.js' // shipCollisionsWithAsteroids
import { drawHUD, drawSpeed, drawTime, drawPausedText, drawFuel, drawTextOnScreen, drawFinalScore } from './Hud.js'
import { jumpingPixels, updateEngineParticles, smokeCrashedShip } from './Particles.js'
import { drawFuelItem, createFuelItem } from './Fuel.js'
import { setupKeyboardControls, setupMouseControls, setupMobileControls, changeControlOption } from "./Controls.js"
import { constants, variables } from "./Config.js"
import { playThrust, playSfx } from './Audio.js'

// Llama a las funciones para configurar los controles
changeControlOption("keyboard") // Cambia la opción de control según tus necesidades
setupKeyboardControls(gameLoop)
setupMouseControls()
setupMobileControls()

//#############################
//#
//#   SHIP UPDATE AND LOGIC (da guerra)
//#
//#
//#############################

function updateSpacecraft() { // leftKeyPressed, rightKeyPressed, upKeyPressed, fuelItems) {

  // Aplicar gravedad lunar
  variables.velocityY += constants.incrementVelocityY // Ajusta este valor según la gravedad lunar deseada

  // Actualizar posición de la nave
  variables.spacecraftX += variables.velocityX
  variables.spacecraftY += variables.velocityY

  // Controlar cuando la nave ha salido por el lado izquierdo del lienzo
  let canvasWidth = canvas.width // Coloca la nave en el lado derecho
  if (variables.spacecraftX < 0) {
    // La nave ha salido por el lado izquierdo del lienzo
    variables.spacecraftX = canvasWidth
  } else if (variables.spacecraftX > canvas.width) {
    // La nave ha salido por el lado derecho del lienzo
    variables.spacecraftX = 0 // Coloca la nave en el lado izquierdo
  }

  // Actualizar la rotación de la nave según las teclas izquierda y derecha
  if (variables.leftKeyPressed) {
    variables.shipRotationAngle -= variables.shipRotationSpeed
    if (variables.shipRotationAngle < -0.4) {
      variables.shipRotationAngle = -0.4
    }
  } else if (variables.rightKeyPressed) {
    variables.shipRotationAngle += variables.shipRotationSpeed;
    // Limitar el ángulo de giro a 0.5
    if (variables.shipRotationAngle > 0.4) {
      variables.shipRotationAngle = 0.4;
    }
  } else if (!variables.leftKeyPressed && !variables.rightKeyPressed) {
    // actualizar dejar de rotar la nave si las teclas dejan de ser presionadas
    variables.shipRotationAngle = 0
  }

  // Actualiza el valor del elemento progress para FUEL
  const hudFuel = document.getElementById("hud-fuel")
  hudFuel.value = variables.fuel
  // change the color of the hud-fuel component if fuel is 0
  if (variables.fuel === 0) {
    hudFuel.classList("hud-fuel__empty")
  }

  // Calcular los componentes de la fuerza de propulsión
  const thrustX = Math.sin(variables.shipRotationAngle) * variables.engineHorizontalPower // Ajusta la fuerza según la potencia deseada
  const thrustY = -Math.cos(variables.shipRotationAngle) * variables.engineVerticalPower // Ajusta la fuerza según la potencia deseada

  // Aplicar la fuerza de propulsión cuando se presiona la flecha arriba
  if (variables.upKeyPressed && variables.fuel > 0 && !variables.crushed && !variables.crashed && !variables.landed) {
    variables.velocityX += thrustX
    variables.velocityY += thrustY
    variables.fuel -= variables.crushed ? 0.3 : 0.1 // Ajusta este valor según el consumo de combustible
  }

  shipCollisionsWithTerrain(canvas, surface, context)

  shipCollisionsWithAsteroids(surface, context)

  asteroidsCollisions(surface)

  checkFuelCollision(surface)

  // Aplicar la fuerza de propulsión cuando se presiona la flecha arriba
  if (variables.upKeyPressed && variables.fuel > 0) {
    variables.velocityX += thrustX
    variables.velocityY += thrustY
    variables.fuel -= 0.1 // Ajusta este valor según el consumo de combustible

    // Agregar píxeles del escape del motor
    for (let i = 0; i < 5; i++) { // Agrega 5 píxeles en cada impulso
      const particle = {
        x: variables.spacecraftX + 6,
        y: variables.spacecraftY + 12, // Posición en la parte inferior de la nave
        velocityX: (Math.random() - 0.5) * 0.2, // Velocidad horizontal aleatoria
        velocityY: Math.random() * 0.5 + 0.2, // Velocidad vertical aleatoria hacia abajo
        size: constants.engineParticleSize, // Tamaño fijo de los píxeles del escape del motor
        lifespan: constants.lifespan, // Vida aleatoria
      }
      updateEngineParticles()

      variables.engineParticles.push(particle)
    }
  }

  // Si la nave ha aterrizado, asegúrate de que la velocidad horizontal también sea 0
  if (variables.landed || variables.crashed) {
    variables.velocityX = 0
    // Si la nave ha chocado contra el suelo, dibuja humo saliendo de la nave
    smokeCrashedShip(canvas, context)
  }

  // Verificar si la nave ha salido de la pantalla
  if (variables.spacecraftY > canvas.height) {
    variables.spacecraftY = canvas.height
    variables.velocityY = 0
  }

  // Actualizar la posición y orientación de la nave
  context.save()
  context.translate(variables.spacecraftX, variables.spacecraftY)
  context.rotate(variables.shipRotationAngle)
  // drawSpacecraft(context, 0, -4) // Dibuja la nave en la posición (0, 0) relativa a la nave girada

  // Dibujar líneas que represente la dirección de la propulsión si alguna tecla es presionada
  context.strokeStyle = variables.upKeyPressed || variables.leftKeyPressed || variables.rightKeyPressed ? "#FF0000" : "#FF000000";
  const lineWidths = [2, 5, 9];

  for (let i = 0; i < 3; i++) {
    const offsetY = i * 5; // Espacio vertical entre cada línea
    context.lineWidth = lineWidths[i]; // Establece el ancho de línea desde el array
    context.beginPath();
    context.moveTo(9, 30 + offsetY);
    const lineEndX = 9 + thrustX * 10;
    const lineEndY = 30 + thrustY * 10 + offsetY;
    context.lineTo(lineEndX, lineEndY);
    context.stroke();
  }
  context.restore();

  // Actualizar y dibujar los píxeles del escape del motor
  for (let i = 0; i < variables.engineParticles.length; i++) {
    const particle = variables.engineParticles[i]

    // Actualizar posición
    particle.x += particle.velocityX
    particle.y += particle.velocityY

    // Reducir la vida útil y eliminar los píxeles si su vida llega a cero
    particle.lifespan--

    if (particle.lifespan <= 0) {
      variables.engineParticles.splice(i, 1)
      i--
    }

    // Dibujar el píxel del escape del motor
    context.fillStyle = particle.color
    context.fillRect(particle.x, particle.y, particle.size, particle.size)
  }
}

//#############################
//#
//#   GAMELOOP()
//#
//#
//#############################

// GAME LOOP
function gameLoop() {
  const {
    fuelItems
  } = variables

  // Limpia el lienzo solo si el juego no está pausado
  context.clearRect(0, 0, canvas.width, canvas.height)
  if (!variables.gamePaused) {
    // Actualiza el tiempo de vuelo solo si el juego no está pausado
    if (!variables.gamePaused && !variables.landed && !variables.crashed && !variables.crushed) {
      variables.flightTime += 1 / 60 // Asumiendo 60 cuadros por segundo
    }

    if (!variables.isGameOver && !variables.landed && !variables.crashed) {
      // Calcular el tiempo transcurrido solo si el juego está en curso
      if (!variables.startTime) {
        variables.startTime = new Date()
      } else {
        const currentTime = new Date()
        variables.elapsedTime = (currentTime - variables.startTime) / 1000 // Convertir a segundos

        // Aumenta asteroidProbability cada N segundos
        if (variables.elapsedTime > constants.asteroidProbabilityIncrementTime) {
          constants.asteroidProbability += variables.asteroidProbabilityIncrement
          // startTime = currentTime; // Reinicia el tiempo de inicio
        }
      }
    }
    // Dibujar el tiempo en el canvas
    drawTime(context, canvas)
    // Dibujar la propulsion en el canvas:
    drawSpeed(context, variables.velocityY)
    // Dibuja el HUD
    drawHUD(variables.crashed, variables.crushed, variables.landed, variables.velocityY, variables.fuel, variables.spacecraftX, variables.spacecraftY, variables.flightTime)

    playThrust(); // Llama a playThrust en cada iteración del bucle

    // Generar un nuevo objeto de fuel si no hay objetos de fuel en pantalla
    if (!fuelItems.some(fuelItem => !fuelItem.collected)) {
      createFuelItem(canvas)
    }
    // Mover y dibujar objetos de fuel
    for (const fuelItem of fuelItems) {
      if (!fuelItem.collected) {
        fuelItem.y += variables.fuelVelocityY // Puedes ajustar la velocidad como desees
        drawFuelItem(context, fuelItem) // Dibuja el objeto de fuel
        drawFuel(context) // Dibuja el fuel
        variables.fuelItemsToKeep.push(fuelItem) // Agrega los objetos de combustible que no se deben eliminar
      }
    }
    // Borrar objetos de fuel si colisionan con el terreno
    fuelItems.forEach((fuelItem, index) => {
      if (fuelItem.collected || fuelItem.y >= canvas.height) {
        fuelItems.splice(index, 1) // Elimina el objeto de combustible
        variables.fuel += constants.fuelQuantityToAdd
      }
    })

    // Crear asteroides con cierta probabilidad
    if (Math.random() < constants.asteroidProbability) {
      createAsteroid(variables.asteroids, canvas)
    }

    // Mover asteroides y eliminarlos si están fuera del lienzo
    for (let i = 0; i < variables.asteroids.length; i++) {
      const asteroid = variables.asteroids[i]
      asteroid.x += asteroid.vx
      asteroid.y += asteroid.vy

      // Verificar si el asteroide está fuera del lienzo
      if (asteroid.y > canvas.height) {
        // Eliminar el asteroide si está fuera del lienzo para evitar que consuma recursos
        variables.asteroids.splice(i, 1)
        i-- // Ajusta el índice para evitar saltarse un asteroide en el siguiente ciclo
      }
    }

    // Dibuja los asteroides en el lienzo
    for (const asteroid of variables.asteroids) {
      drawAsteroid(context, asteroid)
    }

    // Dibuja el terreno lunar
    drawTerrain(context, surface, constants.terrainColor)

    // Actualiza y dibuja la nave espacial
    updateSpacecraft() //leftKeyPressed, rightKeyPressed, upKeyPressed, fuel, fuelItems)
    drawSpacecraft(context, variables.spacecraftX, variables.spacecraftY, variables.crashed)

    // Llama al siguiente cuadro de animación
    requestAnimationFrame(gameLoop)
    // stop the ship and the gameloop if the game is over
    if (variables.landed || variables.crashed) {
      variables.velocityX = 0
      variables.velocityY = 0
      // stop the game loop
      return
    }

  } else {
    variables.fuel === 100 ?
      // mostrar boton para comenzar
      drawPausedText("SPACEBAR", canvas, context) :
      // mostrar PAUSED cuando pausamos el juego
      drawPausedText("PAUSED", canvas, context)
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
export const canvas = document.getElementById("gameCanvas") // Obtén el elemento canvas
export const context = canvas.getContext("2d") // Obtén el contexto de dibujo 2D
// detectViewportSize()
export const surface = generateTerrain(canvas.width / constants.terrainUnitWidth, canvas.height / constants.terrainUnitHeight) // Genera el terreno lunar
export const displayWrapper = document.getElementById("display-wrapper");

// const hud = document.getElementById("hud")

// Inicia el gameLoop
gameLoop()
