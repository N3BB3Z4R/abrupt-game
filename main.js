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
// import { checkFuelCollision } from './Collisions.js'
import { isPixelInsideAsteroid, shipCollisionsWithTerrain } from './Collisions.js' // shipCollisionsWithAsteroids
import { drawHUD, drawSpeed, drawTime, drawPausedText, drawTextOnScreen, drawFinalScore } from './Hud.js'
import { jumpingPixels, updateEngineParticles } from './Particles.js'
import { drawFuelItem, createFuelItem } from './Fuel.js'
import { restartGame } from './Utils.js'
import { constants, variables } from "./Config.js"

//#############################
//#
//#   CONTROLS
//#
//#
//#############################

// Verificar si el usuario está en un dispositivo móvil
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Función para cambiar la opción de control
function changeControlOption(option) {
  variables.controlOption = option;
}

if (variables.controlOption === "keyboard" && !isMobile) {
  // CONTROLES TECLADO Agregar eventos de teclado para detectar las teclas presionadas
  document.addEventListener("keydown", function (event) {
    // añade aqui la variable de movimiento del raton en eje X
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      variables.leftKeyPressed = true
    } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      variables.rightKeyPressed = true
    } else if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
      variables.upKeyPressed = true
    } else if (event.key === " ") {
      // Tecla Espacio para pausar/reanudar el juego
      variables.gamePaused = !variables.gamePaused
      if (!variables.gamePaused) {
        // Si se reanuda el juego, solicita un nuevo cuadro de animación
        requestAnimationFrame(gameLoop)
      } else if (variables.isGameOver) {
        restartGame()
      }
    } else if (event.key === "r" || event.key === "R") {
      // Tecla R para reiniciar el juego
      restartGame()
    }
  })

  // CONTROLES TECLADO Agregar eventos de teclado para detectar las teclas que dejan de ser presionadas
  document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      variables.leftKeyPressed = false
    } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      variables.rightKeyPressed = false
    } else if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
      variables.upKeyPressed = false
    } else if (event.key === " ") {
      // Tecla Espacio liberada
      // Puedes realizar alguna acción adicional aquí si es necesario
    } else if (event.key === "r" || event.key === "R") {
      // Tecla R liberada
      // Puedes realizar alguna acción adicional aquí si es necesario
    }
  })
}

if (variables.controlOption === "mouse" && !isMobile) {
  // CONTROLES RATON Agregar eventos de raton
  document.addEventListener("mousedown", function (event) {
    // Verifica si se hizo clic en el botón izquierdo del ratón
    if (event.button === 0) {
      variables.upKeyPressed = true
    }
  })
  document.addEventListener("mouseup", function (event) {
    // Verifica si se soltó el botón izquierdo del ratón
    if (event.button === 0) {
      variables.upKeyPressed = false
    }
  })
  document.addEventListener("mousemove", function (event) {
    // Obtén la posición actual del ratón en el eje X
    const mouseX = event.clientX

    // Define un umbral para determinar la mitad de la pantalla
    const screenHalf = window.innerWidth / 2

    // Comprueba si el ratón está a la izquierda o a la derecha de la mitad de la pantalla
    if (mouseX < screenHalf) {
      // El ratón está a la izquierda de la mitad de la pantalla, puedes hacer algo para mover a la izquierda
      variables.leftKeyPressed = true
      variables.rightKeyPressed = false // Asegúrate de que no se esté presionando la tecla de mover a la derecha
    } else {
      // El ratón está a la derecha de la mitad de la pantalla, puedes hacer algo para mover a la derecha
      variables.rightKeyPressed = true
      variables.leftKeyPressed = false // Asegúrate de que no se esté presionando la tecla de mover a la izquierda
    }
  })
}

if (isMobile) {
  // CONTROLES MOVIL
  let touchStartX = 0
  let touchEndX = 0

  document.addEventListener("touchstart", function (event) {
    // Obtén la posición X del primer toque
    touchStartX = event.touches[0].clientX

    // Realiza alguna acción cuando se inicia el toque (por ejemplo, mover hacia arriba)
    variables.upKeyPressed = true
  })

  document.addEventListener("touchend", function (event) {
    // Obtén la posición X del último toque
    touchEndX = event.changedTouches[0].clientX

    // Calcula la distancia entre el inicio y el final del toque
    const touchDistanceX = touchEndX - touchStartX

    // Define un umbral para determinar si el deslizamiento fue hacia la izquierda o hacia la derecha
    const swipeThreshold = 50 // Puedes ajustar este valor según tus necesidades

    if (touchDistanceX < -swipeThreshold) {
      // Deslizamiento hacia la izquierda, puedes hacer algo para mover a la izquierda
      variables.leftKeyPressed = true
      variables.rightKeyPressed = false // Asegúrate de que no se esté presionando la tecla de mover a la derecha
    } else if (touchDistanceX > swipeThreshold) {
      // Deslizamiento hacia la derecha, puedes hacer algo para mover a la derecha
      variables.rightKeyPressed = true
      variables.leftKeyPressed = false // Asegúrate de que no se esté presionando la tecla de mover a la izquierda
    } else {
      // Realiza alguna acción si el deslizamiento no alcanza el umbral (por ejemplo, saltar)
      // Puedes personalizar esta acción según las necesidades de tu juego
    }

    // Realiza alguna acción cuando se finaliza el toque (por ejemplo, dejar de mover hacia arriba)
    variables.upKeyPressed = false
  })

  // Evitar el desplazamiento de la página en dispositivos móviles al tocar y deslizar
  document.body.addEventListener("touchmove", function (event) {
    event.preventDefault()
  })
}

//#############################
//#
//#   COLLISIONS
//#
//#
//#############################

// Detecta colisiones de la nave con los asteroides
const shipCollisionsWithAsteroids = () => {
  const {
    pixelSizeShip
  } = constants

  // Verificar colisiones de nave con asteroides
  for (let i = 0; i < variables.asteroids.length; i++) {
    const asteroid = variables.asteroids[i]

    // Verifica si algún píxel de la nave coincide con algún píxel del asteroide
    for (let row = 0; row < spacecraftShape.length; row++) {
      for (let col = 0; col < spacecraftShape[0].length; col++) {
        if (spacecraftShape[row][col] === constants.pixelTypes.ship && isPixelInsideAsteroid(variables.spacecraftX + col * constants.pixelSizeShip, variables.spacecraftY + row * constants.pixelSizeShip, asteroid)) {
          // if (spacecraftShape[row][col] === pixelTypes.asteroid && isPixelInsideAsteroid(spacecraftX + col * pixelSizeShip, spacecraftY + row * pixelSizeShip, asteroid)) {
          // Ha ocurrido una colisión entre la nave y el asteroide
          variables.crushed = true

          // Llama a jumpingPixels para simular una explosión
          const explosion = jumpingPixels(variables.spacecraftX, variables.spacecraftY, -1.5, pixelSizeShip, constants.explosionNumberPixels) // -1.5 para una explosión hacia arriba
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

const asteroidsCollisions = () => {
  // Actualiza la posición de los asteroides y verifica las colisiones entre ellos
  for (let i = 0; i < variables.asteroids.length; i++) {
    const asteroidA = variables.asteroids[i]

    for (let j = i + 1; j < variables.asteroids.length; j++) {
      const asteroidB = variables.asteroids[j]

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
        const explosionA = jumpingPixels(asteroidA.x, asteroidA.y, -1.5, asteroidA.size, constants.explosionNumberPixels) // -1.5 para una explosión hacia arriba
        const explosionB = jumpingPixels(asteroidB.x, asteroidB.y, -1.5, asteroidB.size, constants.explosionNumberPixels) // -1.5 para una explosión hacia arriba

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
    const columnX = Math.floor(asteroidA.x / constants.terrainUnitWidth)
    const columnY = Math.floor(asteroidA.y / constants.terrainUnitHeight)

    if (
      columnX >= 0 &&
      columnX < surface.length &&
      columnY >= 0 &&
      columnY < surface[columnX].length &&
      surface[columnX][columnY] === constants.pixelTypes.hole
    ) {
      // Colisión con el terreno
      variables.asteroids.splice(i, 1) // Elimina el asteroide de la lista
      i-- // Ajusta el índice para evitar saltarse un asteroide en el siguiente ciclo

      // Llama a jumpingPixels para simular una explosión
      const explosionA = jumpingPixels(asteroidA.x, asteroidA.y, -1.5, asteroidA.size, constants.explosionNumberPixels) // -1.5 para una explosión hacia arriba
      // Agrega los píxeles de la explosión al array engineParticles para que se dibujen
      variables.engineParticles.push(...explosionA)

      // Crea un objeto para representar el píxel que salta
      jumpingPixels(asteroidA.x, asteroidA.y, -1.5, asteroidA.size, constants.explosionNumberPixels) // Velocidad inicial hacia arriba (ajusta según tu necesidad)
    } else {
      // Actualiza la posición del asteroide si no ha colisionado con el terreno
      asteroidA.x += asteroidA.vx
      asteroidA.y += asteroidA.vy
    }
  }
}

// Comprueba que la nave haya recogido el objeto de combustible y le suma puntos de combustible
function checkFuelCollision(fuelItems) {
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
        // La nave ha recogido el objeto de combustible
        variables.fuel += constants.incrementFuelItem // Suma 20 puntos de combustible
        fuelItem.collected = true // Marca el objeto de combustible como recogido
      }
    }
  }
}

//#############################
//#
//#   SHIP UPDATE AND LOGIC (da guerra)
//#
//#
//#############################

function updateSpacecraft() { // leftKeyPressed, rightKeyPressed, upKeyPressed, fuelItems) {
  const {
    fuelItems
  } = variables

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

  asteroidsCollisions()

  checkFuelCollision(fuelItems)

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

  // Dibujar una línea que represente la dirección de la propulsión
  context.strokeStyle = "#FF0000";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(9, 30);
  const lineEndX = 9 + thrustX * 10; // Ajusta el factor (10) según la longitud deseada de la línea
  const lineEndY = 30 + thrustY * 10; // Ajusta el factor (10) según la longitud deseada de la línea
  context.lineTo(lineEndX, lineEndY);
  context.stroke();

  context.restore()

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
    drawTime(context, variables.elapsedTime)
    // Dibujar la propulsion en el canvas:
    drawSpeed(context, variables.velocityY)
    // Dibuja el HUD
    drawHUD(variables.crashed, variables.crushed, variables.landed, variables.velocityY, variables.fuel, variables.spacecraftX, variables.spacecraftY, variables.flightTime)

    // Generar un nuevo objeto de fuel si no hay objetos de fuel en pantalla
    if (!fuelItems.some(fuelItem => !fuelItem.collected)) {
      createFuelItem(canvas)
    }
    // Mover y dibujar objetos de fuel
    for (const fuelItem of fuelItems) {
      if (!fuelItem.collected) {
        fuelItem.y += variables.fuelVelocityY // Puedes ajustar la velocidad como desees
        drawFuelItem(context, fuelItem) // Dibuja el objeto de fuel
        variables.fuelItemsToKeep.push(fuelItem) // Agrega los objetos de combustible que no se deben eliminar
      }
    }
    // fuelItems = [...fuelItemsToKeep]; // Reemplaza el array original
    // Borrar objetos de fuel si colisionan con el terreno
    fuelItems.forEach((fuelItem, index) => {
      if (fuelItem.collected || fuelItem.y >= canvas.height) {
        fuelItems.splice(index, 1) // Elimina el objeto de combustible
        variables.fuel += constants.fuelQuantityToAdd
      }
    })
    // Añade N puntos de fuel al colisionar con el objeto de fuel
    function collectFuelItem(fuelItem) {
      if (!fuelItem.collected && isCollidingWith(fuelItem)) {
        fuelItem.collected = true
        variables.fuel += 50 // Incrementamos la cantidad de combustible en 50 puntos a nivel global
      }
    }

    // Función para verificar colisiones entre la nave y un objeto de combustible
    function isCollidingWith(fuelItem) {
      // Coordenadas de la nave y el objeto de combustible
      const naveX = nave.x
      const naveY = nave.y
      const fuelX = fuelItem.x
      const fuelY = fuelItem.y

      // Tamaño de la nave y el objeto de combustible
      const naveWidth = nave.width
      const naveHeight = nave.height
      const fuelWidth = fuelItem.width
      const fuelHeight = fuelItem.height

      // Definir la distancia mínima para considerar una colisión (puede ajustarse según tus necesidades)
      const minDistanceX = (naveWidth + fuelWidth) / 2
      const minDistanceY = (naveHeight + fuelHeight) / 2

      // Calcular la distancia entre el centro de la nave y el centro del objeto de combustible
      const deltaX = Math.abs(naveX - fuelX)
      const deltaY = Math.abs(naveY - fuelY)

      // Si la distancia en ambos ejes es menor que la distancia mínima, hay una colisión
      if (deltaX < minDistanceX && deltaY < minDistanceY) {
        return true // Colisión detectada
      }

      return false // No hay colisión
    }

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
// const hud = document.getElementById("hud")

// Inicia el gameLoop
gameLoop()