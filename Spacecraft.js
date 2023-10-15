import { shipCollisionsWithTerrain, shipCollisionsWithAsteroids, checkFuelCollision, asteroidsCollisions } from './Collisions'
import { updateEngineParticles } from './Particles'
import { constants, variables } from './Config'

//#############################
//#
//#   SHIP
//#
//#
//#############################

// import { gameProps } from "./main"

// DRAW SHIP
// Define la forma de la nave espacial como una matriz de píxeles
export const spacecraftShape = [
  [" ", " ", "S", " ", " "],
  [" ", " ", "S", " ", " "],
  [" ", "S", "S", "S", " "],
  [" ", "S", " ", "S", " "],
  [" ", "S", "S", "S", " "],
  ["S", "S", " ", "S", "S"],
]

// Función para dibujar la nave espacial
export function drawSpacecraft(context) {
  const {
    pixelSizeShip,
    pixelTypes
  } = constants

  const {
    asteroids,
    fuel,
    landed,
    crushed,
    crashed,
    spacecraftY,
    spacecraftX
  } = variables

  // Verificar combustible
  if (fuel <= 0) {
    context.fillStyle = "#999"
  }

  if (!landed && !crushed && !crashed) {
    context.fillStyle = "#EEE" // Color de la nave neutro
  }
  if (landed && !crushed && !crashed) {
    context.fillStyle = "#3F3" // Nave aterrizada bien y sin colisiones
  }
  if ((crushed && !crashed)) {
    context.fillStyle = "#D93" // Nave en el aire y con colisiones
  }
  if (crashed) {
    context.fillStyle = "#F43" // Nave aterrizada mal
  }

  // Dibuja la nave espacial pixel por pixel
  for (let row = 0; row < spacecraftShape.length; row++) {
    for (let col = 0; col < spacecraftShape[0].length; col++) {
      const pixel = spacecraftShape[row][col]
      if (pixel === pixelTypes.ship) {
        context.fillRect(spacecraftX + col * pixelSizeShip, spacecraftY + row * pixelSizeShip, pixelSizeShip, pixelSizeShip)
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

// export function updateSpacecraft(canvas, surface, context, { fuel, asteroids, fuelItems, spacecraftX, spacecraftY, pixelSizeShip, shipRotationAngle, shipRotationSpeed, velocityY, velocityX, incrementVelocityY, leftKeyPressed, rightKeyPressed, upKeyPressed, engineParticles }) { // leftKeyPressed, rightKeyPressed, upKeyPressed, fuelItems) {
export function updateSpacecraft(gameProps) {
  let {
    velocityY,
    velocityX,
    spacecraftX,
    spacecraftY,
    leftKeyPressed,
    rightKeyPressed,
    upKeyPressed,
    shipRotationAngle,
    fuel,
    landed,
    crashed,
    crushed,
    engineParticles,
    engineParticleSize,
    pixelTypes,
    context
  } = gameProps
  const {
    canvas,
    incrementVelocityY,
    engineHorizontalPower,
    engineVerticalPower,
  } = gameProps

  // Aplicar gravedad lunar
  velocityY += incrementVelocityY // Ajusta este valor según la gravedad lunar deseada

  // Actualizar posición de la nave
  spacecraftX += velocityX
  spacecraftY += velocityY

  // Controlar cuando la nave ha salido por el lado izquierdo del lienzo
  let canvasWidth = canvas.width // Coloca la nave en el lado derecho
  if (spacecraftX < 0) {
    // La nave ha salido por el lado izquierdo del lienzo
    spacecraftX = canvasWidth
  } else if (spacecraftX > canvas.width) {
    // La nave ha salido por el lado derecho del lienzo
    spacecraftX = 0 // Coloca la nave en el lado izquierdo
  }

  // Actualizar la rotación de la nave según las teclas izquierda y derecha
  if (leftKeyPressed) {
    shipRotationAngle -= shipRotationSpeed
    if (shipRotationAngle < -0.4) {
      shipRotationAngle = -0.4
    }
  } else if (rightKeyPressed) {
    shipRotationAngle += shipRotationSpeed;
    // Limitar el ángulo de giro a 0.5
    if (shipRotationAngle > 0.4) {
      shipRotationAngle = 0.4;
    }
  } else if (!leftKeyPressed && !rightKeyPressed) {
    // actualizar dejar de rotar la nave si las teclas dejan de ser presionadas
    shipRotationAngle = 0
  }

  // Actualiza el valor del elemento progress para FUEL
  const hudFuel = document.getElementById("hud-fuel")
  hudFuel.value = fuel
  // change the color of the hud-fuel component if fuel is 0
  if (fuel === 0) {
    hudFuel.classList("hud-fuel__empty")
  }

  // Calcular los componentes de la fuerza de propulsión
  const thrustX = Math.sin(shipRotationAngle) * engineHorizontalPower // Ajusta la fuerza según la potencia deseada
  const thrustY = -Math.cos(shipRotationAngle) * engineVerticalPower // Ajusta la fuerza según la potencia deseada

  // Aplicar la fuerza de propulsión cuando se presiona la flecha arriba
  if (upKeyPressed && fuel > 0 && !crushed && !crashed && !landed) {
    velocityX += thrustX
    velocityY += thrustY
    fuel -= crushed ? 0.3 : 0.1 // Ajusta este valor según el consumo de combustible
  }

  shipCollisionsWithTerrain(surface, engineParticles)

  shipCollisionsWithAsteroids(engineParticles, asteroids)

  asteroidsCollisions(surface, engineParticles, context)

  checkFuelCollision(spacecraftX, spacecraftY, fuelItems, fuel, pixelSizeShip)

  // Aplicar la fuerza de propulsión cuando se presiona la flecha arriba
  if (upKeyPressed && fuel > 0) {
    velocityX += thrustX
    velocityY += thrustY
    fuel -= 0.1 // Ajusta este valor según el consumo de combustible

    // Agregar píxeles del escape del motor
    for (let i = 0; i < 5; i++) { // Agrega 5 píxeles en cada impulso
      const particle = {
        x: spacecraftX + 6,
        y: spacecraftY + 10, // Posición en la parte inferior de la nave
        velocityX: (Math.random() - 0.5) * 0.2, // Velocidad horizontal aleatoria
        velocityY: Math.random() * 0.5 + 0.2, // Velocidad vertical aleatoria hacia abajo
        size: engineParticleSize, // Tamaño fijo de los píxeles del escape del motor
        lifespan: lifespan, // Vida aleatoria
      }
      updateEngineParticles(engineParticles)

      engineParticles.push(particle)
    }
  }

  // Si la nave ha aterrizado, asegúrate de que la velocidad horizontal también sea 0
  if (landed || crashed) {
    velocityX = 0
  }

  // Verificar si la nave ha salido de la pantalla
  if (spacecraftY > height) {
    spacecraftY = height
    velocityY = 0
  }

  // Actualizar la posición y orientación de la nave
  context.save()
  context.translate(spacecraftX, spacecraftY)
  context.rotate(shipRotationAngle)
  // drawSpacecraft(context, 0, 0) // Dibuja la nave en la posición (0, 0) relativa a la nave girada

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
  for (let i = 0; i < engineParticles.length; i++) {
    const particle = engineParticles[i]

    // Actualizar posición
    particle.x += particle.velocityX
    particle.y += particle.velocityY

    // Reducir la vida útil y eliminar los píxeles si su vida llega a cero
    particle.lifespan--

    if (particle.lifespan <= 0) {
      engineParticles.splice(i, 1)
      i--
    }

    // Dibujar el píxel del escape del motor
    context.fillStyle = particle.color
    context.fillRect(particle.x, particle.y, particle.size, particle.size)
  }
}